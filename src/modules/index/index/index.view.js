//导入React
import React, {
  Component
} from 'react';

//视频组件
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
//视图组件
import {
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  ImagePickerIOS,
  InteractionManager,
  Image,
  WebView
} from 'react-native';

import styles from "./index.css.js";
export function header(navigation) {
  return {
    title: (navigation.state && navigation.state.params && navigation.state.params.title) ? navigation.state.params.title : '视频列表'
  }
};



//视图组件
class ComponentView extends Component {
  // pickImage() {
  //   console.log(ImagePickerIOS);
  //   ImagePickerIOS.canRecordVideos(() => alert('能获取视频'));
  // }
  render() {
    const {
      state,
      loadStart,
      searchWords,
      playSound,
      setVideo
    } = this.props;
    const {
      navigate
    } = this.props.navigation;
    //console.log(state.movieUrl);
    return (
      <View style={styles.contains}>
          <View style={styles.VideoBox}>
            <VideoPlayer
             ref={setVideo}
          //  source = {require(state.movieUrl)}
            //source = {require('/Volumes/UNTITLED/www/EnglishStudy/oceans2.mp4')}
            controlTimeout={ 1500 }  
             seekColor={ '#FFF' } 
            source={{uri: state.movieUrl,mainVer:1,patchVer:0 }}
            //source={{uri: state.movieUrl,type:'mp4',isAsset:true,isNetwork:false}} // 视频的URL地址，或者本地地址，都可以. 
             rate={1.0}                   // 控制暂停/播放，0 代表暂停paused, 1代表播放normal. 
             volume={1.0}                 // 声音的放大倍数，0 代表没有声音，就是静音muted, 1 代表正常音量 normal，更大的数字表示放大的倍数 
             muted={false}                // true代表静音，默认为false. 
             paused={false}               // true代表暂停，默认为false 
             resizeMode="cover"           // 视频的自适应伸缩铺放行为，
             repeat={false}                // 是否重复播放 
             playInBackground={false}     // 当app转到后台运行的时候，播放是否暂停
             playWhenInactive={false}     // [iOS] Video continues to play when control or notification center are shown. 仅适用于IOS
             onLoadStart={()=>loadStart(this)} // 当视频开始加载时的回调函数
             onLoad={this.props.setDuration}    // 当视频加载完毕时的回调函数
             onProgress={this.props.setTime}    //  进度控制，每250ms调用一次，以获取视频播放的进度
             onEnd={this.props.onEnd}           // 当视频播放完毕后的回调函数
             onError={this.props.videoError}    // 当视频不能加载，或出错后的回调函数
             onScreenTouch={()=>this.props.screenTouch(VideoPlayer)}
             style={styles.VideoBoxContent} />
             </View>
            <View style={styles.VideoTextBox}>
              <TouchableOpacity activeOpacity={1} onPress={()=> this.props.showChinese(this)} style={styles.VideoTextBoxItem}>
                <Text>
                {state.engWord.split(' ').map(function(index, elem) {
                    return index && <Text onPress={()=> searchWords(index)}  style={styles.English}>{index} </Text>
                })}
                </Text>
                <View  style={[{ display: state.showChineseStatus} ]}><Text>{state.chineseWord}</Text></View>
                <View  style={[{ display: state.showSearchWords} ]}>
                    <View style={styles.Word}>
                    <Text style={styles.English}>{state.searchWordInfo.word}      <Text onPress={()=> playSound(state.searchWordInfo.ph_en_mp3)} >[英][{state.searchWordInfo.ph_en}]</Text>       <Text onPress={()=> playSound(state.searchWordInfo.ph_am_mp3)}>[美][{state.searchWordInfo.ph_am}]</Text>      <Text>[加入单词本]</Text></Text>
                    </View>{
                  state.searchWordInfo.parts.map(function(index, elem) {
                    return <View style={styles.Means}><Text>{index.part} {index.means}</Text></View>;
                  })
                }</View>
             </TouchableOpacity>
          </View>
      </View>
    )
  }
}


export default ComponentView;