module.exports = (key, value) => {
    const date = new Date();
    console.log(`${date.toDateString()}: Key '${key}' expired`)
}