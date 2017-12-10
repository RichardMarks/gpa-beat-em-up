const autoBind = target => {
  if (typeof target === 'object') {
    const targetPrototype = Object.getPrototypeOf(target)
    const methods = Object.getOwnPropertyNames(targetPrototype)
    const methodCount = methods.length

    for (let i = 0; i < methodCount; i += 1) {
      const method = methods[i]

      typeof target[method] === 'function' &&
      !method.match(/^__/) &&
      (target[method] = target[method].bind(target))
    }
  }
}

export default autoBind
