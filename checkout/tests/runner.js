const createTestCafe = require('testcafe');
let testcafe = null;

createTestCafe('localhost', 8081)
  .then(tc => {
    testcafe = tc;
    const liveRunner = testcafe.createLiveModeRunner();

    return liveRunner
      .src('tests/tests.js')
      .browsers('chrome')
      .run();
  })
  .then(() => {
    testcafe.close();
  });
