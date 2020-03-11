const fs = require('fs')
const fse = require('fs-extra')
const rimraf = require("rimraf")
const envfile = require('envfile')
const { exec } = require('child_process')
const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Which env (staging/prod) ? ", env => {
    if (!['staging', 'prod'].includes(env)) {
        console.error("Invalid env")
        process.exit(1)
    }
    console.log("Starting");

    (async () => {
        console.log("Clear build directory")
        await rm({ path: `${__dirname}/build` })
        await create({ path: `${__dirname}/build/` })

        await create({ path: `${__dirname}/build/front` })
        await create({ path: `${__dirname}/build/api` })
        await create({ path: `${__dirname}/build/final` })

        console.log("[FRONT] Copying folders")
        await cp({ from: `${__dirname}/../front/`, to: `${__dirname}/build/front`, exclude: /node_modules/ })

        console.log("[FRONT] Installing dependencies")
        await run({ command: 'npm install --silent', cwd: `${__dirname}/build/front` })

        console.log("[FRONT] Building")
        await run({ command: 'npm run build --silent', cwd: `${__dirname}/build/front` })

        console.log("[API] Copying folders")
        await cp({ from: `${__dirname}/../api/`, to: `${__dirname}/build/api`, exclude: /vendor|cache|log/ })

        console.log("[API] Editing .env")
        await new Promise((resolve, reject) => {
            const sourceObject = {
                ...envfile.parseFileSync(__dirname + "/build/api/.env")
            }
            sourceObject.APP_ENV = env
            sourceObject.APP_DEBUG = env !== "prod"
            sourceObject.JWT_TOKENTTL = 604800
            
            delete sourceObject.GMAIL_USERNAME
            delete sourceObject.GMAIL_PASSWORD

            fs.writeFileSync(__dirname + "/build/api/.env", envfile.stringifySync(sourceObject))
            resolve()
        })


        console.log("[API] Installing dependencies")
        await run({ command: 'composer install --no-dev --optimize-autoloader -q', cwd: `${__dirname}/build/api` })

        console.log("Creating final build")
        await cp({ from: `${__dirname}/build/api/`, to: `${__dirname}/build/final` })
        await rm({ path: `${__dirname}/build/final/public/app` })
        await rm({ path: `${__dirname}/build/final/.env.${env === 'prod' ? 'staging' : 'prod'}` })
        await cp({ from: `${__dirname}/build/front/build/`, to: `${__dirname}/build/final/public/app` })

        console.log("Done")
        process.exit(0)
    })()
})

function cp({ from = null, to = null, exclude = null }) {
    return fse.copy(from, to, {
        filter: name => !name.match(exclude)
    })
}

function rm({ path = null }) {
    return new Promise((resolve, reject) => rimraf(path, (err) => {
        if (err) reject(err);
        resolve()
    }))
}

function create({ path = null }) {
    return new Promise((resolve, reject) => fs.mkdir(path, (err) => {
        if (err) reject(err);
        resolve()
    }))
}

function run({ command = null, cwd = null }) {
    return new Promise((resolve, reject) => exec(command, { cwd: cwd }, (err, stdout, stderr) => {
        if (err) reject(err);
        resolve()
    }))
}