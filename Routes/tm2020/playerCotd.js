const { client } = require("../../tmio.js");
const cache = require('memory-cache');
const cb = require('../../cacheTimeoutCb.js')
// import chalk from '../../index.mjs';

module.exports.handle = (app) => {
    app.get("/tm2020/player/:id/cotd/", async (req, res) => {
        const accId = req.params.id;

        const cacheEntry = cache.get(`tm2020:player:${accId}:cotd`)
        if (cacheEntry !== null) {
            const data = JSON.parse(cacheEntry);
            return res.send(data);
        }

        const player_data = await client.players.get(accId);
        page = 0
        let next_page = ''
        try {
            next_page = await player_data.cotd(page);
        } catch (e) {
            res.send({ 'error': 'Player has never played COTD' });
            return
        }
        let player_cotd_data = next_page

        let all_cotds = ""

        while (JSON.stringify(next_page._data.cotds) != "[]") {
            all_cotds += JSON.stringify(next_page._data.cotds);
            page++;
            next_page = await player_data.cotd(page);
        }
        all_cotds = all_cotds.replaceAll('][', ',')
        // console.log("Requests Remaining: " + client.ratelimit.remaining)

        player_cotd_data._data.cotds = JSON.parse(all_cotds)

        const cotdData = player_cotd_data._data

        cache.put(`tm2020:player:${accId}:cotd`, JSON.stringify(cotdData), 7200000, cb) // 2 hours
        res.send(cotdData);
    });
};

module.exports.registerdRoutes = ["/tm2020/player/:id/cotd/"];
