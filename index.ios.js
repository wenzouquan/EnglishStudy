/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import Config from "./src/config"; //配置
import App from './src/app'; //导入app
global.reactApp = new App(Config); //实例化
reactApp.run(); //开心地跑起来啦！