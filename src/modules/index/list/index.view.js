//导入React
import React, {
  Component
} from 'react';
 
//视图组件
import {
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  Button,Modal,
  ListView,
  TouchableOpacity,NativeModules,TextInput,WebView
} from 'react-native';

//import ImagePicker from 'react-native-image-crop-picker';
import { SwipeListView,SwipeRow } from 'react-native-swipe-list-view';
import styles from "./index.css.js";
import codePush from 'react-native-code-push';
//import SplashScreen from 'react-native-splash-screen';
export function header(navigation) {
   const {
      navigate
    } = navigation;
  return {
    title: '视频列表',
    headerRight: <Button title="单词本"  onPress={()=> navigate('IndexNotebookIndex')} />,
  }
};




//视图组件
class ComponentView extends Component {
 componentDidMount() {
        codePush.sync();
        //SplashScreen.hide();
  } 
  webview: WebView
  render() {
    //console.log(this.props);
    const {
      state,
      playMovie,
      openPickerVideo,
      setVideoUrl,
      deleteRow,
      onRequestClose,
      setVideoName,
      saveVideo
    } = this.props;
    const {
      navigate
    } = this.props.navigation;
    ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={{"flex": 1}}>
      <SwipeListView
            enableEmptySections={true}
            dataSource={ds.cloneWithRows(state.movieList)}
            renderRow={ data => (
            <TouchableOpacity activeOpacity={1} onPress={()=> navigate('IndexIndexIndex', {
            movieUrl: data.url,
            title:data.name,
          })}  style={styles.MovieList} >
                <View>
                  <Text style={styles.MovieListText} >{data.name}</Text>
                </View>
                </TouchableOpacity>
            )}
            renderHiddenRow={ (data, secId, rowId, rowMap) => (
              <View style={styles.rowBack}>
                <TouchableOpacity style={styles.backRightBtn} onPress={ _ => deleteRow(data.id) }>
                  <Text style={styles.backTextWhite}>删除</Text>
                </TouchableOpacity>
              </View>
            )}
            rightOpenValue={-50}/>
            <Modal style={{"flex": 1}}
                animationType='fade'            // 淡入淡出
                transparent={true}              // 透明
                visible={state.isModal}    // 根据isModal决定是否显示
                onRequestClose={() => {onRequestClose()}}>
                <View style={styles.modalViewStyle}>
                    <View style={styles.hudViewStyle}>
                       <TextInput
                          style={{height: 40}}
                          placeholder="输入视频名称"
                          onChangeText={(text) => setVideoName({text})}/>
                         <Button  title="保存视频" onPress={()=> saveVideo()}/>
                    </View>
                </View>
            </Modal>
      </View>
    )
  }
}


export default ComponentView;