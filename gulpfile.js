/**
 * Gulpfile.js
 */

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 8',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 2.3'
];

// 画像最適化
gulp.task('images', function() {
  return gulp.src('images/**/*')
    .pipe($.size({ title: 'Before optimize images' }))
    .pipe($.cache($.imagemin({
      progressive: false,
      interlaced: false
    })))
    .pipe(gulp.dest('images'))
    .pipe($.size({ title: 'After optimize images' }));
});

// Sassファイルをコンパイルしたりベンダープレフィックスをつけたり消したり
gulp.task('styles', function() {
  return gulp.src(['scss/*.scss'])
    .pipe($.if('*.scss', $.rubySass({
      style: 'expanded',
      precision: 5
    })
    .on('error', console.error.bind(console))
    ))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('css'));
});

// Browser-sync & watch
gulp.task('serve', function() {
  browserSync({
    proxy: 'servername'
  });

  gulp.watch(['**/*.{php, html}'], reload);
  gulp.watch(['scss/*.scss'], ['styles', reload]);
  gulp.watch(['images/**/*'], reload);
});

// デフォルトタスク
gulp.task('default', function() {
  runSequence('serve', ['styles']);
});
