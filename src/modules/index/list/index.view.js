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
  ScrollView,ListView,
  TouchableOpacity,NativeModules,TextInput
} from 'react-native';

//import ImagePicker from 'react-native-image-crop-picker';
import { SwipeListView,SwipeRow } from 'react-native-swipe-list-view';
import styles from "./index.css.js";


export function header(navigation) {
  return {
    title: '视频列表'
  }
};


//视图组件
class ComponentView extends Component {
  render() {
    console.log(this.props);
    const {
      state,
      playMovie,
      openPickerVideo,
      deleteRow,
    } = this.props;
    const {
      navigate
    } = this.props.navigation;
    ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={{"flex": 1}}>
      <SwipeListView
            dataSource={ds.cloneWithRows(state.movieList)}
            renderRow={ data => (
            <TouchableOpacity activeOpacity={1} onPress={()=> navigate('IndexIndexIndex', {
            movieUrl: data.url,
            title:data.name,
          })}  style={styles.MovieList} >
                <View>
                  <Text tyle={styles.MovieListText} >{data.name}</Text>
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

          <View style={styles.Button} >    
           <Button  title="添加视频" onPress={()=> openPickerVideo()}/>
          </View>
      </View>
    )
  }
}


export default ComponentView;