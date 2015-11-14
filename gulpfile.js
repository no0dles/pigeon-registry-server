var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');

gulp.task('serve', function () {
  nodemon({
    script: 'index.js',
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    }
  })
  .on('restart', []);
});

gulp.task('test', function () {
  return gulp.src('test/*.js', {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('default', ['serve']);