var gulp = require('gulp');
var rename = require('gulp-rename');
var del = require('del');
var changed = require('gulp-changed');
var remember = require('gulp-remember');
const path = require('path');
//const sass = require('gulp-sass');
const reactNativeStylesheetCss = require('gulp-react-native-stylesheet-css');


// var webpack = require("gulp-webpack");

/**
 * 并非所有的任务都是基于流，例如删除文件
 * 一个 gulpfile 只是一个 Node 程序，在 gulpfile 中可以使用任何 npm 中的模块或者其他 Node.js 程序
 */
function clean() {
  // del 也可以和 `gulp.src` 一样可以基于模式匹配的文件路径定义方式 
  return del(["./dist/**"]);
}


/**
 * 监控文件，当文件改变过后做对应的任务
 * @return {[type]} [description]
 */
function watch() {
  //生成./src/main.js
  gulp.watch(["./src/modules/*/*.js"], gulp.series(gulp.task('makeEntry')));
  //把css 转成 react-native StyleSheet
  gulp.watch(["./src/modules/**/*.css"], gulp.series(cssToStyleSheet));

}



//生成入口main.js文件 ，载入组件
gulp.task('makeEntry', (done) => {
  require("./src/devTool/cmd/makeEntry.js");
  done();
});



//css to react-native style
function cssToStyleSheet() {
  return gulp.src('./src/modules/**/*.css')
    .pipe(changed('cssToStyleSheet')) //// 和 newer 类似，过滤出改变了的 css
    .pipe(remember('cssToStyleSheet')) //// 找出所有的 css
    //.pipe(sass())
    .pipe(reactNativeStylesheetCss())
    .pipe(rename(function(path) {
      var basename = path.basename.split(".")[0];
      path.basename = basename;
      path.extname = ".css.js";
      //console.log(path);
    }))
    .pipe(gulp.dest('./src/modules/'));
}

/*
 * 使用 CommonJS `exports` 模块的方式定义任务
 */
exports.clean = clean;
exports.watch = watch;
exports.cssToStyleSheet = cssToStyleSheet;

/*
 * 确定任务是以并行还是串行的方式定义任务 series 串行 parallel 并行
 */

var dev = gulp.parallel(gulp.series(clean, gulp.task('makeEntry')), cssToStyleSheet, watch);

/*
 * 定义默认任务，默认任务可以直接通过 gulp 的方式调用
 */
gulp.task('default', dev);