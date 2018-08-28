// TODO cannot use ejs loader, other wise there will be exception in production env
export const empty = require.context('@/template/empty', true, /\.ejs$/)
export const hello = require.context('@/template/hello', true, /\.ejs$/)
export const bank = require.context('@/template/bank', true, /\.ejs$/)
export const redpacket = require.context('@/template/redpacket', true, /\.ejs$/)
