Angular Viewport Watch [![Build Status](https://travis-ci.org/shahata/angular-viewport-watch.svg?branch=master)](https://travis-ci.org/shahata/angular-viewport-watch) [![Coverage Status](https://coveralls.io/repos/shahata/angular-viewport-watch/badge.png?branch=master)](https://coveralls.io/r/shahata/angular-viewport-watch?branch=master)
================

Boost performance of [Angular](http://www.angularjs.org)'s `ng-repeat` directive for long lists by disabling watchers while elements are not displayed inside viewport.

Demo: http://shahata.github.io/angular-viewport-watch/

BTW, `ng-repeat` is just an example, this directive will work on anything.

## What it does

Displaying long lists of items is a big pain in angular since they add many more watchers to the scope which makes the digest loop longer. Since every model change in angular triggers a digest loop, even a simple thing like typing a name inside some input field might become sluggish if a long list of some items is displayed on the page at the same time.

Angular 1.3 added a bind-once mechanism which removes watchers once they receive a value, but this only helps if the list you are displaying is static. What about cases where your list contains dynamic information which might change at any moment? Bind-once will not help you in those cases.

This library introduces a simple directive named `viewport-watch` which solves this issue by disabling watchers that are currently out of the viewport and makes sure they get enabled and updated with their correct value the moment they come back into the viewport. This means that at any moment, the amount of items being watched is not greater then the amount of items that fit into the user's screen. This obviously cuts down the digest loop length by orders of magnitude.

## Installation

Install using bower

`bower install --save angular-viewport-watch`

Include script tag in your html document.

```html
<script src="bower_components/scrollMonitor/scrollMonitor.js"></script>
<script src="bower_components/angular-viewport-watch/angular-viewport-watch.js"></script>
```

Add a dependency to your application module.

```javascript
angular.module('myApp', ['angularViewportWatch']);
```

## Directive Usage

```html
<div ng-repeat="item in items" viewport-watch>...</div>
```

## Manual watcher toggling

In some cases you might want to disable or enable the watchers of some scope regardless of its position relative to the view port. This can be done easily by broadcasting an event to this scope (this will effect only scopes that have the `viewport-watch` directive on them):

```js
scope.$broadcast('toggleWatchers', false); //turn off watchers
scope.$broadcast('toggleWatchers', true);  //turn watchers back on
```

## License

The MIT License.

See [LICENSE](https://github.com/shahata/angular-viewport-watch/blob/master/LICENSE)
