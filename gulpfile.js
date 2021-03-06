const gulp = require('gulp');
const sass = require('gulp-sass');
const newer = require('gulp-newer');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const csso = require('gulp-csso');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const minifyHTML = require('gulp-htmlnano');
const environments = require('gulp-environments');
const removeEmptyLines = require('gulp-remove-empty-lines');
// const browserify = require('browserify');
const postHTML = require('gulp-posthtml');
const babelify = require('babelify'); //eslint-disable-line
// const source = require('vinyl-source-stream');
// const buffer = require('vinyl-buffer');
const htmlv = require('gulp-html-validator');
const ts = require('gulp-typescript');


// DEFINE ENVIRONMENTS

const { development, production } = environments;

// const babelOptions = {
//   presets: [
//     [
//       'env',
//       {
//         targets: {
//           browsers: ['last 2 versions'],
//         },
//       },
//     ],
//   ],
// };

// FUNCTIONS

function styles() {
  return gulp
    .src(['./src/**/main*.scss'])
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(rename({
      suffix: '.min',
      dirname: '',
    }))
    .pipe(production(csso({ restructure: false })))
    .pipe(development(csso({
      restructure: false,
      sourceMap: true,
      debug: true,
    })))
    .pipe(gulp.dest('./build/css'));
}

const path = 'src';

const options = {};
const plugins = [require('posthtml-include')({ root: `${path}` })]; // eslint-disable-line

function html() {
  gulp
    .src(['src/*.html'])
    .pipe(plumber())
    .pipe(postHTML(plugins, options))
    .pipe(minifyHTML())
    .pipe(gulp.dest('build'));

  return gulp
    .src(['src/pages/**/*.html'])
    .pipe(plumber())
    .pipe(postHTML(plugins, options))
    .pipe(minifyHTML())
    .pipe(gulp.dest('build/pages'));
}

function validateHTML() { //eslint-disable-line
  return gulp
    .src(['src/*.html'])
    .pipe(plumber())
    .pipe(rename({ extname: '.html' }))
    .pipe(removeEmptyLines())
    .pipe(htmlv({ format: 'html' }))
    .pipe(gulp.dest('build'));
}


// function createJavaScripBundle(sourceFolder, sourceFileName, dest) {
// return browserify({
//   debug: true,
//   entries: [`${sourceFolder}/${sourceFileName}`],
// })
//   .plugin(tsify, { stopOnError: false })
//   .transform('babelify', babelOptions)
//   .bundle()
//   .on('error', (error) => { console.error(error.toString()); })
//   .pipe(source(sourceFileName))
//   .pipe(buffer())
//   .pipe(plumber())
// .pipe(rename({ suffix: '.min', extname: '.js' }))
// .pipe(production(uglify()))
// .pipe(gulp.dest(dest));
// }


function javaScript() {
  // return createJavaScripBundle('src', 'main.ts', 'build/js');
//   // return createJavaScripBundle('src/pages/cctv', 'main.cctv.js', 'build/js');
  const tsProject = ts.createProject('tsconfig.json');

  return gulp.src(['src/*.ts', 'src/pages/cctv/*.ts'])
    .pipe(tsProject())
    .on('error', () => {})
    .js
    .pipe(rename({ suffix: '.min', extname: '.js' }))
    .pipe(production(uglify()))
    .pipe(gulp.dest('build/js'));
}


function cleanBuild() {
  return gulp.src(['build'], { read: false, allowEmpty: true }).pipe(clean({ force: true }));
}


function serve() {
  browserSync.init({
    server: 'build',
  });
  browserSync.watch('build/*.*').on('change', browserSync.reload);
}

function assets() {
  return gulp
    .src(['src/assets/**'])
    .pipe(plumber())
    .pipe(newer('build/assets'))
    .pipe(imagemin())
    .pipe(gulp.dest('build/assets'));
}

function move() {
  gulp.src(['src/blocks/_helpers/text.js'])
    .pipe(gulp.dest('build/js'));

  gulp.src(['src/blocks/VideoPlayer/lib/hls.js'])
    .pipe(gulp.dest('build/pages/cctv/'));

  return gulp.src(['src/data/events.json'])
    .pipe(gulp.dest('build/data'));
}

function watch() {
  gulp.watch('src/**/*.scss', styles).on('change', browserSync.reload);
  gulp.watch('src/assets/*.*', assets).on('change', browserSync.reload);
  gulp.watch('src/**/*.ts', javaScript).on('change', browserSync.reload);
  gulp.watch('src/**/*.html', html).on('change', browserSync.reload);
}


const build = production()
  ? gulp.series(cleanBuild, gulp.parallel(styles, move, html, assets, javaScript))
  : gulp.series(
    cleanBuild,
    gulp.parallel(styles, html, assets, javaScript, move),
    gulp.parallel(watch, serve),
  );


const taskValidateHTML = gulp.series(
  cleanBuild,
  gulp.parallel(html, assets),
  gulp.parallel(watch, serve),
);

// TASKS

gulp.task('build', build);
gulp.task('clean', cleanBuild);
gulp.task('validateHTML', taskValidateHTML);
