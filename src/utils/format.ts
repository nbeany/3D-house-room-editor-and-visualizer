/** Number/currency formatting helpers (single source of truth for the UI). */

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

export const formatCurrency = (v: number) => currency.format(v)
export const formatCompactCurrency = (v: number) => compactCurrency.format(v)
export const formatNumber = (v: number) => number.format(v)
export const formatArea = (v: number) => `${number.format(v)} m²`
export const formatMeters = (v: number) => `${v.toFixed(2)} m`
