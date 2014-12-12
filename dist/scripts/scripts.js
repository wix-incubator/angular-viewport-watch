"use strict";

angular.module("angularViewportWatchAppInternal", [ "angularViewportWatch" ]);

angular.module("angularViewportWatchApp", [ "angularViewportWatchAppInternal", "angularStats" ]).config([ "$provide", function($provide) {
    $provide.decorator("viewportWatchDirective", [ "$delegate", function($delegate) {
        var hookedLink = $delegate[0].link;
        $delegate[0].compile = function() {
            return function(scope) {
                if (scope.perf) {
                    return hookedLink.apply(this, arguments);
                }
            };
        };
        return $delegate;
    } ]);
} ]);

"use strict";

(function() {
    function MainController($scope, $timeout, scrollMonitor) {
        var vm = this;
        $scope.perf = true;
        vm.size = 500;
        vm.selected = [ 5, 5 ];
        vm.generate = function() {
            vm.bump = 0;
            vm.items = [];
            $timeout(function() {
                scrollMonitor.update();
                for (var i = 0; i < vm.size; i++) {
                    vm.items.push("item #" + i);
                }
            }, 10);
        };
        $scope.$watch("perf", function() {
            vm.generate();
        });
    }
    MainController.$inject = [ "$scope", "$timeout", "scrollMonitor" ];
    angular.module("angularViewportWatchAppInternal").controller("MainController", MainController);
})();