const { client } = require("../../tmio.js");

// DO NOT CACHE THIS
module.exports.handle = (app) => {
    app.get("/tm2020/leaderboard/:map_id", async (req, res) => {
        const map_id = req.params.map_id;

        map_data = await client.maps.get(map_id);
        more_leaderboard = await map_data.leaderboardLoadMore();

        let player_leaderboards = new Array

        for (let i = 0; i < map_data.leaderboard.length; i++) {
            player_leaderboards.push(map_data.leaderboard[i]._data);
        }

        for (let i = 0; i < more_leaderboard.length; i++) {
            try {
                let name = more_leaderboard[i]._data['player']['name']
                player_leaderboards.push(more_leaderboard[i]._data);
            }
            catch {
                continue;
            }
            // if(more_leaderboard._data != null)

        }

        res.send(player_leaderboards)
    })
};

module.exports.registerdRoutes = ["/tm2020/leaderboard/:map_id"];