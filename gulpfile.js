import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import rename from 'gulp-rename';

import concat from 'gulp-concat';
import posthtml from 'gulp-posthtml';
import include from 'posthtml-include';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del';
import browser from 'browser-sync';

// Styles

export const styles = () => {
  return gulp.src('source/scss/style.scss', {
      sourcemaps: true
    })
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('docs/css', {
      sourcemaps: '.'
    }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(posthtml([include()]))
    .pipe(gulp.dest('docs'));
}

// Scripts

const scripts = () => {
  return gulp.src(['source/js/modules/*.js', '!source/**/_*.*'], {
      sourcemaps: true,
    })

    .pipe(concat('main.js'))
    .pipe(gulp.dest('docs/js', {
      sourcemaps: '.',
    }))
    .pipe(browser.stream());
}

const scriptsVendor = () => {
  return gulp.src(['source/js/vendor/*.js', '!source/**/_*.*'], {
      sourcemaps: true,
    })

    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('docs/js', {
      sourcemaps: '.',
    }))
    .pipe(browser.stream());
}

// Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(squoosh())
    .pipe(gulp.dest('docs/img'))
}
// WebP

const createWebp = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(squoosh({
      encodeOptions: {
        webp: {},
      },
    }))
    .pipe(gulp.dest('docs/img'))
}

// SVG

const svg = () => {
  return gulp.src(['source/img/*.svg', '!source/img/icons/*.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('docs/img'));
}

export const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(svgo())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('docs/img'));
}

// Copy

const copy = (done) => {
  gulp.src([
      'source/fonts/*.{woff2,woff}',
      'source/*.ico',
    ], {
      base: 'source'
    })
    .pipe(gulp.dest('docs'))
  done();
}

// copyImages

const copyImages = (done) => {
  gulp.src([
      "source/img/**",
    ], {
      base: 'source'
    })
    .pipe(gulp.dest('docs'))
  done();
}

// Clean

const clean = () => {
  return del('docs');
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'docs'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/scss/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/modules/*.js', gulp.series(scripts));
  gulp.watch('source/js/vendor/*.js', gulp.series(scriptsVendor));
  gulp.watch('source/**/*.html', gulp.series(html, reload));
  gulp.watch('source/img/**/*.{jpg,png}', gulp.series(optimizeImages, createWebp, reload));
  gulp.watch('source/img/**/*.svg', gulp.series(svg, reload));
  gulp.watch(['source/img/icons/*.svg', '!source/**/_*.*'], gulp.series(sprite, reload));
}

// docs

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    scriptsVendor,
    svg,
    sprite,
    createWebp
  ),
);

// Default


export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    scriptsVendor,
    svg,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));
