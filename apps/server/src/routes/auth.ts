import { Router } from 'express'
import { z } from 'zod'
import { User } from '../models/User.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin','seller','customer']).optional(),
})

router.post('/signup', async (req, res) => {
  const parsed = signupSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const { name, email, password, role } = parsed.data
  const exists = await User.findOne({ email })
  if (exists) return res.status(409).json({ error: 'Email already in use' })
  const user = await User.create({ name, email, password, role })
  const access = signAccessToken({ sub: user.id, role: user.role })
  const refresh = signRefreshToken({ sub: user.id, role: user.role })
  return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, access, refresh })
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const { email, password } = parsed.data
  const user = await User.findOne({ email }).select('+password')
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await user.comparePassword(password)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const access = signAccessToken({ sub: user.id, role: user.role })
  const refresh = signRefreshToken({ sub: user.id, role: user.role })
  return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, access, refresh })
})

const refreshSchema = z.object({ refresh: z.string() })
router.post('/refresh', async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  try {
    const payload = verifyRefreshToken(parsed.data.refresh)
    const access = signAccessToken({ sub: payload.sub, role: payload.role })
    const refresh = signRefreshToken({ sub: payload.sub, role: payload.role })
    return res.json({ access, refresh })
  } catch (e) {
    return res.status(401).json({ error: 'Invalid refresh token' })
  }
})

router.get('/me', requireAuth, async (req: any, res) => {
  const user = await User.findById(req.user.sub)
  if (!user) return res.status(404).json({ error: 'User not found' })
  return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl } })
})

router.post('/logout', (_req, res) => {
  return res.json({ ok: true })
})

export default router
