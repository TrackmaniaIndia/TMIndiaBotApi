module.exports.handle = (app) => {
    app.get("/", (req, res) => {
        res.send(`
        <a href="https://discord.gg/8h7zGs8Yad">Trackmania India</a> bot api V2
        `)
    })
}

module.exports.registerdRoutes = ['/']