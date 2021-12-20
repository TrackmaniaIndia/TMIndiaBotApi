const { client } = require("../../tmio.js");
const cache = require('memory-cache');
const cb = require('../../cacheTimeoutCb.js')

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

        let player;
        
        try{
            player = await client.players.get(accId);
        } catch(e) {
            if(e === 'Invalid account ID.')
                return res.status(400).send({err: 'INAVLID_ACCOUNT_ID', msg: e})

            if(e === "account not found")
                return res.status(400).send({err: "ACCOUNT_NOT_FOUND", msg: "Their is no account with the ID provided."})
        }

        const data = player._data
        data.clubtagraw = client.formatTMText(data.clubtag)

        cache.put(`tm2020:player:${accId}`, JSON.stringify(data), 86400000, cb) // 1 god damn day
        res.send(data)
    })
};

module.exports.registerdRoutes = ["/tm2020/player/:name"];
