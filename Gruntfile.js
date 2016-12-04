// Generated on 2014-12-12 using generator-wix-angular 0.1.84
'use strict';

module.exports = function (grunt) {
  var unitTestFiles = [];
  require('./karma.conf.js')({set: function (karmaConf) {
    unitTestFiles = karmaConf.files.filter(function (value) {
      return value.indexOf('bower_component') !== -1;
    });
  }});
  require('wix-gruntfile')(grunt, {
    port: 9000,
    preloadModule: 'angularViewportWatchAppInternal',
    unitTestFiles: unitTestFiles,
    protractor: false,
    bowerComponent: true
  });

  grunt.modifyTask('yeoman', {
    local: 'http://localhost:<%= connect.options.port %>/'
  });

  grunt.modifyTask('karma', {
    teamcity: {
      coverageReporter: {dir: 'coverage/', type: 'lcov'}
    }
  });

  grunt.modifyTask('copy', {
    js: {
      expand: true,
      cwd: 'dist/scripts',
      dest: '',
      src: 'angular-viewport-watch.js'
    }
  });

  grunt.hookTask('build').push('copy:js');

};
