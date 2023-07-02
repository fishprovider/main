# How to run in Heroku?
- Add buildpacks
  ```
  https://buildpack-registry.s3.amazonaws.com/buildpacks/jontewks/puppeteer.tgz
  https://gitlab.com/fishprovider/heroku-doppler
  heroku/nodejs
  ```

- Add env
  ```
  NPM_CONFIG_PRODUCTION=false
  DOPPLER_TOKEN=...
  ```
