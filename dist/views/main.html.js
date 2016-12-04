'use strict';

try {
  angular.module('angularViewportWatchAppInternal');
} catch (e) {
  angular.module('angularViewportWatchAppInternal', []);
}

angular.module('angularViewportWatchAppInternal').run(['$templateCache', function ($templateCache) {
  'use strict';

  $templateCache.put('views/main.html',
    "<div class='hero-unit' ng-controller='MainController as main'>\n" +
    "  <h1>\n" +
    "    {{'general.YO' | translate}}\n" +
    "    <i class='logo-on-header angular-viewport-watch-svg-font-icons-wix-logo'></i>\n" +
    "  </h1>\n" +
    "  <p>You now have</p>\n" +
    "  <ul>\n" +
    "    <li ng-repeat='thing in main.awesomeThings'>{{thing}}</li>\n" +
    "  </ul>\n" +
    "  <p>installed.</p>\n" +
    "  <h3>Enjoy coding! - Yeoman</h3>\n" +
    "</div>\n"
  );
}]);