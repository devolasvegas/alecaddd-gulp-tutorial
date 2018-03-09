'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var wait = require('gulp-wait');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var styleSRC = 'src/scss/style.scss';
var styleDIST = './dist/css/';
var stylewatch = 'src/scss/**/*.scss';

var jsSRC = 'script.js';
var jsFolder = 'src/js/';
var jsDIST = './dist/js/';
var jswatch = 'src/js/**/*.js'
var jsFILES = [jsSRC];

var htmlwatch = '**/*.html';
var phpwatch = '**/*.php';

gulp.task('browser-sync', function() {
    browserSync.init({ 
        open: false,
        injectChanges: true,
        server: {
            baseDir: "./"
        }
     });
});

gulp.task('style', function() {
    gulp.src(styleSRC)
        .pipe(wait(500))
        .pipe(sourcemaps.init())
        .pipe(sass( {
            errorLogToConsole: true,
            outputStyle: 'compressed'
        } ))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer( {
             browsers: [ 'last 2 versions' ], 
             cascade: false 
            } ))
        .pipe(rename( { suffix: '.min' } ))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(styleDIST))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
    jsFILES.map(function(entry) {
        return browserify( {
            entries: [jsFolder + entry]
        } )
        .transform(babelify, {
            presets: ['env']
        })
        .bundle()
        .pipe(source(entry))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(jsDIST))
        .pipe(browserSync.stream());
    });

    // browserify - include all modules
    // transform with babelify [env] - back-convert ES6 syntax
    // bundle
    // source
    // rename with .min
    // buffer
    // init sourcemap
    // uglify (minify)
    // write sourcemap
    // save to dist
});

gulp.task('default', ['style', 'js'], function() {
    // Do other stuff.
});

gulp.task('watch', ['default', 'browser-sync'], function() {
    gulp.watch(stylewatch, ['style']);
    gulp.watch(jswatch, ['js', reload]);
    gulp.watch(htmlwatch, reload);
    gulp.watch(phpwatch, reload)
});