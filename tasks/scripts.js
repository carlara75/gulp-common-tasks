var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var argv = require('yargs').argv,
    ts = require('gulp-typescript'),
    replace = require('gulp-replace'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    merge = require('merge2'),
    require_merge = require('./_require-merge.js');

var config = require_merge('_config.js'),
    tsProject = require_merge('_tsProject.js'),
    systemjsConfig = require_merge('_systemjsConfig.js');


gulp.task('scripts', ['typescript'], function () {
    if (argv.production) {
        var Builder = require('systemjs-builder');
        var builder = new Builder(systemjsConfig);

        //builder.build('main/**/* - angular2/angular2', config.paths.dest + '/js/myModule.js');

        Promise.all([builder.trace('main - extras'), //  - angular2/angular2
            builder.trace('extras')])
            .then(function (trees) {
                return Promise.all([
                    builder.buildTree(trees[0], config.paths.dest + '/js/main.js'),
                    builder.buildTree(trees[1], config.paths.dest + '/js/extras.js')
                ]);
            });
    }
});

// skip source maps:  gulp scripts --production
gulp.task('typescript', function () {
    if (argv.production) {
        gulp.start('scripts:requirejs');
    } else {
        gulp.start('typescript:dev');
    }
});

gulp.task('scripts:requirejs', ['typescript:dev'], function() {
    return gulp.src(['.tmp/js/main.js',
        '.tmp/js/extras.js'])
        .pipe(requirejsOptimize(require('./_requirejsOptimize')))
        .pipe(gulp.dest(config.paths.dest));
});

gulp.task('typescript:dev', function () {
    //var tsResult = gulp.src('app/**/*.ts')
    //    .pipe(ts({
    //        typescript: require('typescript'),
    //        noImplicitAny: true,
    //        out: 'output.js'
    //    }));
    //return tsResult.js.pipe(gulp.dest('.tmp'));

    var tsResult = gulp.src(config.typescript.src)
        //.pipe(sourcemaps.init())
        .pipe(ts(tsProject)); //, {}, ts.reporter.longReporter()));

    return merge(
        tsResult.js
            //.pipe(ts.filter(tsProject, { referencedFrom: ['main.ts'] }))
            //.pipe(concat('main.js'))
            //.pipe(replace(/'scripts\/_/, '\'js/'))
            .pipe(replace(/(\.\.\/)*(bower_components\/)?/g, ''))
            //// 'bower-my-jobjs/my-jobs/MyJobs'
            .pipe(replace(/'[-\w\/]*\/app\/components\//g, '\''))
            //.pipe(amdOptimize(requirejsConfig))
            //.pipe(concat('main.js'))
            //.pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '..' }))
            .pipe(gulp.dest('.tmp/js'))
        //tsResult.js
        //    .pipe(ts.filter(tsProject, { referencedFrom: ['extras.ts'] }))
        //    //.pipe(amdOptimize(requirejsConfig))
        //    //.pipe(concat('extras.js'))
        //    .pipe(sourcemaps.write())
        //    .pipe(gulp.dest('.tmp/js')),
        //tsResult.dts.pipe(gulp.dest('.tmp/declarations'))
    );
});
