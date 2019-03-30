const CSV = require('csv-string')

module.exports = function (parsers) {
  return function (tweets) {
    let csv = CSV.stringify(Object.keys(parsers))

    tweets.forEach(tweet => {
      const line = CSV.stringify(Object.values(parsers).map(parser => parser(tweet)))
      csv += '\n' + line
    })
    return csv
  }
}
