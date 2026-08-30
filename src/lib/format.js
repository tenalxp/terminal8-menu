export function formatPrice(price) {
  const n = Number(price)
  const hasCents = Math.round(n * 100) % 100 !== 0
  return `฿${n.toLocaleString('en-US', {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })}`
}
