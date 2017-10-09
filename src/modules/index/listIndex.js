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
			type: 'openPickerVideo',
		}),
		setVideoUrl:(msg)=>dispatch({
			type: 'setVideoUrl',
			event: msg
		}),
		deleteRow:(_this)=>dispatch({
			type: 'deleteRow',
			event: _this
		}),
		onRequestClose:()=>dispatch({
			type: 'onRequestClose'
		}),
		setVideoName:(_this)=>dispatch({
			type: 'setVideoName',
			event: _this
		}),
		saveVideo:()=>dispatch({
			type: 'saveVideo'
		}),
		showModal:()=>dispatch({
			type: 'showModal'
		}),
		
		
		

	}
}
let componentName = "index/list/index"; //组件名，不能重复,建议使用路径
const connectComponent = reactApp.connect(mapDispatchToProps, View, Store, componentName);
export default connectComponent;