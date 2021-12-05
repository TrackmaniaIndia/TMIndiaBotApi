const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports.handle = (app) => {
    app.get("/mx/maps/random", async (req, res) => {
        const response = await fetch('https://trackmania.exchange/mapsearch2/search?api=on')
        const data = await response.json();
    
        const randMap = data.results[Math.floor(Math.random() * data.results.length)];
        res.send(randMap)
    })
}

module.exports.registerdRoutes = ['/mx/maps/random']