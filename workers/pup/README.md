# How to run in Heroku?
- Add buildpacks
  ```
  https://gitlab.com/fishprovider/heroku-doppler
  heroku/nodejs
  https://github.com/puppeteer/puppeteer.git
  ```

- Add env
  ```
  NPM_CONFIG_PRODUCTION=false
  DOPPLER_TOKEN=...
  ```
