var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var bump = require('gulp-bump');
var push = require('git-push');

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

gulp.task('bump-patch', function(){
  gulp.src(['./package.json'])
    .pipe(bump({type:'patch'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump-minor', function(){
  gulp.src(['./package.json'])
    .pipe(bump({type:'minor'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump-major', function(){
  gulp.src(['./package.json'])
    .pipe(bump({type:'major'}))
    .pipe(gulp.dest('./'));
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

gulp.task('release-patch', function () {

});

gulp.task('default', ['serve']);