const express = require('express');
const axios = require('axios');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const HF_API_TOKEN = process.env.HF_API_TOKEN; // Optional: free Hugging Face Inference token
const HF_MODEL = process.env.HF_MODEL || 'facebook/bart-large-cnn';

// Lightweight extractive summarizer (fallback, entirely local and open-source)
const STOP_WORDS = new Set([
  'the','and','a','an','of','to','in','on','for','with','at','by','from','up','about','into','over','after','is','are','was','were','be','been','being','it','that','as','this','but','or','if','because','while','so','than','too','very','can','cannot','could','should','would','may','might','do','does','did','doing','have','has','had','having','i','you','he','she','they','them','we','us','our','your','his','her','their'
]);

function splitSentences(text) {
  return (text || '')
    .replace(/\s+/g, ' ')
    .match(/[^.!?\n]+[.!?]?/g) || [];
}

function summarizeExtractive(text, maxSentences = 8) {
  const sentences = splitSentences(text).map(s => s.trim()).filter(Boolean);
  if (sentences.length <= maxSentences) return sentences.join(' ');
  const freq = new Map();
  for (const s of sentences) {
    for (const w of s.toLowerCase().match(/[a-zA-Z']+/g) || []) {
      if (STOP_WORDS.has(w) || w.length < 3) continue;
      freq.set(w, (freq.get(w) || 0) + 1);
    }
  }
  const scored = sentences.map((s, idx) => {
    let score = 0;
    for (const w of s.toLowerCase().match(/[a-zA-Z']+/g) || []) {
      if (STOP_WORDS.has(w) || w.length < 3) continue;
      score += freq.get(w) || 0;
    }
    return { idx, s, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, maxSentences).sort((a, b) => a.idx - b.idx).map(x => x.s);
  return selected.join(' ');
}

function topProperNouns(text, limit = 5) {
  const counts = new Map();
  const words = (text || '').match(/\b[A-Z][a-z]+\b/g) || [];
  for (const w of words) {
    if (['I','The','A','He','She','They','We','You'].includes(w)) continue;
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  return Array.from(counts.entries()).sort((a,b)=>b[1]-a[1]).slice(0,limit).map(([w])=>w);
}

function hasAny(text, list) {
  return list.some(k => new RegExp(`\\b${k}\\b`, 'i').test(text || ''));
}

function structuredSummaryFromText(text, opts = { scope: 'book' }) {
  const clean = (text || '').replace(/\s+/g,' ').trim();
  if (!clean) return 'No extractable text found.';
  const nouns = topProperNouns(clean, 6);
  const mainChar = nouns[0] || 'the protagonist';
  const goalMap = [
    { k: ['enlighten','enlightenment','wisdom','meaning','purpose'], v: 'enlightenment and the meaning of life' },
    { k: ['love','beloved','romance'], v: 'love and connection' },
    { k: ['revenge','vengeance'], v: 'revenge against a rival' },
    { k: ['freedom','escape','liberty'], v: 'freedom from oppression' },
    { k: ['survival','danger','war'], v: 'survival through hardship' }
  ];
  let goal = 'a personal quest';
  for (const g of goalMap) { if (hasAny(clean, g.k)) { goal = g.v; break; } }
  const stages = [];
  if (hasAny(clean, ['leave','left','depart','home','father','family'])) stages.push('leaving home');
  if (hasAny(clean, ['Samana','ascetic','Buddha','Gotama','monk'])) stages.push('ascetic life and meeting spiritual teachers');
  if (hasAny(clean, ['Kamala','wealth','merchant','Kamaswami','pleasure','city'])) stages.push('worldly life of desire and wealth');
  if (hasAny(clean, ['river','ferryman','Vasudeva'])) stages.push('life by the river and learning from nature');
  if (hasAny(clean, ['Om','unity','oneness','awaken','enlighten','peace'])) stages.push('realization and inner awakening');
  const themeList = [];
  if (hasAny(clean, ['self','self-realization','self discovery'])) themeList.push('self-realization');
  if (hasAny(clean, ['teacher','teaching','doctrine','preach','lesson','experience'])) themeList.push('experience over teaching');
  if (hasAny(clean, ['Samsara','cycle','impermanence','change'])) themeList.push('impermanence (Samsara)');
  if (hasAny(clean, ['unity','oneness','river','all'])) themeList.push('unity of life');
  if (themeList.length === 0) themeList.push('personal growth');
  let outcome = 'finds a measure of inner peace and wisdom';
  if (hasAny(clean, ['peace','wisdom','smile','serenity','enlighten'])) outcome = 'finds inner peace and wisdom';
  const sentences = [];
  sentences.push(`The story centers on ${mainChar}, who pursues ${goal}.`);
  if (stages.length) sentences.push(`Major stages include ${stages.join(', ')}.`);
  sentences.push(`Core themes include ${themeList.join(', ')}.`);
  sentences.push(`Ultimately, the journey ${outcome}.`);
  if (opts.scope === 'page') {
    sentences.push('This summary reflects the current page context and omits lengthy details.');
  } else {
    sentences.push('This is a condensed overview in my own words without quotes.');
  }
  return sentences.join(' ');
}

async function summarizeWithHF(text) {
  if (!HF_API_TOKEN) return null;
  try {
    const url = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
    const resp = await axios.post(
      url,
      { inputs: text, parameters: { max_length: 220, min_length: 80, do_sample: false } },
      { headers: { Authorization: `Bearer ${HF_API_TOKEN}` }, timeout: 30000 }
    );
    const data = resp.data;
    if (Array.isArray(data) && data.length && data[0].summary_text) {
      return data[0].summary_text;
    }
    if (data?.summary_text) return data.summary_text;
    return null;
  } catch (err) {
    // Fall back silently
    return null;
  }
}

function chunkText(text, maxChars = 4800) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + maxChars));
    i += maxChars;
  }
  return chunks;
}

async function readPdfBuffer(pdfUrl) {
  // Supports absolute http(s) URLs and local server paths like /uploads/pdfs/xxx.pdf
  if (/^https?:\/\//i.test(pdfUrl)) {
    const pdfResp = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    return pdfResp.data;
  }
  // Local path handling
  let rel = pdfUrl.startsWith('/') ? pdfUrl.slice(1) : pdfUrl;
  // Ensure it points inside server directory
  const localPath = path.join(__dirname, '..', rel);
  return await fs.promises.readFile(localPath);
}

// ---- Dynamic NLP extraction (rule-based; no external deps) ----
function tokenizeSentences(text) {
  return (text || '').replace(/\s+/g, ' ').match(/[^.!?\n]+[.!?]?/g) || [];
}

function extractCharacters(text, limit = 5) {
  const counts = new Map();
  const words = (text || '').match(/\b[A-Z][a-z]+\b/g) || [];
  for (const w of words) {
    if (['I','The','A','He','She','They','We','You'].includes(w)) continue;
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  return Array.from(counts.entries()).sort((a,b)=>b[1]-a[1]).slice(0,limit).map(([w])=>w);
}

const TURNING_POINT_MARKERS = ['however','but','suddenly','yet','though','until','then','afterward','eventually','nevertheless','nonetheless','instead','ultimately','finally','realizes','decides','confronts','leaves','returns'];
const STRONG_VERBS = ['confronts','discovers','decides','learns','rejects','accepts','escapes','meets','abandons','reflects','confesses','seeks','dies','wins','fails','changes','transforms','chooses'];
const CONCEPT_LEXICON = ['enlightenment','wisdom','unity','oneness','self','self-realization','experience','teaching','doctrine','samsara','nirvana','karma','desire','attachment','detachment','suffering','meaning','purpose','freedom','love','compassion','duality','truth','peace','serenity','awakening','meditation'];

function detectConcepts(text) {
  const found = [];
  for (const c of CONCEPT_LEXICON) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(text)) found.push(c);
  }
  return Array.from(new Set(found));
}

function detectStage(text) {
  const map = [
    { k: ['leave','left','depart','home','father','family'], v: 'leaving home' },
    { k: ['Samana','ascetic','Buddha','Gotama','monk','teacher'], v: 'ascetic study and meeting spiritual teachers' },
    { k: ['Kamala','merchant','Kamaswami','city','pleasure','wealth','desire'], v: 'worldly desires and wealth' },
    { k: ['river','ferryman','Vasudeva','nature'], v: 'learning from the river and nature' },
    { k: ['Om','oneness','unity','awaken','enlighten','peace','serenity'], v: 'inner awakening and peace' }
  ];
  for (const m of map) { if (m.k.some(k => new RegExp(`\\b${k}\\b`, 'i').test(text))) return m.v; }
  return 'a transitional phase';
}

function extractEvents(text) {
  const sentences = tokenizeSentences(text).map(s => s.trim());
  const events = [];
  for (const s of sentences) {
    const lower = s.toLowerCase();
    if (TURNING_POINT_MARKERS.some(m => lower.includes(m)) || STRONG_VERBS.some(v => lower.includes(v))) {
      events.push(s);
    }
  }
  return events.slice(0, 5);
}

function analyzeText(text) {
  const clean = (text || '').replace(/\s+/g,' ').trim();
  const characters = extractCharacters(clean, 6);
  const concepts = detectConcepts(clean);
  const stage = detectStage(clean);
  const events = extractEvents(clean);
  return { clean, characters, concepts, stage, events };
}

function composePageSummary(analysis) {
  const { characters, concepts, stage, events, clean } = analysis;
  const main = characters[0] || 'the protagonist';
  const eventLine = events.length ? events[0] : null;
  const turningLine = events.length > 1 ? events[1] : null;
  const conceptStr = concepts.length ? concepts.slice(0,3).join(', ') : null;
  const sentences = [];
  sentences.push(`On this page, ${main} is in ${stage}.`);
  if (eventLine) sentences.push(eventLine.replace(/\s+/g, ' '));
  if (turningLine) sentences.push(turningLine.replace(/\s+/g, ' '));
  if (conceptStr) sentences.push(`Philosophical concepts explored include ${conceptStr}.`);
  // Limit to 3–5 sentences
  return sentences.slice(0,5).join(' ');
}

function aggregateStages(allTexts) {
  const labels = [];
  for (const t of allTexts) labels.push(detectStage(t));
  // Reduce consecutive duplicates
  const arc = [];
  for (const l of labels) { if (!arc.length || arc[arc.length-1] !== l) arc.push(l); }
  return arc.slice(0,6);
}

function composeBookSummary(fullText) {
  const chunks = chunkText(fullText, 8000);
  const characters = extractCharacters(fullText, 8);
  const concepts = detectConcepts(fullText).slice(0,5);
  // Pull high-signal sentences from across the book
  const candidateSentences = [];
  for (const chunk of chunks) {
    const extractive = summarizeExtractive(chunk, 2);
    const parts = tokenizeSentences(extractive).map(s => s.trim());
    for (const p of parts) candidateSentences.push(p);
  }
  // Deduplicate similar sentences and trim
  const unique = [];
  const seen = new Set();
  for (const s of candidateSentences) {
    const key = s.toLowerCase().replace(/[^a-z0-9]+/g,' ').slice(0,140);
    if (!seen.has(key)) { seen.add(key); unique.push(s); }
    if (unique.length >= 6) break;
  }
  const main = characters[0] || 'the protagonist';
  const secondary = characters[1] ? ` and ${characters[1]}` : '';
  const conceptStr = concepts.length ? concepts.join(', ') : null;
  const lines = [];
  lines.push(`${main}${secondary} features prominently, anchoring the narrative.`);
  if (unique.length) lines.push(unique.join(' '));
  if (conceptStr) lines.push(`The book explores ${conceptStr}.`);
  // Single paragraph, concise and content-specific
  return lines.join(' ');
}

function verifyAccuracy(sourceText, summary) {
  // Ensure nouns/keywords in summary appear in source to maintain grounding
  const src = (sourceText || '').toLowerCase();
  const tokens = (summary || '').toLowerCase().match(/[a-zA-Z']{4,}/g) || [];
  let hits = 0;
  for (const t of tokens) { if (src.includes(t)) hits++; }
  const coverage = tokens.length ? hits / tokens.length : 0;
  // Require decent coverage; otherwise prefer extractive fallback
  return coverage >= 0.55;
}

router.post('/', async (req, res) => {
  try {
    const { scope, text, pdfUrl } = req.body || {};
    if (scope === 'page') {
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Missing page text for summarization' });
      }
      // Dynamic NLP analysis and composition
      const analysis = analyzeText(text);
      let summary = composePageSummary(analysis);
      // Accuracy check; if weak, fallback to HF or extractive
      if (!verifyAccuracy(text, summary)) {
        const hf = await summarizeWithHF(text);
        summary = hf || structuredSummaryFromText(text, { scope: 'page' }) || summarizeExtractive(text);
      }
      return res.json({ summary, source: HF_API_TOKEN ? 'dynamic+hf_fallback' : 'dynamic+local_fallback' });
    }

    if (scope === 'book') {
      if (!pdfUrl || typeof pdfUrl !== 'string') {
        return res.status(400).json({ error: 'Missing pdfUrl for book summarization' });
      }
      // Fetch PDF and extract text (supports local /uploads paths)
      const buffer = await readPdfBuffer(pdfUrl);
      const parsed = await pdfParse(buffer);
      const fullText = parsed.text || '';
      if (!fullText.trim()) {
        return res.status(400).json({ error: 'No extractable text found in PDF' });
      }
      // Compose directly from full text using dynamic analysis
      let summary = composeBookSummary(fullText);
      if (!verifyAccuracy(fullText, summary)) {
        // If accuracy is weak, compress via HF or extractive fallback only (no generic template)
        const hf = await summarizeWithHF(fullText);
        summary = hf || summarizeExtractive(fullText);
      }
      return res.json({ summary, source: HF_API_TOKEN ? 'dynamic+hf_fallback' : 'dynamic+local_fallback' });
    }

    return res.status(400).json({ error: 'Invalid scope. Use "page" or "book".' });
  } catch (err) {
    console.error('Summarize route error:', err);
    return res.status(500).json({ error: 'Failed to summarize content' });
  }
});

module.exports = router;
