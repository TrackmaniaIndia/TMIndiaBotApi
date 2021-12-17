const { client } = require("../../tmio.js");
const cache = require('memory-cache');
const cb = require('../../cacheTimeoutCb.js')
import chalk from 'chalk';

module.exports.handle = (app) => {
    app.get('/tm2020/player/:id', async (req, res) => {
        const accId = req.params.id;

        const cacheEntry = cache.get(`tm2020:player:${accId}`)
        if (cacheEntry !== null) {
            const data = JSON.parse(cacheEntry);
            return res.send(data);
        }

        // const searchResults = await client.players.search(accId);
        // if (searchResults[0] === undefined) {
        //     res.status(400);
        //     res.json({
        //         error: "INVALID_USERNAME",
        //         msg: "An invalid username was provided",
        //     });
        //     return;
        // }

        const player = await client.players.get(accId);
        const data = player._data
        if (data.clubtag) data.clubtagraw = client.formatTMText(data.clubtag)

        cache.put(`tm2020:player:${accId}`, JSON.stringify(data), 86400000, cb) // 1 god damn day
        res.send(data)

        console.log(`${chalk.redBright(client.ratelimit.remaining)}/${chalk.redBright(client.ratelimit.limit)}`)
    })
};

module.exports.registerdRoutes = ["/tm2020/player/:name"];
