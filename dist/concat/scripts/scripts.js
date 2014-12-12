'use strict';

//add services, directives, controllers, filters, etc. in this module
//avoid adding module dependencies for this module
angular
  .module('angularViewportWatchAppInternal', ['angularViewportWatch']);

//add module dependencies & config and run blocks in this module
//load only the internal module in tests and mock any module dependency
//the only exception to load this module in tests in to test the config & run blocks
angular
  .module('angularViewportWatchApp', ['angularViewportWatchAppInternal', 'angularStats'])
  .config(["$provide", function ($provide) {
    $provide.decorator('viewportWatchDirective', ["$delegate", function ($delegate) {
      var hookedLink = $delegate[0].link;

      $delegate[0].compile = function () {
        return function (scope) {
          if (scope.perf) {
            return hookedLink.apply(this, arguments);
          }
        };
      };
      return $delegate;
    }]);
  }]);

'use strict';

(function () {

  /* @ngInject */
  function MainController($scope, $timeout, scrollMonitor) {
    var vm = this;
    $scope.perf = true;
    vm.size = 500;
    vm.selected = [5, 5];
    vm.generate = function () {
      vm.bump = 0;
      vm.items = [];
      $timeout(function () {
        scrollMonitor.update(); //hack to workaround some bug
        for (var i = 0; i < vm.size; i++) {
          vm.items.push('item #' + i);
        }
      }, 10);
    };
    $scope.$watch('perf', function () {
      vm.generate();
    });
  }
  MainController.$inject = ["$scope", "$timeout", "scrollMonitor"];

  angular
    .module('angularViewportWatchAppInternal')
    .controller('MainController', MainController);

})();


