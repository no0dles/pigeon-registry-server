var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var push = require('git-push');
var sequence = require('run-sequence');

require('gulp-release-tasks')(gulp);

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

gulp.task('deploy', function(cb){
  push('./', {
    name: 'openshift',
    url: 'ssh://56438a240c1e6629bb000047@registry-nodepigeon.rhcloud.com/~/git/registry.git/',
    branch: 'master'}, function () {
    console.log('done');
    cb()
  })
});

gulp.task('release-patch', function (done) {
  sequence('tag', 'deploy', done);
});

gulp.task('release-minor', function (done) {
  sequence('tag --minor', 'deploy', done);
});

gulp.task('default', ['serve']);