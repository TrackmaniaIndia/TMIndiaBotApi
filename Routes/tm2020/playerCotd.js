const { client } = require("../../tmio.js");
const cache = require('memory-cache')
const cb = require('../../cacheTimeoutCb.js')

module.exports.handle = (app) => {
    app.get("/tm2020/player/:id/cotd/:page?", async (req, res) => {
        const accId = req.params.id;
        const page = req.params.page;

        const cacheEntry = cache.get(`tm2020:player:${accId}:cotd`)
        if(cacheEntry !== null) {
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

        let player;
        try {
            player = await client.players.get(accId);
        } catch (e) {
            if (e === "Invalid account ID.") {
                res.status(400);
                res.send({
                    error: "INVALID_ACCOUNT_ID",
                    msg: "An invalid account id was provided",
                });
                return;
            }
        }
        const cotd = await player.cotd(page);

        const cotdData = cotd._data;

        cache.put(`tm2020:player:${accId}:cotd`, JSON.stringify(cotdData), 18000000, cb) // 5 hours

        res.send(cotdData);
    });
};

module.exports.registerdRoutes = ["/tm2020/player/:id/cotd/:page?"];
