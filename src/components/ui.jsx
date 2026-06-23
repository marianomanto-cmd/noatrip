import { useEffect, useRef } from 'react'

/* ---------- Sprite de iconos (se monta una sola vez) ---------- */
export function IconSprite() {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
  return (
    <svg width="0" height="0" className="hidden" aria-hidden="true">
      <symbol id="ic-pin" viewBox="0 0 24 24" {...s}><path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z" /><circle cx="12" cy="11" r="2" /></symbol>
      <symbol id="ic-clock" viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></symbol>
      <symbol id="ic-car" viewBox="0 0 24 24" {...s}><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13" /><path d="M4 13h16v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" /><circle cx="7.5" cy="15.5" r=".7" /><circle cx="16.5" cy="15.5" r=".7" /></symbol>
      <symbol id="ic-mtn" viewBox="0 0 24 24" {...s}><path d="M3 20l6-11 4 6.5L15.5 12 21 20z" /></symbol>
      <symbol id="ic-star" viewBox="0 0 24 24" {...s}><path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 8.7l5.4-.8z" /></symbol>
      <symbol id="ic-fork" viewBox="0 0 24 24" {...s}><path d="M6 3v6a2 2 0 0 0 2 2v10" /><path d="M8 3v5M10 3v5" /><path d="M16 3c-1.4.6-2 2.4-2 4.5 0 2 .8 3 2 3.5v10" /></symbol>
      <symbol id="ic-bed" viewBox="0 0 24 24" {...s}><path d="M3 18v-5a2 2 0 0 1 2-2h9a3 3 0 0 1 3 3v4" /><path d="M3 18h18" /><path d="M3 14V7" /><circle cx="7.5" cy="9.5" r="1.5" /></symbol>
      <symbol id="ic-wallet" viewBox="0 0 24 24" {...s}><path d="M3 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M3 8l2.4-3.2a1 1 0 0 1 .8-.4H15" /><circle cx="16.5" cy="12.5" r="1.2" /></symbol>
      <symbol id="ic-note" viewBox="0 0 24 24" {...s}><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v4h4" /><path d="M9 12h6M9 16h4" /></symbol>
      <symbol id="ic-plus" viewBox="0 0 24 24" {...s}><path d="M12 5v14M5 12h14" /></symbol>
      <symbol id="ic-trash" viewBox="0 0 24 24" {...s}><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" /></symbol>
      <symbol id="ic-share" viewBox="0 0 24 24" {...s}><circle cx="6" cy="12" r="2.2" /><circle cx="17" cy="6" r="2.2" /><circle cx="17" cy="18" r="2.2" /><path d="M8 11l7-4M8 13l7 4" /></symbol>
    </svg>
  )
}

export function Icon({ name, className = '' }) {
  return <svg className={className} aria-hidden="true"><use href={`#ic-${name}`} /></svg>
}

/* ---------- Campos editables ---------- */
export function EditableText({ value, onChange, placeholder, className = '', ...rest }) {
  return (
    <input
      className={`inp ${className}`}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  )
}

export function EditableArea({ value, onChange, placeholder, className = '', minRows = 2 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (el) { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px` }
  }, [value])
  return (
    <textarea
      ref={ref}
      rows={minRows}
      className={`inp ${className}`}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export function EditableNumber({ value, onChange, className = '' }) {
  return (
    <input
      type="number"
      inputMode="decimal"
      min="0"
      className={`inp inp-num ${className}`}
      value={value ?? 0}
      onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
    />
  )
}
