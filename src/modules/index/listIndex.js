//返回
import Store from "./list/index.store.js";
let View = require("./list/index.view.js");
//动作方法
function mapDispatchToProps(dispatch) {
	return {
		playMovie: (_this) => dispatch({
			type: 'playMovie',
			event: _this
		}),
		openPickerVideo:()=>dispatch({
			type: 'openPickerVideo'
		}),
		deleteRow:(_this)=>dispatch({
			type: 'deleteRow',
			event: _this
		})
		

	}
}
let componentName = "index/list/index"; //组件名，不能重复,建议使用路径
const connectComponent = reactApp.connect(mapDispatchToProps, View, Store, componentName);
export default connectComponent;