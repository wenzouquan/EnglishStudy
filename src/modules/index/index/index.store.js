let initialState = {
  state: {
    count: 0,
    movieUrl: '/Volumes/UNTITLED/www/EnglishStudyApp/oceans2.mp4',
    showChineseStatus: 'none',
    showSearchWords: 'none',
    searchWordInfo: {
      parts: []
    },
    wordsStart:-1,
    wordsJson:{},//字幕
    curWords:{},
    engWord: 'ideo continues to play when',
    chineseWord: '需要给用户提供视觉反馈'
  },

  loadStart: function(_this) {
    console.log("loadStart");
  },
  setTime: function(_this) {
    var data = _this.event;
   // console.log(data.currentTime,this.state.curWords.end_time_int);
    if(data.currentTime>this.state.curWords.end_time_int){
      this.setWords();
    }
    //console.log(data);
  },
  setWords:function(){
    this.state.wordsStart++;
    this.state.curWords = this.state.wordsJson[this.state.wordsStart];
    this.state.curWords.wordsStart=this.state.wordsStart;
    this.state.engWord=this.state.curWords.english;
    this.state.chineseWord=this.state.curWords.chinese;
    this.state.showChineseStatus = 'none';
    this.state.showSearchWords = 'none';
    // reactApp.stores.IndexIndexIndex.setState({
    //       showChineseStatus: 'none',
    //       showSearchWords:'none'
    // });
  },

  setDuration: function() {

  },
  onEnd: function() {
    console.log("onEnd");
  },
  videoError: function(e) {
    console.log(e);
  },
  screenTouch: function(_this) {

  },

  playSound: function(_this) {
    let mp3Url = _this.event;
    if (mp3Url) {
      //声音播放
      const Sound = require('react-native-sound');
      const s = new Sound(mp3Url, Sound.MAIN_BUNDLE, (e) => {
        if (e) {
          console.log('error', e);
        }
        s.play();
      });
    }
  },
  setVideo:function(_this){
     this.state.video = _this.event;
  },
  showChinese: function(_this) {  
   // console.log(_this);
   if(this.state.showChineseStatus=="none"){
      this.state.showChineseStatus = this.state.showChineseStatus == 'none' ? 'flex' : 'none';
      this.state.video.methods.togglePlayPause(); 
   }else{
       this.state.video.player.ref.seek(Number(this.state.curWords.start_time_int));
       this.wordsStart = this.state.curWords.wordsStart;
       this.state.video.methods.togglePlayPause();
       //this.state.stop=1;
   }
    //console.log(this._root)
  },
  searchWords: function(obj) {
    this.state.showSearchWords = 'flex';
    this.state.searchWordInfo.word = obj.event;
    let url = 'http://dict-co.iciba.com/api/dictionary.php?w=' + obj.event + '&key=2EAB7B39653B2440C7A53B2FE19F4C52&type=json';
    let _this = this;
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        let data = responseJson['symbols'][0];
        if (data['parts'] && data.parts.length > 0) {
          for (var k in data['parts']) {
            var one = data['parts'][k];
            data['parts'][k]['part'] = one['part'];
            data['parts'][k]['means'] = one['means'].join("；");
          }
        } else {
          data['parts'] = [];
        }

        data.word = obj.event;
        reactApp.stores.IndexIndexIndex.setState({
          searchWordInfo: data
        });
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });

  },



  init: function() { //store,实例化会执行一次
    console.log(this.state);
    if (this.state.params && this.state.params.movieUrl) {
      this.state.movieUrl = this.state.params.movieUrl;
      var url = "./1.json";
      this.state.wordsJson= require(url);
      this.setWords();
      //console.log(12);
      console.log(this.state.wordsJson);
    }
  }
};
export default new reactApp.reducer(initialState);