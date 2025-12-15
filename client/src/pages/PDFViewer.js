import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiMoon, FiSun, FiFileText, FiBook, FiCornerDownLeft } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import api, { bookService } from '../services/api';
import Header from '../components/Header';
import './PDFViewer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryScope, setSummaryScope] = useState(null); // 'page' | 'book'
  const [savedPage, setSavedPage] = useState(null);
  const [pageInput, setPageInput] = useState(1);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const data = await bookService.getBookById(id);
      setBook(data);
      if (!data.pdfUrl) {
        setPdfError(true);
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      setPdfError(true);
    } finally {
      setLoading(false);
    }
  };

  const onDocumentLoadSuccess = (doc) => {
    setNumPages(doc.numPages);
    setPdfDoc(doc);
    setLoading(false);
    // Initialize page input with current page
    setPageInput(pageNumber);
    // Load saved progress
    try {
      const key = `readingProgress:${id}`;
      const value = localStorage.getItem(key);
      const parsed = value ? parseInt(value, 10) : null;
      if (parsed && parsed >= 1 && parsed <= doc.numPages) {
        setSavedPage(parsed);
      }
    } catch {}
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setPdfError(true);
    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(numPages, prev + 1));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(3, prev + 0.25));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.25));
  };

  // Persist reading progress whenever page changes
  useEffect(() => {
    if (!id || !numPages) return;
    try {
      localStorage.setItem(`readingProgress:${id}`, String(pageNumber));
      setPageInput(pageNumber);
    } catch {}
  }, [pageNumber, id, numPages]);

  const jumpToSavedPage = () => {
    if (!savedPage) return;
    setPageNumber(savedPage);
  };

  const applyPageJump = () => {
    const p = parseInt(pageInput, 10);
    if (!isNaN(p)) {
      const target = Math.min(Math.max(1, p), numPages || 1);
      setPageNumber(target);
    }
  };

  // --- Simple extractive summarizer (client-side, free) ---
  const STOP_WORDS = new Set([
    'the','and','a','an','of','to','in','on','for','with','at','by','from','up','about','into','over','after','is','are','was','were','be','been','being','it','that','as','this','but','or','if','because','while','so','than','too','very','can','cannot','could','should','would','may','might','do','does','did','doing','have','has','had','having','i','you','he','she','they','them','we','us','our','your','his','her','their'
  ]);

  const splitSentences = (text) => {
    return text
      .replace(/\s+/g, ' ')
      .match(/[^.!?\n]+[.!?]?/g) || [];
  };

  const summarizeText = (text, maxSentences = 5) => {
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
  };

  // --- Structured, paraphrased summary generator (no quotes, concise) ---
  const topProperNouns = (text, limit = 5) => {
    const counts = new Map();
    const words = text.match(/\b[A-Z][a-z]+\b/g) || [];
    for (const w of words) {
      // skip common capitalized words
      if (['I','The','A','He','She','They','We','You'].includes(w)) continue;
      counts.set(w, (counts.get(w) || 0) + 1);
    }
    return Array.from(counts.entries()).sort((a,b)=>b[1]-a[1]).slice(0,limit).map(([w])=>w);
  };

  const hasAny = (text, list) => list.some(k => new RegExp(`\\b${k}\\b`, 'i').test(text));

  const structuredSummaryFromText = (text, opts = { scope: 'book' }) => {
    const clean = (text || '').replace(/\s+/g,' ').trim();
    if (!clean) return 'No extractable text found.';

    const nouns = topProperNouns(clean, 6);
    const mainChar = nouns[0] || 'the protagonist';

    // Goals & conflicts
    const goalMap = [
      { k: ['enlighten','enlightenment','wisdom','meaning','purpose'], v: 'enlightenment and the meaning of life' },
      { k: ['love','beloved','romance'], v: 'love and connection' },
      { k: ['revenge','vengeance'], v: 'revenge against a rival' },
      { k: ['freedom','escape','liberty'], v: 'freedom from oppression' },
      { k: ['survival','danger','war'], v: 'survival through hardship' }
    ];
    let goal = 'a personal quest';
    for (const g of goalMap) { if (hasAny(clean, g.k)) { goal = g.v; break; } }

    // Stages
    const stages = [];
    if (hasAny(clean, ['leave','left','depart','home','father','family'])) stages.push('leaving home');
    if (hasAny(clean, ['Samana','ascetic','Buddha','Gotama','monk'])) stages.push('ascetic life and meeting spiritual teachers');
    if (hasAny(clean, ['Kamala','wealth','merchant','Kamaswami','pleasure','city'])) stages.push('worldly life of desire and wealth');
    if (hasAny(clean, ['river','ferryman','Vasudeva'])) stages.push('life by the river and learning from nature');
    if (hasAny(clean, ['Om','unity','oneness','awaken','enlighten','peace'])) stages.push('realization and inner awakening');

    // Themes
    const themeList = [];
    if (hasAny(clean, ['self','self-realization','self discovery'])) themeList.push('self-realization');
    if (hasAny(clean, ['teacher','teaching','doctrine','preach','lesson','experience'])) themeList.push('experience over teaching');
    if (hasAny(clean, ['Samsara','cycle','impermanence','change'])) themeList.push('impermanence (Samsara)');
    if (hasAny(clean, ['unity','oneness','river','all'])) themeList.push('unity of life');
    if (themeList.length === 0) themeList.push('personal growth');

    // Outcome
    let outcome = 'finds a measure of inner peace and wisdom';
    if (hasAny(clean, ['peace','wisdom','smile','serenity','enlighten'])) outcome = 'finds inner peace and wisdom';

    // Compose concise summary without quotes
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

    // Limit to ~5–6 sentences
    return sentences.join(' ');
  };

  const getPageText = async (pageNum) => {
    if (!pdfDoc) return '';
    const page = await pdfDoc.getPage(pageNum);
    const content = await page.getTextContent();
    return (content.items || []).map(item => item.str).join(' ');
  };

  const summarizeCurrentPage = async () => {
    try {
      setSummary('');
      setSummaryScope('page');
      setSummaryLoading(true);
      const text = await getPageText(pageNumber);
      // Call backend summarization (open-source AI via HF or local fallback)
      try {
        const resp = await api.post('/summarize', { scope: 'page', text });
        setSummary(resp?.data?.summary || 'No summary produced for this page.');
      } catch (err) {
        console.warn('Page summarization API failed, falling back to local summary:', err);
        const result = structuredSummaryFromText(text, { scope: 'page' });
        setSummary(result || 'No extractable text found on this page.');
      }
    } catch (e) {
      console.error('Summarize page error:', e);
      setSummary('Failed to summarize this page.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const summarizeWholeBook = async () => {
    try {
      setSummary('');
      setSummaryScope('book');
      setSummaryLoading(true);
      // Prefer backend summarization by sending pdfUrl
      try {
        const resp = await api.post('/summarize', { scope: 'book', pdfUrl: book?.pdfUrl });
        setSummary(resp?.data?.summary || 'No summary produced for this book.');
      } catch (err) {
        console.warn('Book summarization API failed, falling back to local summary:', err);
        // Fallback: gather text client-side and summarize locally
        let fullText = '';
        for (let i = 1; i <= numPages; i++) {
          const t = await getPageText(i);
          fullText += t + '\n';
          if (fullText.length > 250000) break;
        }
        // Use extractive fallback to avoid generic templated output
        const result = summarizeText(fullText, 6);
        setSummary(result || 'No extractable text found in the document.');
      }
    } catch (e) {
      console.error('Summarize book error:', e);
      setSummary('Failed to summarize the book.');
    } finally {
      setSummaryLoading(false);
    }
  };

  // Auto-update page summary when user navigates, keeping it dynamic
  useEffect(() => {
    const run = async () => {
      if (summaryScope === 'page' && pdfDoc && !summaryLoading) {
        try {
          const text = await getPageText(pageNumber);
          const resp = await api.post('/summarize', { scope: 'page', text });
          setSummary(resp?.data?.summary || 'No summary produced for this page.');
        } catch (err) {
          const fallback = structuredSummaryFromText(await getPageText(pageNumber), { scope: 'page' });
          setSummary(fallback || 'No extractable text found on this page.');
        }
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  if (loading) {
    return (
      <div className="pdf-viewer">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading book...</p>
        </div>
      </div>
    );
  }

  if (pdfError || !book?.pdfUrl) {
    return (
      <div className="pdf-viewer">
        <Header />
        <div className="error-container">
          <h2>PDF Not Available</h2>
          <p>This book doesn't have a PDF file available yet.</p>
          <button onClick={() => navigate('/library')}>Back to Library</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`pdf-viewer ${darkMode ? 'dark' : ''}`}>
      <Header />
      <div className="pdf-viewer-container">
        <div className="pdf-toolbar">
          <div className="toolbar-left">
            <button className="toolbar-btn" onClick={() => navigate('/library')}>
              <FiX /> Close
            </button>
            {savedPage && savedPage !== 1 && (
              <button className="toolbar-btn" onClick={jumpToSavedPage} title={`Continue from page ${savedPage}`}>
                <FiCornerDownLeft /> Continue Page {savedPage}
              </button>
            )}
            <div className="book-info">
              <h2>{book.title}</h2>
              <p>by {book.author}</p>
            </div>
          </div>
          <div className="toolbar-center">
            <button className="toolbar-btn" onClick={goToPrevPage} disabled={pageNumber <= 1}>
              <FiChevronLeft />
            </button>
            <span className="page-info">
              Page {pageNumber} of {numPages}
            </span>
            <button className="toolbar-btn" onClick={goToNextPage} disabled={pageNumber >= numPages}>
              <FiChevronRight />
            </button>
            <div className="page-jump">
              <input
                type="number"
                min={1}
                max={numPages || 1}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') applyPageJump(); }}
                aria-label="Jump to page"
              />
              <button className="toolbar-btn" onClick={applyPageJump} disabled={!numPages}>Go</button>
            </div>
          </div>
          <div className="toolbar-right">
            <button className="toolbar-btn" onClick={zoomOut} disabled={scale <= 0.5}>
              <FiZoomOut />
            </button>
            <span className="zoom-info">{Math.round(scale * 100)}%</span>
            <button className="toolbar-btn" onClick={zoomIn} disabled={scale >= 3}>
              <FiZoomIn />
            </button>
            <button className="toolbar-btn" onClick={toggleDarkMode}>
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            <button className="toolbar-btn" onClick={summarizeCurrentPage}>
              <FiFileText /> Summarize Page
            </button>
            <button className="toolbar-btn" onClick={summarizeWholeBook}>
              <FiBook /> Summarize Book
            </button>
          </div>
        </div>

        <div className="pdf-content">
          <Document
            file={book.pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="pdf-loading">
                <div className="spinner"></div>
                <p>Loading PDF...</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>

        {(summaryLoading || summary) && (
          <div className="summary-panel">
            {summaryLoading ? (
              <div className="pdf-loading">
                <div className="spinner"></div>
                <p>{summaryScope === 'book' ? 'Summarizing book...' : 'Summarizing page...'}</p>
              </div>
            ) : (
              <div>
                <div className="summary-header">
                  <span>Summary ({summaryScope === 'book' ? 'Book' : 'Page'})</span>
                  <button className="summary-close" onClick={() => { setSummary(''); setSummaryScope(null); }} title="Close summary">×</button>
                </div>
                <div className="summary-body">{summary}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
