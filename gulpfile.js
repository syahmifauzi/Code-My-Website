var gulp          = require('gulp'),
    shell         = require('gulp-shell'),
    jade          = require('gulp-jade'),
    sass          = require('gulp-sass'),
    // uncss        = require('gulp-uncss'),
    // glob         = require('glob'),
    minifyCss     = require('gulp-minify-css'),
    autoprefixer  = require('gulp-autoprefixer'),
    browserSync   = require('browser-sync').create(),
    // JS
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    plumber       = require('gulp-plumber'),

    sitemap       = require('gulp-sitemap');
    // submitSitemap = require('submit-sitemap').submitSitemap,
    // sitemapUrl    = "http://www.syahmifauzi.com/sitemap.xml";


// // Variables for SASS task // THINK LATER.. HMM..
// var unCssIgnores = ['.active-nav', '.nav-up-hide', '.is-open'];

gulp.task('default', ['browserSync', 'watch']);


gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  browserSync.reload();
});


// Task for building blog when something changed:
gulp.task('jekyll-build', shell.task(['jekyll build']));


// Task for serving blog with BrowserSync..
gulp.task('browserSync', ['sitemap'], function() {
  browserSync.init({
    server: {
      baseDir: '_site/'
    }
  });
});


// Creating Sitemap -> must build jekyll first
gulp.task('sitemap', ['jekyll-build'], function() {
  gulp.src('_site/**/*.html')
    .pipe(sitemap({siteUrl: 'http://www.syahmifauzi.com'}))
    .pipe(gulp.dest('./'));
});
// Submitting Sitemap {{ MANUALLY RUN IN CONSOLE }}
gulp.task('submit', function() {
  submitSitemap(sitemapUrl, function(err) { console.error(err); });
});


// Jade.. SASS.. JS.. Images.. Fonts..
// ------------------------------------------------------
gulp.task('jade', function() {
  return gulp.src('_jadefiles/**/*.jade')
    .pipe(jade({ pretty: true }))
      // Run errorHandler if have error
      .on('error', errorHandler)
    .pipe(gulp.dest('_includes'));
});

gulp.task('sass', function() {
  return gulp.src('assets/css/**/*.scss')
    .pipe(sass({
      includePaths: 'css',
      outputStyle: 'compressed',
      onError: browserSync.notify
    }))
      // Run errorHandler if have error
      .on('error', errorHandler)
    .pipe(autoprefixer({
      browser: ['last 2 versions', '> i%', 'not ie <= 8'],
      cascade: true
    }))
    // .pipe(uncss({
    //   html: glob.sync("_site/**/*.html"),
    //   ignores: unCssIgnores
    // })) THINK LATER.. HMM..
    .pipe(minifyCss({keepBreaks:false}))
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('js', function() {
  return gulp.src(['assets/js/**/*.js', '!assets/js/main.min.js', '!assets/js/jquery-1.12.0.min.js'])
    .pipe(plumber())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('_site/assets/js'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest('assets/js'));
});

gulp.task('images', function() {
  return gulp.src('assets/images/**/*')
    .pipe(gulp.dest('_site/assets/images'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('fonts', function() {
  return gulp.src('assets/fonts/**/*')
    .pipe(gulp.dest('_site/assets/fonts'))
    .pipe(browserSync.reload({ stream: true }));
});
// ------------------------------------------------------


gulp.task('watch', ['jade', 'sass', 'js', 'images', 'fonts'], function() {
  gulp.watch(['*.html', '_includes/**/*.html', '_layouts/*.html', '_posts/*.*', 'blog/*.html', 'projects/*.html', '_project-arabic/*.*'], ['jekyll-rebuild']);
  gulp.watch('assets/css/**/*.scss', ['sass']);
  gulp.watch('_jadefiles/**/*.jade', ['jade']);
  gulp.watch('assets/js/**/*.js', ['js']);
  gulp.watch('assets/images/**/*', ['images']);
  gulp.watch('assets/fonts/**/*', ['fonts']);
});


// Prevent gulp watch from break..
// ------------------------------------------------------
function errorHandler(error) {
    // Logs out error in the command line
  console.log(error.toString());
    // Ends the current pipe, so Gulp watch doesn't break
  this.emit('end');
}
// ------------------------------------------------------
