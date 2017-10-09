//返回

import Store from "./notebook/index.store.js";
let View = require("./notebook/index.view.js");
//动作方法
function mapDispatchToProps(dispatch) {
	return {
		deleteRow: (_this) => dispatch({
			type: 'deleteRow',
			event: _this
		}),
		searchWords: (word) => dispatch({
			type: 'searchWords',
			event: word
		})
	}
}
let componentName = "index/notebook/index"; //组件名，不能重复,建议使用路径
const connectComponent = reactApp.connect(mapDispatchToProps, View, Store, componentName);
export default connectComponent;