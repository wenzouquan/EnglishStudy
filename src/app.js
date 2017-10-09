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
	View,AsyncStorage
} from 'react-native';
import SQLite from './db.js';
import tools from './tool.js';
//console.log(data);
import Storage from 'react-native-storage';




// load
// storage.load({
// 	key: 'loginState2',
	
// 	// autoSync(default true) means if data not found or expired,
// 	// then invoke the corresponding sync method
// 	autoSync: true,
	
// 	// syncInBackground(default true) means if data expired,
// 	// return the outdated data first while invoke the sync method.
// 	// It can be set to false to always return data provided by sync method when expired.(Of course it's slower)
// 	syncInBackground: true,
	
// 	// you can pass extra params to sync method
// 	// see sync example below for example
// 	syncParams: {
// 	  extraFetchOptions: {
// 	    // blahblah
// 	  },
// 	  someFlag: true,
// 	},
// }).then(ret => {
// 	// found data go to then()
// 	console.log(ret);
// }).catch(err => {
// 	// any exception including data not found 
// 	// goes to catch()
// 	console.warn(err.message);
// 	switch (err.name) {
// 	    case 'NotFoundError':
// 	        // TODO;
// 	        break;
//         case 'ExpiredError':
//             // TODO
//             break;
// 	}
// })



class App {
	constructor(config = {}) {
		this.stores = {}; //所有store
		this.components = {}; //所有路由模块
		this.tools=new tools();
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
	getStorage(){
		if(!this.storage){
			var storage = new Storage({
				// maximum capacity, default 1000 
				size: 1000,

				// Use AsyncStorage for RN, or window.localStorage for web.
				// If not set, data would be lost after reload.
				storageBackend: AsyncStorage,
				
				// expire time, default 1 day(1000 * 3600 * 24 milliseconds).
				// can be null, which means never expire.
				defaultExpires: 1000 * 3600 * 24,
				
				// cache data in the memory. default is true.
				enableCache: true,
				
				// if data was not found in storage or expired,
				// the corresponding sync method will be invoked and return 
				// the latest data.
				sync : {
					// we'll talk about the details later.
				}
			});
			 this.storage = storage;
		}
		this.storage.get=(key,suc,fail)=>{
				this.storage.load({
				     key: key,
				      
				     // autoSync(default true) means if data not found or expired,
				     // then invoke the corresponding sync method
				     autoSync: true,
				      
				     // syncInBackground(default true) means if data expired,
				     // return the outdated data first while invoke the sync method.
				     // It can be set to false to always return data provided by sync method when expired.(Of course it's slower)
				     syncInBackground: true,
				      
				     // you can pass extra params to sync method
				     // see sync example below for example
				     syncParams: {
				       extraFetchOptions: {
				         // blahblah
				       },
				       someFlag: true,
				     },
				    }).then(ret => {
				    suc?suc(ret):'';
				    
				    }).catch(err => {
				    fail?fail(err):'';
				})
		}
		return this.storage;
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