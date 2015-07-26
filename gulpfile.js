var gulp = require('gulp')
var standard = require('gulp-standard')

gulp.task('standard', function() {
  return gulp.src(['./ripsaw.js', './test/*.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: false
    }))
})

gulp.task('watch', function() {
  gulp.watch(['./ripsaw.js', './test/*.js'], ['standard'])
})

gulp.task('default', ['standard'])
