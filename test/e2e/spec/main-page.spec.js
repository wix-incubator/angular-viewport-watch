'use strict';

require('../lib/matchers.protractor.js');
var MainPage = require('../pages/main-page.js');

describe('angularViewportWatchApp Main Page', function () {
  var mainPage;

  beforeEach(function () {
    mainPage = new MainPage();
    // browser.addMockModule('angularViewportWatchAppMocks', function () {});
  });

  afterEach(function () {
    // browser.removeMockModule('angularViewportWatchAppMocks');
  });

  it('should load successfully', function () {
    mainPage.navigate();
    // expect(mainPage.getTitle().getText()).toEqual('Enjoy coding! - Yeoman');
  });

});
