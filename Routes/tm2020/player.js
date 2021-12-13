const { client } = require("../../tmio.js");

module.exports.handle = (app) => {
    app.get('/tm2020/player/:name', async (req, res) => {
        const accName = req.params.name;

        const searchResults = await client.players.search(accName);
        if (searchResults[0] === undefined) {
            res.status(400);
            res.json({
                error: "INVALID_USERNAME",
                msg: "An invalid username was provided",
            });
            return;
        }

        const player = await client.players.get(searchResults[0].id);
        const data = player._data
        data.clubtagraw = client.formatTMText(data.clubtag)

        res.send(data)
    })
};

module.exports.registerdRoutes = ["/tm2020/player/:name"];
