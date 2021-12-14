const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cache = require('memory-cache')
const cb = require('../../cacheTimeoutCb.js')

module.exports.handle = (app) => {
    app.get("/mx/player/:username/maps", async (req, res) => {
        const { username } = req.params;
        const cacheEntry = cache.get(`mx:player:${username}:maps`)
        
        if(cacheEntry !== null){
            const data = JSON.parse(cacheEntry)
            return res.send(data.results)
        }

        const response = await fetch('https://trackmania.exchange/mapsearch2/search?api=on&author=' + username)
        const data = await response.json();
    
        if(data.totalItemCount <= 0) {
            return res.status(400).send({ error: "NO_MAPS", msg: "User hasnt uploaded any maps"})
        }

        cache.put(`mx:player:${username}:maps`, JSON.stringify(data), 86400000, cb) // delete entry after 1 day
        res.send(data.results)
    })
}

module.exports.registerdRoutes = ['/mx/player/:username/maps']