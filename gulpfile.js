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

var styleSRC = 'src/scss/style.scss';
var styleDIST = './dist/css/';
var stylewatch = 'src/scss/**/*.scss';

var jsSRC = 'script.js';
var jsFolder = 'src/js/';
var jsDIST = './dist/js/';
var jswatch = 'src/js/**/*.js'
var jsFILES = [jsSRC];

gulp.task('browser-sync', function() {
    browserSync.init({ 
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
        .pipe(gulp.dest(styleDIST));
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

gulp.task('watch', ['default'], function() {
    gulp.watch(stylewatch, ['style']);
    gulp.watch(jswatch, ['js']);
});