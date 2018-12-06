import json from '../../../package.json'

localStorage.getItem('lang') || localStorage.setItem('lang', 'en-US')
localStorage.setItem('version', json.version)
