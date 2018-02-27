var gulp = require('gulp');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var sourcemaps = require("gulp-sourcemaps"); /* ソースマップを出力させる場合 */

gulp.task('babel', function () {
  return gulp.src('./src/entry.js')
      .pipe(plumber())
      .pipe(sourcemaps.init()) /* ソースマップを出力させる場合 */
      .pipe(babel())
      .pipe(sourcemaps.write(".")) /* ソースマップを出力させる場合 */
      .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch(src, ['babel']);
});

gulp.task('default', ['babel']);