export const formatStudentNumber = (number) => {
  return `STU-${number}`
}

export const formatTeacherCode = (code) => {
  return `TCH-${code}`
}

export const formatPaymentNumber = (number) => {
  return `PAY-${number}`
}

export const truncate = (text, length = 50) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}