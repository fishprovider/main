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
  PUPPETEER_EXECUTABLE_PATH=/app/.apt/usr/bin/google-chrome
  DOPPLER_TOKEN=...
  ```
