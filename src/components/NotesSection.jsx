import { Icon } from './ui'

export default function NotesSection({ trip, updateTrip }) {
  const notes = trip.notes || []
  const setNote = (i, k, v) => updateTrip({ notes: notes.map((n, j) => (j === i ? { ...n, [k]: v } : n)) })
  const addNote = () => updateTrip({ notes: [...notes, { emoji: '📝', title: 'Nueva nota', body: '' }] })
  const delNote = (i) => { const a = [...notes]; a.splice(i, 1); updateTrip({ notes: a }) }

  return (
    <section id="notas" className="scroll-mt-16 bg-stone-900 text-stone-100 mt-12">
      <div className="max-w-3xl mx-auto px-5 py-14">
        <p className="text-xs font-bold uppercase tracking-[.12em] text-ochre">Antes de salir</p>
        <h2 className="font-display text-3xl md:text-4xl text-white mt-2">Notas importantes</h2>
        <p className="mt-3 text-stone-400 leading-relaxed">Recordatorios del viaje. Editá, agregá o sacá lo que quieran.</p>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {notes.map((n, i) => (
            <div key={i} className="bg-stone-800/60 ring-1 ring-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2">
                <input value={n.emoji ?? ''} onChange={(e) => setNote(i, 'emoji', e.target.value)} className="w-10 bg-transparent text-2xl text-center outline-none rounded focus:bg-white/10" />
                <input value={n.title ?? ''} onChange={(e) => setNote(i, 'title', e.target.value)} placeholder="Título" className="flex-1 min-w-0 bg-transparent font-display text-xl text-white outline-none rounded px-1 focus:bg-white/10" />
                <button onClick={() => delNote(i)} className="text-white/30 hover:text-red-400 px-1" title="Quitar nota">✕</button>
              </div>
              <textarea
                value={n.body ?? ''} onChange={(e) => setNote(i, 'body', e.target.value)} placeholder="Detalle…" rows={3}
                className="mt-2 w-full bg-transparent text-sm text-stone-300 leading-relaxed outline-none rounded p-1 focus:bg-white/10"
              />
            </div>
          ))}
        </div>

        <button onClick={addNote} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ochre hover:text-amber-300">
          <Icon name="plus" className="w-4 h-4" /> Agregar nota
        </button>
      </div>
    </section>
  )
}
