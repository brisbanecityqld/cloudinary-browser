var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var useref = require('gulp-useref');
var gulpRename = require('gulp-rename');
var cacheBuster = require('gulp-cache-bust');
var connect = require('gulp-connect');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var lazypipe = require('lazypipe');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var templateCache = require('gulp-angular-templatecache');
var del = require('del');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var filter = require('gulp-filter');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var fs = require('fs');

// compressTasks is a sub process used by useRef (below) that
// compresses (takes out white space etc) the javascript and
// css files
var compressTasks = lazypipe()
    .pipe(sourcemaps.init, { loadMaps: true })
    .pipe(function() {
      return gulpif('*.js', ngAnnotate());
    })
    .pipe(function() {
      return gulpif('*.js', uglify());
    })
    .pipe(function() {
      return gulpif('*.css', autoprefixer());
    })
    .pipe(function() {
      return gulpif('*.css', cssnano({
        zindex: false
      }));
    });


/**
 * Helper func to fetch main module name regarding first  app.js file
 * then regarding the ng-app attributes
 * @return {String} main module name
 */
var guessMainModuleName = function () {

  var res,
      htmlContent,
      appContent;

  appContent = fs.readFileSync('./app/app.js', { encoding: 'utf-8' });

  res = appContent.match(/angular\.module\(["']([a-z0-9\-_]+)['"]/i);

  if (res) {
    return res[1];
  }

  htmlContent = fs.readFileSync(
      fs.exists('./app/index-async.html') ? './app/index-async.html' : './app/index.html',
      { encoding: 'utf-8' }
  );

  res = htmlContent.match(/ng-app=\"([a-z0-9\-_]+)\"/i);

  if (res) {
    return res[1];
  }

  return "myApp";
};



// remove old dist dir
gulp.task('cleanup-dist', [], function() {
  return del([
    'dist',
    // we don't want to clean this file though so we negate the pattern
    '!dist/mobile/deploy.json'
  ]);
});

// copy all assets in dist
gulp.task('cleanup', ['cleanup-dist'], function() {
  return gulp.src('./app/**/*.*').pipe(gulp.dest('dist'));
});

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templateCache', ['cleanup'], function() {
  return gulp
      .src('app/**/templates/*.html')
      .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
      .pipe(templateCache({
        module: guessMainModuleName(),
        standalone: false
      }))
      .pipe(gulp.dest('app/cache'));
});


gulp.task("useref", ['templateCache'], function() {

  var jsFilter = filter("**/*.js", { restore: true });
  var cssFilter = filter("**/*.css", { restore: true });
  var angularTemplateFilter = filter('app/**/templates/*.html', { restore: true });
  var indexHtmlFilter = filter(['**/*', '!**/index.html'], { restore: true });

  function relativeIfMap(filename) {
    if (filename.indexOf('.map') > -1) {
      // console.log(filename);
      return filename.replace('js/', '').replace('css/', '');
    }
    return filename;
  }

  return gulp.src("app/index.html")
      .pipe(sourcemaps.init())
      .pipe(useref({
            collapseWhitespace: true,
            removeComments: true
          },
          lazypipe().pipe(compressTasks)
      ))
      .pipe(gulpif('app/index.html', htmlmin()))
      .pipe(sourcemaps.write('.'))
      .pipe(indexHtmlFilter)
      .pipe(rev()) // Rename the concatenated files (but not index.html)
      .pipe(indexHtmlFilter.restore)
      .pipe(revReplace({
        modifyUnreved: relativeIfMap,
        modifyReved: relativeIfMap
      })) // Substitute in new filenames
      .pipe(gulp.dest('dist'));
});

gulp.task('serve', function() {
  connect.server({
    root: 'app',
    livereload: true
  })
});

gulp.task("default", ['useref'], function () {

  return gulp
      .src('./dist/index.html')
      .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
      .pipe(gulp.dest('dist'));

});
