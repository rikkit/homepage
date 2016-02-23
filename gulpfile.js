/// <binding Clean='clean' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    less = require("gulp-less");

var paths = {
	source: "./",
	min: "./min/",
	out: "./out/",
	bootstrap: "./bower_components/bootstrap/dist/css/bootstrap.css"
};

paths.js = paths.source + "res/js/**/*.js";
paths.minJs = paths.min + "res/js/**/*.min.js";
paths.css = paths.min + "res/css/**/*.css";
paths.cssDir = paths.min + "res/css/";
paths.minCss = paths.minCssDir + "**/*.min.css";
paths.concatJsDest = paths.out + "js.js";
paths.concatCssDest = paths.out + "style.css";

// Build LESS from /Styles folder, copy to CSS folder
paths.less = paths.source + "res/css/**/*.less";
paths.lessDest = paths.min + "res/css/";

gulp.task("clean:min", function (cb) {
	rimraf(paths.min, cb);
});

gulp.task("clean:out", function (cb) {
	rimraf(paths.out, cb);
});

gulp.task("clean", ["clean:min", "clean:out"]);

gulp.task("copy:bootstrap", function () {
	 gulp
	 	.src(paths.bootstrap)
	 	.pipe(gulp.dest(paths.cssDir));
});

gulp.task("min:js", function () {
    return gulp
    	.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp
    	.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("less", function() {
    return gulp
    	.src(paths.less)
        .pipe(less({
            paths: [ /* TODO array of paths to use for @import directives */]
        }))
        .pipe(gulp.dest(paths.lessDest));
});

gulp.task("watch", function() {
    gulp.watch(paths.less, ['less']);
});

gulp.task(
    "build",
    [
        "min:js",
        "copy:bootstrap",
        "less", /* Build LESS first so it's also minified */
        "min:css"
    ]
);
