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
  ScrollView,ListView,WebView,
  TouchableOpacity,NativeModules,TextInput
} from 'react-native';

//import ImagePicker from 'react-native-image-crop-picker';
import { SwipeListView,SwipeRow } from 'react-native-swipe-list-view';
import styles from "../list/index.css.js";


export function header(navigation) {
   const {
      navigate
    } = navigation;
  return {
    title: '单词本'
  }
};


//视图组件
class ComponentView extends Component {
    webview: WebView
  playSound(url){
    this.webview.postMessage(JSON.stringify({command:'playMp3',url:url}));
  }
  render() {
    const {
      state,
      playMovie,
      openPickerVideo,
      deleteRow,
      searchWords
    } = this.props;
    const {
      navigate
    } = this.props.navigation;
    ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={{"flex": 1}}>
       <View style={styles.WebView}>
             <WebView   
             ref={w => this.webview = w}
             source={require('../index/index.html')} 
             scalesPageToFit={true}/>
          </View>
      <SwipeListView
             enableEmptySections={true}
            dataSource={ds.cloneWithRows(state.wordsList)}
            renderRow={ data => (
           <View  style={styles.lists} >   
           <TouchableOpacity key={data.id} activeOpacity={1} style={styles.MovieList} onPress={()=> searchWords({word:data.word,key:data.id})}>
                <View>
                  <Text tyle={styles.MovieListText} >{data.word}</Text>
                </View>
              </TouchableOpacity>
                <View  style={[{ display: state.showSearchWords==data.id?'flex':'none'} ]}>
                            <View style={styles.Means}>
                            <Text style={styles.English}><Text onPress={()=> this.playSound(state.searchWordInfo.ph_en_mp3)} >[英][{state.searchWordInfo.ph_en}]</Text>       <Text onPress={()=> this.playSound(state.searchWordInfo.ph_am_mp3)}>[美][{state.searchWordInfo.ph_am}]</Text>     </Text>
                            </View>{
                          state.searchWordInfo.parts.map(function(index, elem) {
                            return <View key={elem} style={styles.Means}><Text >{index.part} {index.means}</Text></View>;
                          })}
                           <Text style={styles.Means} onPress={()=> navigate('IndexIndexIndex', {
                            movieUrl: data.movieUrl,
                            title:data.movieName,
                            startTime:data.startTime,
                            wordStart:data.wordStart
                          })} >查看原文</Text>
                </View>
               </View> 
            )}
            renderHiddenRow={ (data, secId, rowId, rowMap) => (
              <View style={styles.rowBack}>
                <TouchableOpacity style={styles.backRightBtn} onPress={ _ => deleteRow(data.id) }>
                  <Text style={styles.backTextWhite}>删除</Text>
                </TouchableOpacity>
              </View>
            )}
            rightOpenValue={-50}/>
 
      </View>
    )
  }
}


export default ComponentView;