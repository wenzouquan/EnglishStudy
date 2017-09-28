var glob = require('glob');
var path = require('path');
var cmdLib = require('./lib.js');
var rootPath = path.resolve(path.resolve(path.resolve(__dirname, '..'), ".."), "..");

var components = "";

//寻找modules下的组件
var components = [];
var name, file, replaceStr1, replaceStr2;
var files = glob.sync(rootPath + '/src/modules/*/*.js');
var files2 = glob.sync(rootPath + '/src/modules/*.js');
files = files.concat(files2);
for (var i in files) {
  file = files[i];
  replaceStr1 = rootPath + '/src/modules/';
  replaceStr2 = '.js';
  name = file.replace(new RegExp(replaceStr1, 'gm'), '');
  name = name.replace(new RegExp(replaceStr2, 'gm'), '');
  components.push({
    name: cmdLib.ucfirst(name),
    path: "./modules/" + name + ".js"
  });
}

var renderData = {
  components: components
};
cmdLib.renderTo(rootPath + '/src/devTool/ejs/main.ejs', renderData, rootPath + '/src/main.js');