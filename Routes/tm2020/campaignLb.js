const { client } = require("../../tmio.js");
const cache = require('memory-cache');
const cb = require('../../cacheTimeoutCb.js')
// import chalk from '../../chalk';

module.exports.handle = (app) => {
    app.get('/tm2020/club/:clubid/campaign/:campid/leaderboard', async (req, res) => {
        const clubId = req.params.clubid;
        const campaignId = req.params.campid;

        const cacheEntry = cache.get(`tm2020:club:${clubId}:campaign:${campaignId}`)
        if(cacheEntry) {
            const data = JSON.parse(cacheEntry)
            res.send(data)
            return;
        }

        let campaign;

        try {
            campaign = await client.campaigns.get(clubId, campaignId)
        } catch (error) {
            res.status(500)
            res.send({
                err: error
            })
        }

        const rawLb = await campaign.leaderboard()
        const lb = [];

        rawLb.forEach((run) => {
            const data = run._data;

            let playerTag = data.player.tag;
            if(playerTag !== undefined) {
                cleanTag = client.formatTMText(playerTag)
                data.player.tagClean = cleanTag;
            }

            lb.push(data)
        })

        cache.put(`tm2020:club:${clubId}:campaign:${campaignId}`, JSON.stringify(lb));
        res.send(lb)
    })};

module.exports.registerdRoutes = ["/tm2020/club/:clubid/campaign/:campid/leaderboard"];
