const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const useref = require('gulp-useref');
const filter = require('gulp-filter');
const uglify = require('gulp-uglify');
const csso = require('gulp-csso');
const clean = require('gulp-clean');
const gulpif = require('gulp-if');

gulp.task("clean", [], function () {
    return gulp.src('build', { read: false }).pipe(clean());
});

gulp.task("sassify", [], function () {
    console.log("Sassifying stuff...");
    gulp.src('public/style/styles.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('public/style'));
    console.log("Done Sassifyin");
});

gulp.task("watchSass", function () {
    gulp.watch('**/*.scss', ['sassify']);
});

gulp.task("moveStatics", ["clean"], function () {
    gulp.src('public/images/*')
        .pipe(gulp.dest('build/public/images'));

    gulp.src('public/index.html')
        .pipe(gulp.dest('build/public'));
});

gulp.task("build", ["sassify", "moveStatics"], function () {
    //var jsFilter = filter("**/*.js", { restore: true });
    //var cssFilter = filter("**/*.css", { restore: true });

    //console.log('%s', useref.assets);
    //var userefAssets = useref.assets();

    gulp.src('public/style/styles.css')
        .pipe(gulp.dest('build/public/style'));

    gulp.src('public/scripts/**/*.js')
        .pipe(babel({presets: ['es2015', 'react']}))
        .pipe(gulp.dest('build/public/scripts'));

    //return gulp.src("public/index.html")
        //.pipe(userefAssets)
        //.pipe(useref())
        //.pipe(jsFilter)
        //.pipe(babel({presets: ['es2015', 'react']}))
        //.pipe(jsFilter.restore)
        //.pipe(cssFilter)
        //.pipe(csso())
        //.pipe(cssFilter.restore)
        //.pipe(userefAssets.restore())
        //.pipe(useref())
        //.pipe(gulp.dest('build/public'));
});