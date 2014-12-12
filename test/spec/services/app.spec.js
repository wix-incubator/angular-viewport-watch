'use strict';

angular.module('angularStats', []);

describe('viewportWatch decorator', function () {
  beforeEach(module('angularViewportWatchApp'));

  it('should block usage of directive if no perf flag', inject(function ($rootScope, $compile) {
    expect(function () {
      $compile('<div viewport-watch></div>')($rootScope);
    }).not.toThrow();
  }));

  it('should not block usage of directive if perf flag', inject(function ($rootScope, $compile) {
    $rootScope.perf = true;
    expect(function () {
      $compile('<div viewport-watch></div>')($rootScope);
    }).toThrow();
  }));
});
