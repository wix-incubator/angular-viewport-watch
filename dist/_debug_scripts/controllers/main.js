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

  angular
    .module('angularViewportWatchAppInternal')
    .controller('MainController', MainController);

})();
