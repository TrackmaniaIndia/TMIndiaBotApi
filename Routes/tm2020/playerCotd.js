const { client } = require("../../tmio.js");
const cache = require('memory-cache');
const cb = require('../../cacheTimeoutCb.js')

module.exports.handle = (app) => {
    app.get("/tm2020/player/:username/cotd/", async (req, res) => {
        const accUsername = req.params.username;
        // const page = req.params.page;

        const cacheEntry = cache.get(`tm2020:player:${accUsername}:cotd`)
        if (cacheEntry !== null) {
            const data = JSON.parse(cacheEntry);
            return res.send(data);
        }

        // if (page !== undefined && isNaN(page)) {
        //     res.status(400);
        //     res.json({
        //         error: "INVALID_PAGE",
        //         msg: "An invalid page number was provided",
        //     });
        // }

        const searchResults = await client.players.search(accUsername);
        if (searchResults[0] === undefined) {
            res.status(400);
            res.json({
                error: "INVALID_USERNAME",
                msg: "An invalid username was provided",
            });
            return;
        }

        const player_data = await client.players.get(searchResults[0].id);
        page = 0
        let next_page = await player_data.cotd(page);
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

        cache.put(`tm2020:player:${accUsername}:cotd`, JSON.stringify(cotdData), 7200000, cb) // 2 hours
        res.send(cotdData);
    });
};

module.exports.registerdRoutes = ["/tm2020/player/:id/cotd/:page"];
