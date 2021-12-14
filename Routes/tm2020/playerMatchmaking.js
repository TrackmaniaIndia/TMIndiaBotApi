const { client } = require("../../tmio.js");

module.exports.handle = (app) => {
    app.get("/tm2020/player/:name/matchmaking", async (req, res) => {
        const accName = req.params.name;

        const searchResults = await client.players.search(accName);
        if (searchResults[0] === undefined) {
            res.status(400).json({
                error: "INVALID_USERNAME",
                msg: "An invalid username was provided",
            });
            return;
        }

        const player = await client.players.get(searchResults[0].id);

        const matchmaking = player.matchmaking();
        const historyRaw = await matchmaking.history();

        const history = [];
        historyRaw.forEach((mmResults) => {
            history.push(mmResults._data);
        });

        const data = matchmaking._data;
        data.history = history;

        res.send(data);
    });
};

module.exports.registerdRoutes = ["/tm2020/player/:name/matchmaking"];
