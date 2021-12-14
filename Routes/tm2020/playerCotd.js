const { client } = require("../../tmio.js");

module.exports.handle = (app) => {
    app.get("/tm2020/player/:name/cotd/:page", async (req, res) => {
        const accName = req.params.name;
        const page = req.params.page;

        if (page !== undefined && isNaN(page)) {
            res.status(400);
            res.json({
                error: "INVALID_PAGE",
                msg: "An invalid page number was provided",
            });
        }

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
        const cotd = await player.cotd(page);

        const cotdData = cotd._data;

        res.send(cotdData);
    });
};

module.exports.registerdRoutes = ["/tm2020/player/:name/cotd/:page"];
