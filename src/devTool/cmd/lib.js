var fs = require('fs');
var ejs = require('ejs');
var path = require('path');
var cmdLib = {
	renderTo: function(src, data, out) { //生成文件
		//var path = rootPath + '/src/devTool/ejs/main.ejs';
		var source = fs.readFileSync(src, 'utf8');
		source = ejs.render(source, data);
		var replaceStr1 = "{%";
		var replaceStr2 = "%}";
		source = source.replace(new RegExp(replaceStr1, 'gm'), '<%');
		source = source.replace(new RegExp(replaceStr2, 'gm'), '%>');
		fs.writeFile(out, source);
	},
	ucfirst: (str) => { //首字母大写 "index/a" => "IndexA"
		if (typeof(str) !== "string") {
			return "";
		}
		var strs = str.split("/");
		var res = "";
		for (var i in strs) {
			str = strs[i];
			//var str = str.toLowerCase();
			str = str.replace(/\b\w+\b/g, function(word) {
				return word.substring(0, 1).toUpperCase() + word.substring(1);
			});
			res += str;
		}
		return res;
	},
	mkdirs: function(dirpath, callback) {
		var mode = '0777';
		var _this = this;
		fs.exists(dirpath, function(exists) {
			if (exists) {
				callback(dirpath);
			} else {
				//尝试创建父目录，然后再创建当前目录
				_this.mkdirs(path.dirname(dirpath), function() {
					fs.mkdir(dirpath, mode, callback);
				});
			}
		});
	}

}

module.exports = cmdLib