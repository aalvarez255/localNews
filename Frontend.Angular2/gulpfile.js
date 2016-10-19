var gulp = require('gulp'),
    del = require('del'),
    rename = require('gulp-rename'),
    traceur = require('gulp-traceur'), 
    sass = require('gulp-sass'),
    webserver = require('gulp-webserver');

var config = {
  sourceDir: 'src',
  buildDir: 'build',
  npmDir: 'node_modules',
  bowerDir: 'bower_components'
};


//clean task build directory
gulp.task('clean', function() {
  return del(config.buildDir + '/**/*', {force: true});
});

// run init tasks
gulp.task('default', ['dependencies', 'js', 'html', 'css']);

// run development task
gulp.task('dev', ['watch', 'serve']);

// serve the build dir
gulp.task('serve', function () {
  gulp.src(config.buildDir)
    .pipe(webserver({
      open: true
    }));
});

// watch for changes and run the relevant task
gulp.task('watch', function () {
  gulp.watch(config.sourceDir + '/**/*.js', ['js']);
  gulp.watch(config.sourceDir + '/**/*.html', ['html']);
  gulp.watch(config.sourceDir + '/**/*.css', ['css']);
});

gulp.task('frontend', [
  'dependencies',
  'js',
  'html',
  'css',
  'sass'
]);


gulp.task('sass', function () {
  return gulp.src(config.sourceDir + '/**/*.scss')
    .pipe(sass({
      style: 'compressed',
      includePaths: [
        config.sourceDir + '/styles',
        config.bowerDir + '/bootstrap-sass/assets/stylesheets'
      ]
    }))
    .pipe(gulp.dest(config.buildDir));
});

// move dependencies into build dir
gulp.task('dependencies', function () {
  return gulp.src([
    config.npmDir + '/traceur/bin/traceur-runtime.js',
    config.npmDir + '/systemjs/dist/system-csp-production.src.js',
    config.npmDir + '/systemjs/dist/system.js',
    config.npmDir + '/reflect-metadata/Reflect.js',
    config.npmDir + '/angular2/bundles/angular2.js',
    config.npmDir + '/angular2/bundles/angular2-polyfills.js',
    config.npmDir + '/rxjs/bundles/Rx.js',
    config.npmDir + '/es6-shim/es6-shim.min.js',
    config.npmDir + '/es6-shim/es6-shim.map',
    config.bowerDir + '/jquery/dist/jquery.min.js',
    config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.min.js'
  ])
    .pipe(gulp.dest(config.buildDir + '/lib'));
});

// transpile & move js
gulp.task('js', function () {
  return gulp.src('src/**/*.js')
    .pipe(rename({
      extname: ''
    }))
    .pipe(traceur({
      modules: 'instantiate',
      moduleName: true,
      annotations: true,
      types: true,
      memberVariables: true
    }))
    .pipe(rename({
      extname: '.js'
    }))
    .pipe(gulp.dest(config.buildDir));
});

// move html
gulp.task('html', function () {
  return gulp.src(config.sourceDir + '/**/*.html')
    .pipe(gulp.dest(config.buildDir))
});

// move css
gulp.task('css', function () {
  return gulp.src(config.sourceDir + '/**/*.css')
    .pipe(gulp.dest(config.buildDir))
});
