const fs = require('fs')
const fse = require('fs-extra')
const rimraf = require("rimraf")
const envfile = require('envfile')
const {
    exec
} = require('child_process')
const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Which env (staging/prod) ? ", env => {
    if (!['staging', 'prod'].includes(env)) {
        console.log("Invalid env")
        process.exit(1)
    }
    console.log("Starting");

    (async () => {
        console.log("Clear build directory")
        await new Promise((resolve, reject) => rimraf(`${__dirname}/build/`, (err) => { if (err) reject(err); resolve() }))
        await new Promise((resolve, reject) => fs.mkdir(`${__dirname}/build/`, (err) => { if (err) reject(err); resolve() }))

        await new Promise((resolve, reject) => fs.mkdir(`${__dirname}/build/front`, (err) => { if (err) reject(err); resolve() }))
        await new Promise((resolve, reject) => fs.mkdir(`${__dirname}/build/api`, (err) => { if (err) reject(err); resolve() }))
        await new Promise((resolve, reject) => fs.mkdir(`${__dirname}/build/final`, (err) => { if (err) reject(err); resolve() }))

        console.log("[FRONT] Copying folders")
        await fse.copy(`${__dirname}/../front/`, `${__dirname}/build/front`, {
            filter: name => !name.match(/node_modules/)
        })

        console.log("[FRONT] Installing dependencies")
        await new Promise((resolve, reject) => exec('npm install --silent', { cwd: `${__dirname}/build/front` }, (err, stdout, stderr) => { if (err) reject(err); resolve() }))

        console.log("[FRONT] Building")
        await new Promise((resolve, reject) => exec('npm run build --silent', { cwd: `${__dirname}/build/front` }, (err, stdout, stderr) => { if (err) reject(err); resolve() }))

        console.log("[API] Copying folders")
        await fse.copy(`${__dirname}/../api/`, `${__dirname}/build/api`, {
            filter: name => !name.match(/vendor|cache|log/)
        })

        console.log("[API] Editing .env")
        await new Promise((resolve, reject) => {
            const sourceObject = {
                ...envfile.parseFileSync(__dirname + "/build/api/.env")
            }
            sourceObject.APP_ENV = env
            sourceObject.APP_DEBUG = env !== "prod"

            fs.writeFileSync(__dirname + "/build/api/.env", envfile.stringifySync(sourceObject))
            resolve()
        })


        console.log("[API] Installing dependencies")
        await new Promise((resolve, reject) => exec(`cd ${__dirname}/build/api`, { cwd: `${__dirname}/build/api` }, (err, stdout, stderr) => { if (err) reject(err); resolve() }))
        await new Promise((resolve, reject) => exec('composer install --no-dev --optimize-autoloader -q', { cwd: `${__dirname}/build/api` }, (err, stdout, stderr) => { if (err) reject(err); resolve() }))

        console.log("Creating final build")
        await fse.copy(`${__dirname}/build/api/`, `${__dirname}/build/final`)
        await new Promise((resolve, reject) => rimraf(`${__dirname}/build/final/public/app`, (err) => { if (err) reject(err); resolve() }))
        await fse.copy(`${__dirname}/build/front/out/`, `${__dirname}/build/final/public/app`)

        console.log("Done")

    })()
})