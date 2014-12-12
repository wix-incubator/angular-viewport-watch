'use strict';

describe('Controller: MainController', function () {

  // load the controller's module
  beforeEach(function () {
    module('angularViewportWatchAppInternal');
    module({scrollMonitor: {update: angular.noop}});
  });

  var MainController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainController = $controller('MainController as main', {
      $scope: scope
    });
  }));

  it('should add 500 items on startup', inject(function ($timeout) {
    scope.$digest();
    expect(MainController.items.length).toBe(0);
    $timeout.flush();
    expect(MainController.items.length).toBe(500);
  }));
});
