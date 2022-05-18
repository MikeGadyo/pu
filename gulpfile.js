// СТРУКТУРА ПРОЕКТА:
// Исходники : "./app/" :
/*
	- "./app/pug/" - папка pug файлов блоков и страниц
	- "./app/scss/" - папка scss файлов
	- "./app/fonts/" - папка fonts файлов проекта
	- "./app/img/" - папка неоптимизированных изображений
	- "./app/scripts/" - папка скриптов
*/
// Продакшен: "./dist/"
/*	
  - "./dist/" - корень сайта с html и папками
	- "./dist/fonts/" - папка шрифтов файлов проекта
	- "./dist/css/" - папка с минифицированными стилями
	- "./dist/scripts/" - папка минифицированных скриптов
	- "./dist/img/" - папка оптимизированных изображений
*/

import pkg from 'gulp'
const { gulp, src, dest, parallel, series, watch: gulpWatch } = pkg

import browserSync from 'browser-sync'
import bssi from 'browsersync-ssi'
import pug from 'gulp-pug'
import webpackStream from 'webpack-stream'
import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import sassglob from 'gulp-sass-glob'
const sass = gulpSass(dartSass)
import postCss from 'gulp-postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin'
import changed from 'gulp-changed'
import concat from 'gulp-concat'
import del from 'del'

const pathCurrent = process.cwd();
const pathModx = `${pathCurrent}.local/`;
const pathModxTemplate = `${pathModx}assets/template/`;


function browsersync() {
  browserSync.init({
    server: {
      baseDir: './dist/',
      middleware: bssi({ baseDir: './dist/', ext: '.html' })
    },
    ghostMode: false,
    notify: false,
    online: true,
    tunnel: 'mikegadyo', // Attempt to use the URL https://yousutename.loca.lt
  })
}

function buildPug() {
  return src(['app/pug/*.pug', "!app/pug/layout.pug", "!app/pug/variables.pug"])
    // .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest('./dist/'))
    .pipe(dest(pathModxTemplate))
    .pipe(browserSync.stream())
}

function css() {
  return src(['app/scss/**/main.scss'])
    .pipe(sassglob())
    .pipe(sass({
      'include css': true,
      outputStyle: 'expanded'
    }))
    .pipe(postCss([
      autoprefixer({
        grid: 'autoplace',
        overrideBrowserslist: ['last 3 versions'],
        cascade: false
      }),
    ]))
    .pipe(dest('./dist/css/'))
    .pipe(dest(`${pathModxTemplate}css/`))
    .pipe(postCss([
      cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
    ]))
    .pipe(concat('main.min.css'))
    .pipe(dest('./dist/css/'))
    .pipe(dest(`${pathModxTemplate}css/`))
    .pipe(browserSync.stream())
}

function scripts() {
  return src(['app/scripts/*.js'])
    .pipe(webpackStream({
      mode: 'production',
      performance: { hints: false },
      // plugins: [
      //   new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' }), // jQuery (npm i jquery)
      // ],
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['babel-plugin-root-import']
              }
            }
          }
        ]
      },
      optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: { format: { comments: false } },
            extractComments: false
          })
        ]
      },
    }, webpack)).on('error', (err) => {
      this.emit('end')
    })
    .pipe(concat('main.min.js'))
    .pipe(dest('./dist/scripts/'))
    .pipe(dest(`${pathModxTemplate}scripts/`))
    .pipe(browserSync.stream())
}

function img() {
  return src(['app/img/**/*'])
    .pipe(changed('./dist/img/'))
    .pipe(imagemin([
      gifsicle({ interlaced: true }),
      mozjpeg({
				progressive: true,
        quality: 80
			}),
      optipng(),
      svgo({
        plugins: [
          {
            name: 'removeViewBox',
            active: true
          },
          {
            name: 'cleanupIDs',
            active: false
          }
        ]
      })
		], {
			verbose: true
		}))
    .pipe(dest('./dist/img/'))
    .pipe(dest(`${pathModxTemplate}img/`))
    .pipe(browserSync.stream())
}

function fonts() {
  return src(['app/fonts/**/*'])
    .pipe(dest('./dist/fonts/'))
    .pipe(dest(`${pathModxTemplate}fonts/`))
    .pipe(browserSync.stream())
}

async function cleandist() {
  del('./dist/**/*', { force: true })
}

function startwatch() {
  gulpWatch(['./app/pug/**/*.pug'], { usePolling: true }, buildPug)
  gulpWatch(['./app/scss/**/*.scss'], { usePolling: true }, css)
  gulpWatch(['./app/scripts/**/*.js'], { usePolling: true }, scripts)
  gulpWatch(['./app/img/**/*'], { usePolling: true }, img)
  gulpWatch(['./app/fonts/**/*'], { usePolling: true }, fonts)
  gulpWatch(['./dist/**/*.*'], { usePolling: true }).on('change', browserSync.reload)
}

const build = series(cleandist, parallel(img, scripts, buildPug, css, fonts))
const watch = series(parallel(img, scripts, buildPug, css, fonts), parallel(browsersync, startwatch))


export { build, watch }
export default watch;



