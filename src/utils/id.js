const id = complexity => {
  const count = complexity || 2
  const timestamp = new Date()
  const parts = [timestamp.getTime()]

  for (let i = 0; i < count; i += 1) {
    parts.push(`${Math.random()}`.substr(2))
  }

  return parts.join('-')
}

export default id
