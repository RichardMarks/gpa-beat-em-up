const convertHyphenToCamelCase = text => {
  return text.replace(/-[a-z]/g, match => match[1].toUpperCase())
}

const loadGlobalModule = module => {
  global[convertHyphenToCamelCase(module.replace(/^gulp-/, ''))] = require(module)
}

require('matchdep').filterDev(['gulp*']).forEach(loadGlobalModule)

import { task, src, dest, watch } from 'gulp-es-next'
import rimraf from 'rimraf'
import del from 'del'
import path from 'path'
import webpack from 'webpack'
import webpackConfig from './webpack.config'
import WebpackDevServer from 'webpack-dev-server'
import packageJson from './package.json'

const log = util.log
const env = process.env.NODE_ENV
const PORT = process.env.PORT || 3000
const DIST_DIR = 'dist';
const DIST_INTERMEDIATE_DIR = 'dist-intermediate'
const GEN_DIR = `${DIST_INTERMEDIATE_DIR}/generated`
const BUILD_DIR = 'build'
const SRC_STATIC_DIR = 'public'
const INDEX_HTML = 'src/index.html'
const INDEX_JS_IN = '<!-- inject:app:js -->'
const INDEX_EXT = '<!-- inject:app:{{ext}} -->'
const INDEX_JS_OUT = '<script src="generated/main.js"></script>'

// copies static files from one directory to another
const copyStatic = (sourceDir, destDir) => {
  return src(sourceDir).pipe(changed(destDir)).pipe(dest(destDir)).pipe(size({title: 'static'}))
}

// injects payload into index at token position and writes to destDir
const injectIndex = (indexPath, injectToken, injectPayload, destDir) => {
  return src(indexPath).pipe(injectString.after(injectToken, injectPayload)).pipe(dest(destDir))
}

// fires up a development server
const devServer = (serveDir, config, port) => {
  let server = new WebpackDevServer(webpack(config), {
    contentBase: serveDir,
    publicPath: config.output.publicPath,
    watchOptions: {
      aggregateTimeout: 100
    }
  })

  return server.listen(port, '0.0.0.0', err => {
    if (err) {
      throw new PluginError('webpack-dev-server', err)
    }
    log(`[${packageJson.name} serve]`, `Listening at 0.0.0.0:${port}`)
  })
}


task('default', () => log('you want gulp serve, gulp dist, or gulp clean'))

// main tasks
task('serve', sequence('serve:clean', 'serve:index', 'serve:start'))
task('dist', sequence('dist:clean', 'dist:build', 'dist:index'))
task('clean', sequence('serve:clean', 'dist:clean'))

// sub-tasks for development
task('serve:clean', cb => rimraf(BUILD_DIR, cb))
task('serve:static', () => copyStatic([`${SRC_STATIC_DIR}/**`], BUILD_DIR))
task('serve:index', () => injectIndex(INDEX_HTML, INDEX_JS_IN, INDEX_JS_OUT, BUILD_DIR))
task('serve:start', ['serve:static'], () => devServer(BUILD_DIR, webpackConfig({ debug: true, outputPath: BUILD_DIR, port: PORT }), PORT))

// sub-tasks for distribution
task('dist:clean', cb => del([DIST_DIR, DIST_INTERMEDIATE_DIR], {dot: true}, cb))
task('dist:static', () => copyStatic([`${SRC_STATIC_DIR}/**`], DIST_DIR))
task('dist:index', () => {
  const app = src(["*.{css,js}"], {cwd: GEN_DIR}).pipe(dest(DIST_DIR))
  return src(INDEX_HTML)
    .pipe(inject(app, { ignorePath: DIST_DIR, starttag: INDEX_EXT }))
    .on("error", log).pipe(dest(DIST_DIR))
})
task('dist:build', ['dist:static'], cb => {
  const config = webpackConfig({ debug: false, outputPath: DIST_INTERMEDIATE_DIR })
  webpack(config, (err, stats) => {
    if (err) {
      throw new PluginError('dist', err)
    }
    log(`[${packageJson.name} dist]`, stats.toString({colors: true}))
    cb()
  })
})
