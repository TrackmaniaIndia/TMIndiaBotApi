const { client } = require("../../tmio.js");
const cache = require('memory-cache');
const cb = require('../../cacheTimeoutCb.js')

module.exports.handle = (app) => {
    app.get("/tm2020/player/:id/matchmaking", async (req, res) => {
        const accId = req.params.id;

        const cacheEntry = cache.get(`tm2020:player:${accId}:matchmaking`)
        if (cacheEntry !== null) {
            const data = JSON.parse(cacheEntry);
            return res.send(data);
        }

        let player;
        try {
            player = await client.players.get(accId);
        } catch (e) {
            if (e === "Invalid account ID.") {
                res.status(400);
                return res.send({ err: "INVALID_ACCOUNT_ID", msg: e })
            }
        }

        const matchmaking = player.matchmaking();
        const historyRaw = await matchmaking.history();

        const history = [];
        historyRaw.forEach((mmResults) => {
            history.push(mmResults._data);
        });

        const data = matchmaking._data;
        data.history = history;

        cache.put(`tm2020:player:${accId}:matchmaking`, JSON.stringify(data), 86400000, cb) // 1day
        res.send(data);
    });
};

module.exports.registerdRoutes = ["/tm2020/player/:id/matchmaking"];
