const { client } = require("../../tmio.js");

// DO NOT CACHE THIS
module.exports.handle = (app) => {
    app.get("/tm2020/leaderboard/:map_id/:hundreds", async (req, res) => {
        // Hundreds should be a 1 digit number
        // so if const hundreds = 2 then it gets the top 2 hundred
        const map_id = req.params.map_id;
        const hundreds = req.params.hundreds;

        map_data = (await client.maps.get(map_id));
        for (let i = 0; i < hundreds - 1; i++) {
            leaderboards = await map_data.leaderboardLoadMore();
        }

        let leaderboard_main = new Array

        for (let i = 0; i < leaderboards.length; i++) {
            leaderboard_main.push(leaderboards[i]._data);
        }

        res.send(leaderboard_main)
    })
};

module.exports.registerdRoutes = ["/tm2020/leaderboard/:map_id/new"];