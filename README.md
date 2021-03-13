# CenterIdentity.com expo SDK!
## Make a blockchain social network using expo in literally minutes!

```bash
npm install centeridentity-expo
yarn add centeridentity-expo
```

## Usage
`nvm install 15`

`expo init` (follow prompts)

`cd *your app dir*`

`yarn add centeridentity-expo`

in `app.json`, modify to include this:
```
{
  "expo": {
    "web": {
      "build": {
        "babel": {
          "include": [
            "centeridentity-expo"
          ]
        }
      }
    }
  }
}
```
in your `App.js` (or wherever you want to include this component), paste:

`import { RecoverIdentity } from 'centeridentity-expo';` 

in the return from your render method or function, paste:
```
<RecoverIdentity
  apiKey='YOUR_API_KEY_FROM_DASHBOARD'
  sessionIdUrl='/generate-session-uuid'
  signinUrl='/create-identity'
  registerUrl='/create-identity'
  userNotFoundMessage='Identity not found for provided username and coordinates. Create a new identity?'
  publicUsernameLabel='Public username'
  privateUsernameLabel='Private username (do not share)'
  onSuccessfulRegister={(result) => {window.location.href = '/socialapp'}}
  onSuccessfulSignIn={(result) => {window.location.href = '/socialapp'}}
  onFailedRegister={(err) => {console.log(err)}}
  onFailedSignIn={(err) => {console.log(err)}}
  createText='Create'
  tryAgainText='Try again'
  width='100%'
  height={600}
/>
```

copy `src/web/index.html` from this repository into the root directory at `web/index.html`

in `web/index.html`, replace `YOUR_GOOGLE_MAPS_API_KEY` with your own google maps api key

`expo start:web`

Done!

## Contributing

PR, stars ✭ and issue reporting, welcome!

## License

MIT
