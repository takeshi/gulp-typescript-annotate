'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var mkdirp = require('mkdirp');

var $ = require('gulp-load-plugins')();
var typescriptAnnotate = require('../../index');

module.exports = function(options) {
  gulp.task('scripts', ['tsd:install'], function () {
    mkdirp.sync(options.tmp);

    return gulp.src(options.src + '/app/**/*.ts')
      .pipe($.sourcemaps.init())
      .pipe(typescriptAnnotate())
      .pipe($.typescript(
        {target: 'es5'}
       )).on('error', options.errorHandler('TypeScript'))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(options.tmp + '/serve/app'))
      .pipe(browserSync.reload({ stream: true }))
      .pipe($.size());
  });
};
