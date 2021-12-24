const { client } = require("../tmio.js");

module.exports.handle = (app) => {
    app.get('/remainingReqs', async (req, res) => {
        res.send(client.ratelimit.remaining + "");
    })
};

module.exports.registerdRoutes = ["/remainingReqs"];