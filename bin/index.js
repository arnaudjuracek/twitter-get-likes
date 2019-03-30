#!/usr/bin/env node
require('dotenv').config()

const fs = require('fs')
const getLikesOf = require('../')
const parsers = require('../parsers')
const path = require('path')
const pckg = require('package')(module)
const saferEval = require('safer-eval')
const argv = require('minimist')(process.argv.slice(2), {
  boolean: ['json', 'help', 'version'],
  alias: { help: 'h', version: 'v' },
  default: {
    schema: path.join(__dirname, 'csv-schema.json')
  }
})

if (argv.help) {
  console.log(fs.readFileSync(path.join(__dirname, 'USAGE'), 'utf-8'))
  process.exit(0)
}

if (argv.version) {
  console.log(pckg.version)
  process.exit(0)
}

const username = argv._[0]

if (!username) {
  console.error('You must specify a username')
  console.error(`See '${Object.keys(pckg.bin)} --help'`)
  process.exit(1)
}

const options = {
  credentials: {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  },
  count: process.env.COUNT,
  endpoint: process.env.ENDPOINT,
  maxRequests: process.env.MAX_REQUESTS,
  trimUser: process.env.TRIM_USER,
  tweetMode: process.env.TWEET_MODE
}

// NOTE: the csv parser accepts an export schema as an object.
// This bin script use a JSON to represent this object :
// { "colName": "tweet.value" }
const csvSchemaParsers = {}
const schemaFile = path.isAbsolute(argv.schema)
  ? argv.schema
  : path.resolve(process.cwd(), argv.schema)
Object.entries(require(schemaFile)).forEach(([key, parser]) => {
  csvSchemaParsers[key] = saferEval('tweet =>' + parser)
})

getLikesOf(username.replace('@', ''), options)
  .then(argv.json
    ? parsers.json
    : parsers.csv(csvSchemaParsers)
  )
  .then(console.log)
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
