export default {
  browsers: ["chrome:headless"],
  src: ["e2e/pokemon-battle-complete.test.js"],
  screenshots: {
    path: "e2e/screenshots/",
    takeOnFails: true,
    pathPattern:
      "${DATE}_${TIME}/test-${TEST_INDEX}/${USERAGENT}/${FILE_INDEX}.png",
  },
  quarantineMode: false,
  skipJsErrors: true,
  skipUncaughtErrors: true,
  concurrency: 1,
  assertionTimeout: 3000,
  selectorTimeout: 10000,
  pageLoadTimeout: 8000,
  speed: 0.1,
  stopOnFirstFail: false,
};
