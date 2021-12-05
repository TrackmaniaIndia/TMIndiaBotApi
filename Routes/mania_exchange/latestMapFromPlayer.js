const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cache = require('memory-cache')

module.exports.handle = (app) => {
    app.get("/mx/player/:username/maps/latest", async (req, res) => {
        const { username } = req.params;
        const cacheEntry = cache.get(`player:${username}:maps`)
        
        if(cacheEntry !== null){
            const data = JSON.parse(cacheEntry)
            return res.send(data.results[0])
        }

        const response = await fetch('https://trackmania.exchange/mapsearch2/search?api=on&author=' + username)
        const data = await response.json();
    
        if(data.totalItemCount <= 0) {
            return res.status(400).send({ error: "NO_MAPS", msg: "User hasnt uploaded any maps"})
        }

        cache.put(`player:${username}:maps`, JSON.stringify(data), 86400000) // delete entry after 1 day
        res.send(data.results[0])
    })
}

module.exports.registerdRoutes = ['/mx/player/:username/maps/latest']