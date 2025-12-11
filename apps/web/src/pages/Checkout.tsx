import { useState } from 'react'

export default function Checkout() {
  const [method, setMethod] = useState<'card'|'upi'|'paypal'>('card')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="px-3 py-2 rounded bg-black/30 border border-white/10" placeholder="Full name" />
              <input className="px-3 py-2 rounded bg-black/30 border border-white/10" placeholder="Phone" />
              <input className="md:col-span-2 px-3 py-2 rounded bg-black/30 border border-white/10" placeholder="Street address" />
              <input className="px-3 py-2 rounded bg-black/30 border border-white/10" placeholder="City" />
              <input className="px-3 py-2 rounded bg-black/30 border border-white/10" placeholder="State" />
              <input className="px-3 py-2 rounded bg-black/30 border border-white/10" placeholder="Postal code" />
              <input className="px-3 py-2 rounded bg-black/30 border border-white/10" placeholder="Country" />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <div className="grid gap-3">
              <label className={`flex items-center gap-3 p-3 rounded-lg border ${method==='card'?'border-emerald-400/30 bg-emerald-500/10':'border-white/10 bg-black/20'}`}>
                <input type="radio" name="pm" checked={method==='card'} onChange={()=>setMethod('card')} />
                <span>Credit / Debit Card</span>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-lg border ${method==='upi'?'border-emerald-400/30 bg-emerald-500/10':'border-white/10 bg-black/20'}`}>
                <input type="radio" name="pm" checked={method==='upi'} onChange={()=>setMethod('upi')} />
                <span>UPI</span>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-lg border ${method==='paypal'?'border-emerald-400/30 bg-emerald-500/10':'border-white/10 bg-black/20'}`}>
                <input type="radio" name="pm" checked={method==='paypal'} onChange={()=>setMethod('paypal')} />
                <span>PayPal</span>
              </label>
            </div>

            {method === 'card' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input className="px-3 py-2 rounded bg-black/30 border border-white/10" placeholder="Cardholder name" />
                <input className="px-3 py-2 rounded bg-black/30 border border-white/10" placeholder="Card number" />
                <input className="px-3 py-2 rounded bg-black/30 border border-white/10" placeholder="Expiry (MM/YY)" />
                <input className="px-3 py-2 rounded bg-black/30 border border-white/10" placeholder="CVV" />
              </div>
            )}

            {method === 'upi' && (
              <div className="grid gap-4 mt-4">
                <input className="px-3 py-2 rounded bg-black/30 border border-white/10" placeholder="UPI ID (e.g. name@upi)" />
              </div>
            )}

            {method === 'paypal' && (
              <div className="mt-4 text-sm text-white/70">You'll be redirected to PayPal to complete your purchase. (UI only)</div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="text-white/80">Sample Book {i}</div>
                  <div className="text-white/60">x1</div>
                  <div className="text-emerald-300">₹{499}</div>
                </div>
              ))}
            </div>
            <div className="h-px bg-white/10 my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-white/70">Subtotal</span><span>₹1497</span></div>
              <div className="flex justify-between"><span className="text-white/70">Shipping</span><span>₹49</span></div>
              <div className="flex justify-between"><span className="text-white/70">Tax</span><span>₹135</span></div>
              <div className="flex justify-between font-medium text-emerald-300"><span>Total</span><span>₹1681</span></div>
            </div>
            <button disabled className="mt-4 w-full px-4 py-2 rounded-lg bg-emerald-600/50 cursor-not-allowed">Place Order (UI only)</button>
            <p className="text-xs text-white/60 mt-2">Payment functionality not implemented yet.</p>
          </section>
        </aside>
      </div>
    </div>
  )
}
