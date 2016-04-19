// Compile and automatically prefix stylesheets
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var require_merge = require('./_require-merge.js');
var config = require_merge('_config.js');

var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

gulp.task('styles', function () {
    return styleTask('styles', config.styles.src);
});

gulp.task('styles:elements', function () {
    return styleTask('elements', config.styles.elements);
});


var styleTask = function (stylesPath, srcs) {
    return gulp.src(srcs)
        .pipe($.sourcemaps.init())
        //.pipe($.changed('.tmp/styles', {extension: '.css'}))
        .pipe($.sass({
            precision: 10,
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/' + stylesPath))
        .pipe($.if('*.css', $.csso()))
        .pipe(gulp.dest('dist/' + stylesPath))
        .pipe($.size({title: stylesPath}));
};
//
///** Copied from LESS */
//var lighten = function(color, amount, method) {
//    var hsl = color.toHSL();
//
//    if (typeof method !== "undefined" && method.value === "relative") {
//        hsl.l +=  hsl.l * amount.value / 100;
//    }
//    else {
//        hsl.l += amount.value / 100;
//    }
//    hsl.l = clamp(hsl.l);
//    return hsla(hsl);
//};
//
//var darken = function (color, amount, method) {
//    var hsl = color.toHSL();
//
//    if (typeof method !== "undefined" && method.value === "relative") {
//        hsl.l -=  hsl.l * amount.value / 100;
//    }
//    else {
//        hsl.l -= amount.value / 100;
//    }
//    hsl.l = clamp(hsl.l);
//    return hsla(hsl);
//};
