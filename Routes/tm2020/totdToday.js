const { client } = require("../../tmio.js");
const cache = require('memory-cache');
const cb = require('../../cacheTimeoutCb.js')

module.exports.handle = (app) => {
    app.get('/tm2020/totd/latest', async (req, res) => {
        const cacheEntry = cache.get(`tm2020:totd`)
        if (cacheEntry !== null) {
            const data = JSON.parse(cacheEntry);
            return res.send(data);
        }

        const totd = await client.totd.get(new Date())
        let map = await totd.map();
        map = map._data
        map.name = client.formatTMText(map.name)

        map.name = client.formatTMText(map.name)

        cache.put(`tm2020:totd`, JSON.stringify(map), 3600000, cb) // 1 hour
        res.send(map)
    })
};

module.exports.registerdRoutes = ["/tm2020/totd/latest"];
