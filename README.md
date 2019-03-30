# `$ twitter-get-likes` <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/twitter/180/heavy-black-heart_2764.png" width="100" align="right">
**Get all your twitter likes**

<br>

## Installation

```sh
npm install --global arnaudjuracek/twitter-get-likes
```

## Usage

### CLI
```sh
twitter-get-likes

twitter-get-likes username
twitter-get-likes username > my-likes.csv
twitter-get-likes username --json > my-likes.json
twitter-get-likes --help
twitter-get-likes --version

Options
  -h, --help       Show this screen.
  -v, --version    Print the current version.
  --json           Output tweets as a JSON object instead of CSV.
  --schema         Specify a custom CSV schema path.

```
<sup>NOTE: This tool does not provide file writing capabilities ; use [`stdout` redirection](https://www.tldp.org/LDP/abs/html/io-redirection.html) to write files.</sup>

#### Credentials
Twitter API must be used with [access tokens](https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens.html), which are passed to **`twitter-get-likes`** cli using environment variables. See [`.env.example`](.env.example).

#### Specifying a custom CSV export schema
You can specify your own CSV export schema using a simple JSON to JavaScript `eval` implementation, where `tweet` is an object containing the current tweet (as exposed when using the `--json` flag):

###### example
```console
$ twitter-get-likes @nodejs --schema="date-and-id.json"
> date,id
>
> Wed Mar 27 2019 18:43:04 GMT+0100 (CET),1110960442292256800
```

###### `date-and-id.json`
```json
{
  "date": "new Date(tweet.created_at)",
  "id": "tweet.id"
}
```

#### Options
Some additionnals options are available through environment variables, see [`.env.example`](.env.example).


### Programmatic
```js
const getLikes = require('twitter-get-likes')

const options = {
  credentials: {
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
  },
  count: 200,
  endpoint: 'favorites/list',
  maxRequests: Number.POSITIVE_INFINITY,
  trimUser: false,
  tweetMode: 'extended'
}

getLikes('nodejs', options)
  .then(tweets => console.log(tweets))
  .catch(error => console.error(error))
```

## License
[MIT.](https://tldrlegal.com/license/mit-license)
