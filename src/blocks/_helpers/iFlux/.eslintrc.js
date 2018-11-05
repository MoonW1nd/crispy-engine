module.exports = {
    "extends": "airbnb-base",
    "rules": {
      "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
      "no-unused-expressions": "off",
    },
    "env": {
      "browser": true,
      "node": true
    },
    "globals": {
      "describe": true,
      "it": true,
      "afterEach": true,
      "beforeEach": true,
    }
};
