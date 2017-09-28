/*gulp makeEntry  里生成main.js，main的模板在devTool里*/
import {
	StackNavigator
} from 'react-navigation';
//主入口组件
var entry = reactApp.params.entry;
var navigates = {};
navigates[entry] = {};
  
navigates['IndexIndexIndex'] = {
	screen: require("./modules/index/indexIndex.js").default
};
  
navigates['IndexListIndex'] = {
	screen: require("./modules/index/listIndex.js").default
};

const app = StackNavigator(navigates);
export default app;