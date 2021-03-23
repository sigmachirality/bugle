const express = require('express')
const app = express()
const fetch = require('node-fetch')
const ical = require('ical-generator')

const PORT = 3000
const APPLICATION_ID = ``

const REGIONS = new Proxy({
        ru: `ru`,
        eu: `eu`,
        na: `com`,
        asia: `asia`
    }, {
        get: (target, name) => name in target ? target[name] : `com`
})

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const getClanUrl = clan => `https://api.worldoftanks.com/wot/globalmap/claninfo/?application_id=${APPLICATION_ID}&clan_id=${clan}`
const getBattlesUrl = clan => `https://api.worldoftanks.${REGION}/wot/globalmap/clanbattles/?application_id=${APPLICATION_ID}&clan_id=${clan}`

