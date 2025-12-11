import { motion } from 'framer-motion'

type Props = {
  title: string
  author: string
  price: number
  imageUrl?: string
}

export default function BookCard({ title, author, price, imageUrl }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md"
    >
      <div className="aspect-[3/4] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <span className="text-white/30 text-sm">No Cover</span>
        )}
      </div>
      <div className="p-3">
        <div className="text-xs text-white/60">{author}</div>
        <div className="font-medium leading-tight truncate" title={title}>{title}</div>
        <div className="text-emerald-300 text-sm mt-1">₹{price}</div>
      </div>
    </motion.div>
  )
}
