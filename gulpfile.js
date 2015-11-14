var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var push = require('git-push');
var sequence = require('run-sequence');

require('gulp-release-tasks')(gulp);

gulp.task('serve', function () {
  var opts = {
    script: 'index.js',
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    }
  };

  nodemon(opts).on('restart', []);
});

gulp.task('test', function () {
  return gulp.src('test/*.js', {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('deploy', function(done){
  var opts = {
    name: 'openshift',
    url: 'ssh://56438a240c1e6629bb000047@registry-nodepigeon.rhcloud.com/~/git/registry.git/',
    branch: 'master'
  };

  push('./', opts, done);
});

gulp.task('release', function (done) {
  sequence('test', 'tag', 'deploy', done);
});

gulp.task('default', ['serve']);