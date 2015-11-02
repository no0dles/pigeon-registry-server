var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('serve', function () {
    nodemon({ script: 'index.js', ext: 'js', env: { 'NODE_ENV': 'development' } })
        .on('restart', null);
});

gulp.task('default', ['serve']);