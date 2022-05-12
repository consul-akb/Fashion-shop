var sass = require('gulp-sass')(require('sass'));
const gulp = require('gulp');
//const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const sourceMaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const pngquant =require('imagemin-pngquant');
const run = require('run-sequence');
const del = require("del");
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

gulp.task('sass', function () {
    return gulp.src('scss/style.scss')
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 version']
        }))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('html', function () {
    return gulp.src('*.html')
        .pipe(gulp.dest('build'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function () {
    return gulp.src('js/**/*.js')
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('css', function () {
    return gulp.src('css/**/*.css')
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('allimg', function () {
    return gulp.src('img/**/*.{png,jpg}')
        .pipe(gulp.dest('build/img'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('images', function () {
    return gulp.src('build/img/**/*.{png,jpg}')
        .pipe(gulp.dest('build/img'));
});

gulp.task('svg', function () {
    return gulp.src('img/**/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest('build/img'));
});

gulp.task('serve', function () {
    browserSync.init({
        server: "build"
    });

    gulp.watch("scss/**/*.scss", gulp.parallel("sass"));
    gulp.watch("*.html", gulp.parallel("html"));
    gulp.watch("js/**/*.js", gulp.parallel("js"));
    gulp.watch("css/**/*.css", gulp.parallel("css"));
    gulp.watch("img/**/*.{png,jpg}", gulp.parallel("allimg"));
    gulp.watch("img/**/*.svg", gulp.parallel("svg"));
});

gulp.task('copy', function () {
    return gulp.src([
        'img/**',
        'js/**',
        'css/**',
        '*.html'
    ], {
        base: '.'
    })
        .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
    return del('build');
});

