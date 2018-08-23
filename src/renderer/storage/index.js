import json from '../../../package.json'

localStorage.getItem('lang') || localStorage.setItem('lang', 'en-US')
localStorage.getItem('version') || localStorage.setItem('version', json.version)
