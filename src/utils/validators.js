export const isEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const isPhone = (phone) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  return re.test(phone)
}

export const isRequired = (value) => {
  return value !== null && value !== undefined && value !== ''
}

export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}