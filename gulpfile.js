var gulp = require('gulp')
var standard = require('gulp-standard')

gulp.task('standard', function() {
  return gulp.src(['./index.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: false
    }))
})

gulp.task('watch', function() {
  gulp.watch('./index.js', ['standard'])
})

gulp.task('default', ['standard'])
