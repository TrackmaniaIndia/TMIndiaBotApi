const { client } = require("../../tmio.js");
const cache = require('memory-cache');
const cb = require('../../cacheTimeoutCb.js')

module.exports.handle = (app) => {
    app.get("/tm2020/player/:id/cotd/:page", async (req, res) => {
        const accId = req.params.id;
        const page = req.params.page;

        const cacheEntry = cache.get(`tm2020:player:${accId}:cotd`)
        if (cacheEntry !== null) {
            const data = JSON.parse(cacheEntry);
            return res.send(data);
        }

        if (page !== undefined && isNaN(page)) {
            res.status(400);
            res.json({
                error: "INVALID_PAGE",
                msg: "An invalid page number was provided",
            });
        }

        const searchResults = await client.players.search(accId);
        if (searchResults[0] === undefined) {
            res.status(400);
            res.json({
                error: "INVALID_USERNAME",
                msg: "An invalid username was provided",
            });
            return;
        }

        const player = await client.players.get(searchResults[0].id);
        const cotd = await player.cotd(page);

        const cotdData = cotd._data;

        cache.put(`tm2020:player:${accId}:cotd`, JSON.stringify(cotdData), 3600000, cb) // 1 hour
        res.send(cotdData);
    });
};

module.exports.registerdRoutes = ["/tm2020/player/:id/cotd/:page"];
