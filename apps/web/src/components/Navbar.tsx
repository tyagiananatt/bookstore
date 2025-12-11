import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">BookVerse</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/" className={({isActive})=>`hover:text-white ${isActive? 'text-white':'text-white/80'}`}>Home</NavLink>
          <NavLink to="/checkout" className={({isActive})=>`hover:text-white ${isActive? 'text-white':'text-white/80'}`}>Checkout</NavLink>
          <NavLink to="/login" className={({isActive})=>`hover:text-white ${isActive? 'text-white':'text-white/80'}`}>Login</NavLink>
          <Link to="/signup" className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500">Sign up</Link>
        </nav>
      </div>
    </header>
  )
}
