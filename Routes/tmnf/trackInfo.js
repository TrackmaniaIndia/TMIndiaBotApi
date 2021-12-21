const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require('cheerio')
const cheerioTableparser = require('cheerio-tableparser');
const cache = require('memory-cache')
const GBX = require('gbx')

function getValuesFromTable(selector, $) {
    let table = $(selector).parsetable(false, false, false); // return data as html    
    let data = table[1];

    let textData = []
    // for(let i = 0; i <= data.length; i++) {
    //     let trimmedText = data[i].replace(/\s+/g, ' ').trim();
    //     textData.push($(trimmedText).text().trim())
    // }
    data.forEach(html => {
        let trimmedText = html.replace(/\s+/g, ' ').trim();
        textData.push($(trimmedText).text().trim())
    })

    return textData
}

function parseMedalTime(timeInt) {
    const time = timeInt.toString();

    const seconds = time.substring(0, 2);
    const ms = time.substring(2, 5);

    return `${seconds}.${ms}`
}

async function getMedalTimes(id) {
    const response = await fetch(`https://tmnforever.tm-exchange.com/tmupget.aspx?action=trackgbx&id=${id}`)
    const data = await response.arrayBuffer()

    const virtualFile = new Uint8Array(data);
    let times;

    const gbx = new GBX({
        data: virtualFile,
        onParse: (metadata) => {
            times = {
                bronze: parseMedalTime(metadata.bronzeTime),
                silver: parseMedalTime(metadata.silverTime),
                gold: parseMedalTime(metadata.goldTime),
                author: parseMedalTime(metadata.authorTime),
            }
        }
    })

    return times
}

module.exports.handle = (app) => {
    app.get("/tmnf/map/:id", async (req, res) => {
        const id = req.params.id;

        const response = await fetch('https://tmnforever.tm-exchange.com/trackshow/' + id)
        const html = await response.text()

        if(html.includes('404')) {
            res.status(503)
            res.send({ err: "UNAVAILABLE", msg: "TMX Is currently under maintenance or unavailable (status code 404)."});
            return;
        }

        const $ = cheerio.load(html);
        cheerioTableparser($);

        // Track Details
        const infoVals = getValuesFromTable('#Table7 > tbody', $)
        const detailsVals = getValuesFromTable('#ctl01_Windowrow9', $)

        const style = $('#ctl01_ShowStyle').text().trim();
        const routes = $('#ctl01_ShowRoutes').text().trim();
        const diffic = $('#ctl01_ShowDifficulty').text().trim();
        
        const medals = await getMedalTimes(id)

        const track = {
            info: {
                name: infoVals[0],
                pack: infoVals[1],
                author: infoVals[2],
                version: infoVals[3],
                released: infoVals[4],
                rating: infoVals[6],
                medals,
                screenshot: `https://tmnforever.tm-exchange.com/getclean.aspx?action=trackscreenscreens&id=${id}&screentype=0`,
                urls: {
                    download: `https://tmnforever.tm-exchange.com/tmupget.aspx?action=trackgbx&id=${id}`,
                    open: `tmtp:///:tmx:download?site=tmnforever&id=${id}`
                }
            }, 
            details: {
                gameVersion: detailsVals[0],
                type: detailsVals[1],
                environment: detailsVals[2],
                length: detailsVals[3],
                mood: detailsVals[4],
                style,
                routes,
                difficulty: diffic
            }
        }


        res.send(track)
    })
} 

module.exports.registerdRoutes = ['/tmnf/map/:id']