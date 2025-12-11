import { useState } from 'react'
import { api, setAuth } from '../lib/api'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await api.post('/api/auth/signup', { name, email, password })
      const { access, refresh, user } = res.data
      localStorage.setItem('access', access)
      localStorage.setItem('refresh', refresh)
      localStorage.setItem('user', JSON.stringify(user))
      setAuth(access)
      navigate('/')
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 bg-glass/80 backdrop-blur-md p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-semibold">Create account</h2>
        {error && <div className="text-rose-300 text-sm">{error}</div>}
        <input className="w-full px-3 py-2 rounded bg-black/30 border border-white/10" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="w-full px-3 py-2 rounded bg-black/30 border border-white/10" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full px-3 py-2 rounded bg-black/30 border border-white/10" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50">{loading? 'Creating...' : 'Sign up'}</button>
        <p className="text-sm text-white/70">Have an account? <Link to="/login" className="text-emerald-300 hover:underline">Login</Link></p>
      </form>
    </div>
  )
}
