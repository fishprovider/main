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
  DOPPLER_TOKEN=...
  ```
