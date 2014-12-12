'use strict';

try {
  angular.module('wixAppTranslations');
} catch (e) {
  angular.module('wixAppTranslations', ['pascalprecht.translate']);
}

angular.module('wixAppTranslations').config(function ($translateProvider) {
  $translateProvider.translations({
    'general': {
      'YO': '안녕하세요'
    }
  });
});
