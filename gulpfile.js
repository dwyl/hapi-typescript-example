var gulp = require('gulp')
require('gulp-help')(gulp)
var tslint = require('gulp-tslint')
var mocha = require('gulp-mocha')
var istanbul = require('gulp-istanbul')
var rimraf = require('gulp-rimraf')
var sourcemaps = require('gulp-sourcemaps')
var ts = require('gulp-typescript')
var nodemon = require('gulp-nodemon')

var tsconfig = require('./tsconfig')
var sourceFiles = 'src/**/*.ts'
var testFiles = 'test/**/*.ts'
var srcOption = { base: './' }
var tsProject = ts.createProject('tsconfig.json', {
  typescript: require('typescript')
})
var outDir = tsconfig.compilerOptions.outDir
var tsFiles = [sourceFiles, testFiles]

gulp.task('clean', 'Clean build folder.', function () {
  return gulp.src(outDir, { read: false })
    .pipe(rimraf())
})

gulp.task('build', 'Build Ts files.', ['clean'], function () {
  var tsResult = gulp.src(tsFiles, srcOption)
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject))

  return tsResult.js
    .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../..' }))
    .pipe(gulp.dest(outDir))
})

gulp.task('tslint', 'Lints all TypeScript source files.', function () {
  return gulp.src(tsFiles)
    .pipe(tslint())
    .pipe(tslint.report('verbose'))
})

gulp.task('nodemon', 'Run nodemon', ['build'], function () {
  nodemon({
    script: './build/src/app.js',
    'legacy-watch': true,
    watch: [sourceFiles],
    env: { 'NODE_ENV': 'dev' }
  }).on('restart', ['build'])
})

gulp.task('test', ['build'], function (cb) {
  gulp.src(['build/src/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(['build/test/**/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports(
          {
            dir: './reports/test-coverage',
            reporters: ['html']
          }
        ))
        .on('end', cb)
    })
})

gulp.task('default', 'Default task.', ['nodemon'])
