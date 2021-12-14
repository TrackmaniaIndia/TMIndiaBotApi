const { client } = require("../../tmio.js");
const cache = require('memory-cache')
const cb = require('../../cacheTimeoutCb.js')

module.exports.handle = (app) => {
    app.get('/tm2020/player/:name', async (req, res) => {
        const accName = req.params.name;
        const cacheEntry = cache.get(`tm2020:player:${accName}`)

        if(cacheEntry !== null) {
            const data = JSON.parse(cacheEntry);
            res.send(data)

            return;
        }

        const searchResults = await client.players.search(accName);
        if (searchResults[0] === undefined) {
            res.status(400);
            res.json({
                error: "INVALID_USERNAME",
                msg: "An invalid username was provided",
            });
            return;
        }

        const player = await client.players.get(searchResults[0].id);
        const data = player._data
        data.clubtagraw = client.formatTMText(data.clubtag)

        cache.put(`tm2020:player:${accName}`, JSON.stringify(data), 86400000, cb) // 1 day timeout

        res.send(data)
    })
};

module.exports.registerdRoutes = ["/tm2020/player/:name"];
