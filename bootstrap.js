
const fs = require('fs')
const { Timber } = require("@timberio/node");
let application = fs.readFileSync('./application.yml', 'utf8')

if (process.env.PORT) {
    application = application.replace('DYNAMICPORT', process.env.PORT)
}

if (process.env.PASS) {
    application = application.replace('youshallnotpass', process.env.PASS)
}

var ID = process.env.ID
var KEY = process.env.KEY

var logger = new Timber(ID, KEY, {
  syncMax: 10,
  ignoreExceptions: false
});
// logger.setSync(async logs => {
//     logs.forEach(log => console.log(log));
//     return logs;
// })

fs.writeFileSync('./application.yml', application)

const spawn = require('child_process').spawn;
const child = spawn('java', ['-jar', 'Lavalink.jar'])

child.stdout.setEncoding('utf8')
child.stderr.setEncoding('utf8')

child.stdout.on('data', (data) => {
    console.log(data);
    logger.log(data);
});

child.stderr.on('data', (data) => {
    console.error(data);
    logger.error(data);
});

child.on('error', (error) => {
    console.error(error);
    logger.error(error);
});

child.on('close', (code) => {
    console.log(`Lavalink exited with code ${code}`);
    logger.log(`Lavalink exited with code ${code}`);
});

