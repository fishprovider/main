# How to run in Heroku?
- Add buildpacks
  ```
  https://gitlab.com/fishprovider/heroku-doppler
  heroku/nodejs
  jontewks/puppeteer
  heroku/google-chrome
  ```

- Add env
  ```
  NPM_CONFIG_PRODUCTION=false
  DOPPLER_TOKEN=...
  ```
