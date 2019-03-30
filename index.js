const bool = require('boolean')
const flatten = require('./utils/array-flatten')
const lastOf = require('./utils/array-last')
const Twitter = require('twitter')

module.exports = async function (username, {
  credentials,
  count = 200,
  endpoint = 'favorites/list',
  maxRequests = Number.POSITIVE_INFINITY,
  trimUser = false,
  tweetMode = 'extended'
} = {}) {
  if (!username) throw new Error('You must specify a username\nSee https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/get-favorites-list')
  if (!credentials) throw new Error('You must specify valid credentials\nSee https://github.com/desmondmorris/node-twitter#for-user-based-authentication')

  const client = new Twitter(credentials)
  const pages = [await get(endpoint)]

  while (lastOf(pages) && lastOf(pages).length && pages.length < parseInt(maxRequests)) {
    // NOTE: pages are already sorted by ID
    const previousIDs = lastOf(pages).map(tweet => tweet.id)
    const latestID = lastOf(previousIDs)

    const page = await get(endpoint, { max_id: latestID })
    pages.push(page)
  }

  return flatten(pages)

  function get (endpoint, params) {
    const p = Object.assign({
      count: parseInt(count),
      screen_name: username,
      trim_user: bool(trimUser),
      tweet_mode: tweetMode.toLowerCase()
    }, params)

    return new Promise((resolve, reject) => {
      client.get(endpoint, p, (err, tweets) => {
        if (err) reject(err)
        resolve(tweets)
      })
    })
  }
}
