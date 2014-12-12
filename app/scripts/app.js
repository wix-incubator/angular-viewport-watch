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
  .config(function ($provide) {
    $provide.decorator('viewportWatchDirective', function ($delegate) {
      var hookedLink = $delegate[0].link;

      $delegate[0].compile = function () {
        return function (scope) {
          if (scope.perf) {
            return hookedLink.apply(this, arguments);
          }
        };
      };
      return $delegate;
    });
  });
