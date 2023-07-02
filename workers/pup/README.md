# How to run in Heroku?
- Add buildpacks
  ```
  heroku/google-chrome
  https://gitlab.com/fishprovider/heroku-doppler
  heroku/nodejs
  ```

- Add env
  ```
  NPM_CONFIG_PRODUCTION=false
  PUPPETEER_EXECUTABLE_PATH=/app/.apt/usr/bin/google-chrome
  DOPPLER_TOKEN=...
  ```
