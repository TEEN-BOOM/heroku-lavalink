
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

const logger = new Timber(ID, KEY, {
  // Maximum number of logs to sync in a single request to Timber.io
  batchSize: 1000,

  // Max interval (in milliseconds) before a batch of logs proceeds to syncing
  batchInterval: 1000,

  // Maximum number of sync requests to make concurrently (useful to limit
  // network I/O)
  syncMax: 100, // <-- we've increased concurrent network connections up to 100

  // Boolean to specify whether thrown errors/failed logs should be ignored
  ignoreExceptions: false,
});

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

