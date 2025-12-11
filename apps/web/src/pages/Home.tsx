import { useEffect, useState } from 'react'
import { api, API_URL } from '../lib/api'
import { motion } from 'framer-motion'
import BookCard from '../components/BookCard'

type Book = {
  _id: string
  title: string
  author: string
  price: number
  genre: string
  imageUrl?: string
}

export default function Home() {
  const [items, setItems] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [health, setHealth] = useState<'idle'|'ok'|'error'>('idle')

  useEffect(() => {
    const run = async () => {
      try {
        const h = await api.get('/health', { baseURL: API_URL })
        setHealth(h.data?.ok ? 'ok' : 'error')
      } catch {
        setHealth('error')
      }
      try {
        const res = await api.get('/api/books?limit=12')
        setItems(res.data.items || [])
      } catch (e: any) {
        setError(e?.response?.data?.error || 'Failed to load books')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl md:text-6xl font-semibold tracking-tight"
          >
            Read better with
            <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">BookVerse</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/70 mt-3 max-w-2xl"
          >
            Curated titles, delightful UI, realtime updates, and AI-powered features.
          </motion.p>
          <div className="mt-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${health==='ok'?'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30':health==='error'?'bg-rose-500/20 text-rose-300 border border-rose-400/30':'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'}`}>
              API {health==='ok'?'Online':health==='error'?'Offline':'Loading'}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-14">
        {error && <div className="text-rose-300 mb-4">{error}</div>}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {Array.from({length:12}).map((_,i)=> (
              <div key={i} className="aspect-[3/4] rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.04 } }
            }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5"
          >
            {items.map(b => (
              <motion.div key={b._id} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                <BookCard title={b.title} author={b.author} price={b.price} imageUrl={b.imageUrl} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
