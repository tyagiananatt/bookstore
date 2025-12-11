import { Router } from 'express'
import { z } from 'zod'
import { Book } from '../models/Book.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

const createSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  price: z.number().nonnegative(),
  genre: z.string().min(1),
  publicationDate: z.string().datetime().optional(),
  isbn: z.string().optional(),
  stock: z.number().int().nonnegative().default(0),
  imageUrl: z.string().url().optional(),
  description: z.string().optional(),
})

router.post('/', requireAuth, requireRole(['admin','seller']), async (req, res) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const data = parsed.data
  const book = await Book.create({ ...data, publicationDate: data.publicationDate ? new Date(data.publicationDate) : undefined })
  return res.status(201).json({ book })
})

const updateSchema = createSchema.partial()
router.put('/:id', requireAuth, requireRole(['admin','seller']), async (req, res) => {
  const parsed = updateSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const { id } = req.params
  const data = parsed.data
  const book = await Book.findByIdAndUpdate(id, { ...data, publicationDate: data.publicationDate ? new Date(data.publicationDate) : undefined }, { new: true })
  if (!book) return res.status(404).json({ error: 'Not found' })
  return res.json({ book })
})

router.delete('/:id', requireAuth, requireRole(['admin','seller']), async (req, res) => {
  const { id } = req.params
  const book = await Book.findByIdAndDelete(id)
  if (!book) return res.status(404).json({ error: 'Not found' })
  return res.json({ ok: true })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const book = await Book.findById(id)
  if (!book) return res.status(404).json({ error: 'Not found' })
  return res.json({ book })
})

router.get('/', async (req, res) => {
  const {
    page = '1', limit = '12', q, genre, author, minPrice, maxPrice, year
  } = req.query as Record<string, string>

  const pageNum = Math.max(parseInt(page) || 1, 1)
  const limitNum = Math.min(Math.max(parseInt(limit) || 12, 1), 100)

  const filter: any = {}
  if (q) filter.$text = { $search: q }
  if (genre) filter.genre = genre
  if (author) filter.author = author
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }
  if (year) {
    const y = Number(year)
    const start = new Date(Date.UTC(y, 0, 1))
    const end = new Date(Date.UTC(y + 1, 0, 1))
    filter.publicationDate = { $gte: start, $lt: end }
  }

  const cursor = Book.find(filter)
    .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)

  if (q) cursor.select({ score: { $meta: 'textScore' } })

  const [items, total] = await Promise.all([
    cursor.exec(),
    Book.countDocuments(filter)
  ])

  return res.json({
    items,
    page: pageNum,
    limit: limitNum,
    total,
    pages: Math.ceil(total / limitNum)
  })
})

export default router
