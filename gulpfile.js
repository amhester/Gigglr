var gulp = require('gulp');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var clean = require('gulp-clean');

gulp.task("clean", [], function () {
    return gulp.src('build', { read: false }).pipe(clean());
});

gulp.task("sassify", [], function () {
    gulp.src('**/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('public/style'));
});

gulp.task("moveStatics", ["clean"], function () {
    gulp.src('public/images/*')
        .pipe(gulp.dest('build/public/images'));
});

gulp.task("build", ["sassify", "moveStatics"], function () {
    var jsFilter = filter("**/*.js", { restore: true });
    var cssFilter = filter("**/*.css", { restore: true });

    var userefAssets = useref.assets();

    return gulp.src("public/index.html")
        .pipe(userefAssets)
        .pipe(jsFilter)
        .pipe(babel({presets: ['es2015', 'react']}))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(csso())
        .pipe(cssFilter.restore)
        .pipe(userefAssets.restore())
        .pipe(useref())
        .pipe(gulp.dest('build/public'));
});