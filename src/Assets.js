import Audio from './Audio'

const internal = {
  images: {},
  audio: {},
  json: {}
}

const Assets = {
  load (manifest) {
    return new Promise((resolve, reject) => {
      let loaded = 0
      const assetIds = Object.keys(manifest)
      const toLoad = assetIds.length

      const loadImage = (path, name) => {
        const image = new window.Image()
        image.onload = () => {
          window.console.log(`Assets.load() :: WORKING - Loaded '${name}' from ${path}`)
          internal.images[name] = image
          loaded += 1

          if (loaded >= toLoad) {
            window.console.log(`Assets.load() :: COMPLETE - ${loaded}/${toLoad} assets loaded.`)
            resolve()
          }
        }

        image.onerror = () => {
          reject(new Error(`Assets.load() :: FAILURE - Unable to load '${name}' from ${path}`))
        }

        image.src = path
      }

      const loadJson = (path, name) => {
        window.fetch(path)
          .then(response => {
            if (response.status !== 200) {
              return reject(`Assets.load() :: FAILURE - HTTP ${response.status}\nUnable to load '${name}' from ${path}`)
            }
            return response.json()
          })
          .then(json => {
            window.console.log(`Assets.load() :: WORKING - Loaded '${name}' from ${path}`)
            internal.json[name] = json
            loaded += 1

            if (loaded >= toLoad) {
              window.console.log(`Assets.load() :: COMPLETE - ${loaded}/${toLoad} assets loaded.`)
              resolve()
            }
          })
      }

      const loadAudio = (path, name) => {
        const request = new XMLHttpRequest()

        request.open('GET', path, true)
        request.responseType = 'arraybuffer'
        request.onload = () => {
          Audio.decodeAudioData(request.response, buffer => {
            window.console.log(`Assets.load() :: WORKING - Loaded '${name}' from ${path}`)
            const sound = Audio.createSound(path, buffer)
            internal.audio[name] = sound
            loaded += 1

            if (loaded >= toLoad) {
              window.console.log(`Assets.load() :: COMPLETE - ${loaded}/${toLoad} assets loaded.`)
              resolve()
            }
          })
        }

        request.send()
      }

      assetIds.forEach(name => {
        const path = manifest[name]
        const d = Date.now()

        if (path.match(/png$/)) {
          loadImage(`${path}?d=${d}`, name)
        } else if (path.match(/json$/)) {
          loadJson(`${path}?d=${d}`, name)
        } else if (path.match(/ogg$/)) {
          loadAudio(`${path}?d=${d}`, name)
        }
      })
    })
  }
}

export default Assets
export { internal }
