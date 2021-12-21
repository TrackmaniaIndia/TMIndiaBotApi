const { client } = require('./tmio.js')

module.exports = function (req, res, next) {
    const remaining = client.ratelimit.remaining;
    const reset = client.ratelimit.reset;

    let resetUnixTimestamp;
    if (reset !== null) {
        resetUnixTimestamp = reset.getTime();
    }

    res.on('close', () => {
        console.log(`Remaining requests: ${remaining}`)
    })

    if (remaining === null) return next();

    if (remaining === 1) {
        const dateNow = new Date().getTime()
        return res.status(429).send({ err: "RATE_LIMITED", msg: "You have been rate limited", resetUnixTimestamp })
        next()
    }

    next()
}