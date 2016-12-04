'use strict';

describe('Directive: viewportWatch', function () {
  var enterViewport, exitViewport, isInViewport;
  var scope, element, destroySpy;

  beforeEach(function () {
    enterViewport = undefined;
    exitViewport = undefined;
    isInViewport = true;
    scope = undefined;
    element = undefined;
    destroySpy = jasmine.createSpy('destroySpy');

    module('angularViewportWatch');

    module({
      scrollMonitor: {
        update: jasmine.createSpy('update'),
        create: jasmine.createSpy('create').and.callFake(function () {
          return {
            enterViewport: function (fn) {
              enterViewport = fn;
            },
            exitViewport: function (fn) {
              exitViewport = fn;
            },
            isInViewport: isInViewport,
            destroy: destroySpy
          };
        })
      }
    });
  });

  function compile(html, threshold) {
    inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      threshold = threshold === undefined ? '' : '="' + threshold + '"';
      element = $compile('<div viewport-watch' + threshold + '>' + html + '</div>')(scope);
      scope.$digest();
    });
    return scope;
  }

  function dup(str) {
    return str + str;
  }

  describe('single scope', function () {

    beforeEach(function () {
      compile('{{a}}');
    });

    it('should perform digest normally', function () {
      scope.$apply('a = 5');
      expect(element.text()).toBe('5');
    });

    it('should not perform digest if out of viewport', function () {
      exitViewport();
      scope.$apply('a = 5');
      expect(element.text()).toBe('');
    });

    it('should perform digest when back in viewport', function () {
      exitViewport();
      scope.$apply('a = 5');
      expect(element.text()).toBe('');
      enterViewport();
      expect(element.text()).toBe('5');
    });

    it('should keep digesting normally after coming back', function () {
      exitViewport();
      enterViewport();
      scope.$apply('a = 5');
      expect(element.text()).toBe('5');
    });

    it('should handle double exitViewport event', function () {
      exitViewport();
      exitViewport();
      enterViewport();
      scope.$apply('a = 5');
      expect(element.text()).toBe('5');
    });

    it('should handle double enterViewport event', function () {
      exitViewport();
      enterViewport();
      enterViewport();
      scope.$apply('a = 5');
      expect(element.text()).toBe('5');
    });

    it('should perform local digest when coming back', inject(function ($rootScope) {
      var globalWatchSpy = jasmine.createSpy('globalWatchSpy');
      var localWatchSpy = jasmine.createSpy('localWatchSpy');
      $rootScope.$watch(globalWatchSpy);
      scope.$watch(localWatchSpy);

      exitViewport();
      enterViewport();

      expect(globalWatchSpy).not.toHaveBeenCalled();
      expect(localWatchSpy).toHaveBeenCalled();
    }));

    it('should destroy scroll watcher when scope is destroyed', function () {
      scope.$destroy();
      expect(destroySpy).toHaveBeenCalled();
    });
  });

  describe('scope tree traversal', function () {
    it('should disable watchers in child scope', function () {
      compile('{{a}}<div ng-if="true">{{a}}</div>');
      exitViewport();
      scope.$apply('a = 5');
      expect(element.text()).toBe('');
      enterViewport();
      expect(element.text()).toBe('55');
    });

    it('should traverse tree with multiple children', function () {
      compile(dup('{{a}}<div ng-if="true">{{a}}</div>'));
      exitViewport();
      scope.$apply('a = 5');
      expect(element.text()).toBe('');
      enterViewport();
      expect(element.text()).toBe('5555');
    });

    it('should traverse tree recursively', function () {
      compile(dup('{{a}}<div ng-if="true">{{a}}<div ng-if="true">{{a}}</div></div>'));
      exitViewport();
      scope.$apply('a = 5');
      expect(element.text()).toBe('');
      enterViewport();
      expect(element.text()).toBe('555555');
    });

    it('should digest only once when coming back to view port', function () {
      var localWatchSpy = jasmine.createSpy('localWatchSpy');
      compile(dup('{{a}}<div ng-if="true">{{a}}<div ng-if="true">{{a}}</div></div>'));

      scope.$watch(localWatchSpy);
      scope.$digest();
      localWatchSpy.calls.reset();

      exitViewport();
      enterViewport();
      expect(localWatchSpy.calls.count()).toBe(1);
    });

    it('should not perform digest if initially out of viewport', function () {
      isInViewport = false;
      compile('{{a}}<div ng-if="true">{{a}}</div>');
      scope.$apply('a = 5');
      expect(element.text()).toBe('{{a}}');
      enterViewport();
      expect(element.text()).toBe('55');
    });

    it('should perform initial ng-repeat digest even if out of viewport',
      inject(function ($compile, $rootScope) {
        isInViewport = false;
        scope = $rootScope.$new();
        scope.a = 5;
        element = $compile('<div><div ng-repeat="item in [a] track by $index" ' +
                           'viewport-watch>{{item}}</div></div>')(scope);
        scope.$digest();
        expect(element.text()).toBe('5');
        scope.$apply('a = 6');
        expect(element.text()).toBe('5');
        enterViewport();
        expect(element.text()).toBe('6');
      })
    );
  });

  describe('update scroll watcher', function () {
    afterEach(inject(function ($timeout) {
      $timeout.verifyNoPendingTasks();
    }));

    it('should trigger on destroy', inject(function ($timeout, scrollMonitor) {
      compile();
      scope.$destroy();
      expect(scrollMonitor.update).not.toHaveBeenCalled();
      $timeout.flush();
      expect(scrollMonitor.update.calls.count()).toBe(1);
    }));

    it('should not trigger on create in viewport', function () {
      compile();
    });

    it('should trigger on create outside viewport', inject(function ($timeout, scrollMonitor) {
      isInViewport = false;
      compile();
      expect(scrollMonitor.update).not.toHaveBeenCalled();
      $timeout.flush();
      expect(scrollMonitor.update.calls.count()).toBe(1);
    }));

    it('should debounce destroy trigger', inject(function ($timeout, scrollMonitor) {
      isInViewport = false;
      compile();
      scope.$destroy();
      compile();
      scope.$destroy();
      expect(scrollMonitor.update).not.toHaveBeenCalled();
      $timeout.flush();
      expect(scrollMonitor.update.calls.count()).toBe(1);
    }));
  });

  describe('threshold parameter', function () {
    it('should pass threshold 0 by default', inject(function (scrollMonitor) {
      compile();
      expect(scrollMonitor.create).toHaveBeenCalledWith(jasmine.any(Object), 0);
    }));

    it('should pass threshold parameter', inject(function (scrollMonitor) {
      compile('', 200);
      expect(scrollMonitor.create).toHaveBeenCalledWith(jasmine.any(Object), 200);
    }));

    it('should pass threshold variable', inject(function ($rootScope, scrollMonitor) {
      $rootScope.threshold = 500;
      compile('', 'threshold');
      expect(scrollMonitor.create).toHaveBeenCalledWith(jasmine.any(Object), 500);
    }));
  });

  describe('toggleWatchers scope event', function () {
    beforeEach(function () {
      compile('{{a}}');
    });

    it('should not perform digest if toggleWatchers off was sent', function () {
      scope.$broadcast('toggleWatchers', false);
      scope.$apply('a = 5');
      expect(element.text()).toBe('');
    });

    it('should perform digest when toggleWatchers back on was sent', function () {
      scope.$broadcast('toggleWatchers', false);
      scope.$apply('a = 5');
      expect(element.text()).toBe('');
      scope.$broadcast('toggleWatchers', true);
      expect(element.text()).toBe('5');
    });

    it('should be okay to broadcast toggleWatchers during scope phase', function () {
      scope.$apply(function () {
        scope.$broadcast('toggleWatchers', false);
      });
      scope.$apply('a = 5');
      expect(element.text()).toBe('');
      scope.$apply(function () {
        scope.$broadcast('toggleWatchers', true);
      });
      expect(element.text()).toBe('5');
    });
  });

  describe('scope.$watch edge cases', function () {
    beforeEach(function () {
      compile('{{a}}');
    });

    it('should be able to remove watcher while watchers are disabled', function () {
      var watchSpy = jasmine.createSpy('watchSpy');
      var unwatch = scope.$watch(watchSpy);
      scope.$broadcast('toggleWatchers', false);
      unwatch();
      scope.$broadcast('toggleWatchers', true);
      scope.$digest();
      expect(watchSpy).not.toHaveBeenCalled();
    });

    it('should be able to add watcher while watchers are disabled', function () {
      var watchSpy = jasmine.createSpy('watchSpy');
      scope.$broadcast('toggleWatchers', false);
      scope.$watch(watchSpy);
      scope.$broadcast('toggleWatchers', true);
      scope.$digest();
      expect(watchSpy).toHaveBeenCalled();
    });

    it('should be able to add watcher while watchers are disabled', function () {
      var watchSpy = jasmine.createSpy('watchSpy');
      compile();
      scope.$broadcast('toggleWatchers', false);
      scope.$watch(watchSpy);
      scope.$broadcast('toggleWatchers', true);
      scope.$digest();
      expect(watchSpy).toHaveBeenCalled();
    });

    it('should be able to add watcher after watchers are enabled', function () {
      var watchSpy = jasmine.createSpy('watchSpy');
      scope.$broadcast('toggleWatchers', false);
      scope.$broadcast('toggleWatchers', true);
      scope.$watch(watchSpy);
      scope.$digest();
      expect(watchSpy).toHaveBeenCalled();
    });
  });

});
