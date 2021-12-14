const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const tags = require("../../tags.json");

module.exports.handle = (app) => {
    app.get("/mx/maps/random", async (req, res) => {
        let reqUrl;

        if (req.query.tag) {
            const tag = req.query.tag.toLowerCase().replace(" ", "_");

            if (tags.mapping[tag] === undefined) {
                res.status(400).send({
                    error: "INVALID_TAG",
                    msg: "An invalid tag was provided.",
                });
            }

            reqUrl =
                "https://trackmania.exchange/mapsearch2/search?api=on&style=" +
                tags.mapping[tag];
        } else {
            reqUrl = "https://trackmania.exchange/mapsearch2/search?api=on";
        }

        const response = await fetch(reqUrl);
        const data = await response.json();

        const randMap =
            data.results[Math.floor(Math.random() * data.results.length)];
        res.send(randMap);
    });
};

module.exports.registerdRoutes = ["/mx/maps/random"];
