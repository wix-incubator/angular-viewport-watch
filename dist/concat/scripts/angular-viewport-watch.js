/* global window */
'use strict';

(function () {

  /* @ngInject */
  function viewportWatch(scrollMonitor, $timeout) {
    var viewportUpdateTimeout;

    function debouncedViewportUpdate() {
      $timeout.cancel(viewportUpdateTimeout);
      viewportUpdateTimeout = $timeout(function () {
        scrollMonitor.update();
      }, 10);
    }

    return {
      restrict: 'AE',
      link: function (scope, element, attrs) {
        var elementWatcher = scrollMonitor.create(element, scope.$eval(attrs.viewportWatch || '0'));

        function toggleDigest(scope, enable) {
          var digest, current, next = scope;

          do {
            current = next;

            if (enable) {
              if (current.hasOwnProperty('$$watchersBackup')) {
                current.$$watchers = current.$$watchersBackup;
                delete current.$$watchersBackup;
                digest = true;
              }
            } else {
              if (!current.hasOwnProperty('$$watchersBackup')) {
                current.$$watchersBackup = current.$$watchers;
                current.$$watchers = null;
              }
            }

            //DFS
            next = current.$$childHead;
            while (!next && current !== scope) {
              if (current.$$nextSibling) {
                next = current.$$nextSibling;
              } else {
                current = current.$parent;
              }
            }
          } while (next);

          if (digest) {
            scope.$digest();
          }
        }

        if (!elementWatcher.isInViewport) {
          scope.$evalAsync(function () {
            toggleDigest(scope, false);
          });
          debouncedViewportUpdate();
        }
        elementWatcher.enterViewport(function () {
          toggleDigest(scope, true);
        });
        elementWatcher.exitViewport(function () {
          toggleDigest(scope, false);
        });
        scope.$on('$destroy', function () {
          elementWatcher.destroy();
          debouncedViewportUpdate();
        });
      }
    };
  }
  viewportWatch.$inject = ["scrollMonitor", "$timeout"];

  angular
    .module('angularViewportWatch', [])
    .directive('viewportWatch', viewportWatch)
    .value('scrollMonitor', window.scrollMonitor);

})();
