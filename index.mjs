import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import express  from 'express'
import morgan  from 'morgan'
import glob  from 'glob'
import { join, dirname } from "path"
import chalk from 'chalk';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express();
const routePath = join(__dirname, './Routes')

app.use(morgan('dev'))
app.use(express.json())
app.use(express.static('public'))

glob(`${routePath}/**/*.js`, (err, files) => {
    if(err)
        return console.error(err)
    
    files.forEach(file => {
        const routeImport = require(file);
        
        routeImport.handle(app)
        routeImport.registerdRoutes.forEach((route) => {
            const filename = file.split("/").pop()
            console.log(`${chalk.greenBright('Loaded')} ${chalk.yellow(route)} from ${chalk.green(filename)}`)
        })
    })

    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => console.log("Listening on http://localhost:3000"))
})
