export const formatDate = (date, locale = 'en') => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')
}

export const formatCurrency = (amount) => {
  return `SDG ${amount?.toLocaleString() || 0}`
}

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const debounce = (fn, delay) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}