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

const getClanUrl = (region, clan) => `https://api.worldoftanks.${region}/wot/globalmap/claninfo/?application_id=${APPLICATION_ID}&clan_id=${clan}`
const getBattlesUrl = (region, clan) => `https://api.worldoftanks.${region}/wot/globalmap/clanbattles/?application_id=${APPLICATION_ID}&clan_id=${clan}`

    const { region, clan } = req.params
    const REGION = REGIONS[region]
    const CLAN_URL = getClanUrl(REGION, clan)
    const BATTLES_URL = getBattlesUrl(REGION, clan)

    const clanData = await (fetch(CLAN_URL).then(res => res.json()))
    const battleData = await (fetch(BATTLES_URL).then(res => res.json()))
    const cal = ical({
        domain: `https://${region}.wargaming.net/globalmap/`,
        prodId: {
            company: 'tomato.gg',
            product: 'bugle'
        },
        name: `Battles for ${clanData?.tag || 'Your Clan'}`
    })


    if (battleData.data) {
        const { data: battles } = battleData;
        const requests = battles.map(({
            time,
            attack_type,
            competitor_id,
            province_name
        }) => async () => {
            const start = Date.parse(time)
            const end = new Date(start)
            end.setMinutes(start.getMinutes() + 15)
            const { tag: enemy_name = "Enemy Clan" } = await (fetch(getClanUrl(REGION, competitor_id)).then(res => res.json))
            cal.createEvent({
                start,
                end,
                timestamp: start,
                summary: `${capitalize(attack_type)} Against ${capitalize(enemy_name)} For ${capitalize(province_name)}`
            })
        })
        await Promise.all(requests)
    }
