import React, {
	Component
} from 'react';
import {
	createStore,
} from 'redux'
import {
	connect,
	Provider
} from 'react-redux'

import {
	AppRegistry,
	StyleSheet,
	Text,
	View
} from 'react-native';
import SQLite from './db.js';
// var jsonUrl = "./data/1.json";
// console.log(jsonUrl);
// fetch(jsonUrl)
//   .then((response) => response.json())
//   .then((responseJson) => {
//     console.log(responseJson);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// fetch(jsonUrl)
//       .then((response) => response.json())
//       .then((responseJson) => {
//         console.log(responseJson.movies) ;
//       })
//       .catch((error) => {
//         console.error(error);
//       });

class App {
	constructor(config = {}) {
		this.stores = {}; //所有store
		this.components = {}; //所有路由模块
		this.params = {
			versions: '6.7',
			userVersions: '2.4',
			debug: true
		};
		for (let key in config) {
			this.params[key] = config[key];
		}
	}
	getDb(){
		if(this.db){
			return this.db;
		}else{
			this.db  = new SQLite();
			return  this.db ;
		}
		
		
	}
	getStore(path, props, reducer) { //redux 的 store ，用于数据管理
		let storeName = this.ucfirst(path);
		let store;
		if (store = this.stores[storeName]) { //存在，且请求参数没有变化，返回store,参数发生变化需要重新实例化
			let newArg = JSON.stringify(props.navigation.state);
			let oldArg = JSON.stringify(store.getState().params);
			if (newArg == oldArg) {
				return store;
			}
		}

		// let reducer = require("./modules/" + path + ".store.js").default;
		reducer.props = props;
		reducer.getStore = () => {
			return store
		}
		store = createStore(reducer);
		store.call = (type, params = {}) => {
			params['type'] = type;
			return store.dispatch(params);
		}
		store.setState = (params = {}) => {
			params['type'] = 'setState';
			params['states'] = params;
			return store.dispatch(params);
		}

		store.watch = (listenKey, fn) => { //监听store里对象是否发生变化
			let currentValue = JSON.stringify(store.getState()[listenKey]);
			let unsubscribe = store.subscribe(function() {
				let previousValue = currentValue
				currentValue = JSON.stringify(store.getState()[listenKey]);
				if (currentValue != previousValue) {
					fn ? fn(currentValue, previousValue) : '';
				}
			})
			return unsubscribe;
		}
		this.stores[storeName] = store;
		//调用初始化函数
		store.call('init');
		// let initFn = reducer.init;
		// if (typeof(initFn) == 'function') {
		//     store.call('init');
		// }
		return store;
	}


	reducer(params = {}) { /*//store state 数据层*/

		params.setState = function(states) {
			for (let key in states) {
				this.state[key] = states[key];
			}
		}
		return function returnReducer(state = params['state'], action = {}) {
			//url 带过来的参数
			state['params'] = returnReducer.props.navigation.state.params;
			for (let key in params) {
				returnReducer[key] = params[key];
			}
			returnReducer.state = state;
			if (params[action['type']]) {
				params[action['type']].call(returnReducer, action);
			}
			return {
				...state
			};
		}

	}
	ucfirst(str) { //首字母大写 "index/a" => "IndexA"
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
		} //
	connect(mapDispatchToProps, View, reducer, componentName) {

		// mapDispatchToProps:方法  ,component 纯组件  ,reducer store ,storePath store文件路径   mapStateToProps
		let storeName = this.ucfirst(componentName);
		if (typeof(mapStateToProps) != "function") {
			mapStateToProps = (state) => {
				return {
					state: state
				}
			}
		}
		let component = View.default;
		let header = View.header;
		const C = connect(mapStateToProps, mapDispatchToProps)(component);
		const _this = this;
		//console.log(header);
		class newComponent extends Component {
			static navigationOptions = ({
				navigation
			}) => {
				return header(navigation)
			};
			shouldComponentUpdate(nextProps, nextState) {
				return false;
			}
			render() {
				// console.log(this.props);
				// //this.props.match.params = this.props.arg;
				var navigation = this.props.navigation;
				const store = _this.getStore(componentName, this.props, reducer);
				return (<Provider store={store}><C navigation={navigation}/></Provider>);

			}
		}
		return newComponent;
	}
	run() {
		let reactProject = require("./main").default; //导入所有的组件
		AppRegistry.registerComponent(this.params.projectName, () => reactProject);
	}

}
export default App;