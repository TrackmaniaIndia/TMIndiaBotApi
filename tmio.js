const TMIO = require('trackmania.io');

const client = new TMIO.Client({
    api: {
        useragent: "Trackmania India discord bot"
    }
});

module.exports = { client };