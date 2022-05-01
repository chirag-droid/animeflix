module.exports = {
  '*.{js,jsx,ts,tsx}': ['npm lint --fix', 'eslint'],
  '*.json': ['prettier --write'],
};
