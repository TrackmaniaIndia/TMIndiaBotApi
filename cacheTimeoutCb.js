module.exports = (key, value) => {
	console.log(`${new Date().toDateString()}: Cache key expired - ${key}`)
}