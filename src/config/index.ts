type Environment = 'local' | 'remote' | 'test'

interface Config {
  djaliHost: string
  host: string
  openBazaarHost: string
  websocketHost: string
}

const local = {
  djaliHost: `http://${window.location.hostname}:8109`,
  host: process.env.PUBLIC_URL,
  openBazaarHost: `http://${window.location.hostname}:4002`,
  websocketHost: `ws://${window.location.hostname}:4002/ws`,
}

const remote = {
  djaliHost: 'https://djali-api.djali.org',
  host: 'https://test.djali.org',
  openBazaarHost: 'https://djali-ob.djali.org',
  websocketHost: 'wss://djali-ob.djali.org/ws',
}

function getConfig(): Config {
  console.log('Mode: ' + process.env.NODE_ENV)
  console.log('Link: ' + process.env.REACT_APP_LINK)
  switch (process.env.REACT_APP_LINK as Environment) {
    case 'local': {
      return local
    }
    case 'remote': {
      return remote
    }
    default: {
      return local
    }
  }
}

export default {
  ...getConfig(),
}
