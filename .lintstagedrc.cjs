module.exports = {
  "apps/phone/**/*.{js,jsx,ts,tsx}": "npm run -w apps/phone ci-lint",
  "apps/phone/**/*.{ts,tsx}": "npm run -w apps/phone ci-type-check",
};
