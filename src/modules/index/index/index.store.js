let initialState = {
  state: {
    count: 0,
    movieUrl: '/Volumes/UNTITLED/www/EnglishStudy/乱世佳人.mp4',
    showChineseStatus: 'none',
    showSearchWords: 'none',
    searchWordInfo: {
      parts: []
    },
    pageSize:3,//3条一页
    curPage:0,//当前页
    wordLists:[],
    wordsStart:-1,
    wordsJson:{},//字幕
    curWords:{},
    startTime:0,//开始播放时间
    hasDuration:0,
    autoOnSeek:0,
    stopTime:0,
    engWord: 'ideo continues to play when',
    chineseWord: '需要给用户提供视觉反馈'
  },

  loadStart: function(_this) {
   // console.log("loadStart");
  },

  setTime: function(_this) {
    var data = _this.event;
    // if(this.state.curWords.end_time_int && data.currentTime<this.state.curWords.start_time_int){
    //    console.log('后退了',data.currentTime,this.state.curWords.start_time_int);
    // }
    if(this.state.stopTime>0 && this.state.stopTime < data.currentTime){
      this.state.video.state.paused=true;
      this.state.stopTime=0;
    }
    if(this.state.curWords.end_time_int && data.currentTime>this.state.curWords.end_time_int && !this.state.video.state.paused){
      this.setWords();
    }
    

  },
  onSeek:function(_this){
   if(this.state.autoOnSeek==0){
      console.log(this.state.autoOnSeek,"onSeek",_this);
      var time = _this.event.currentTime;
      this.state.wordsStart=this.BinarySearch(this.state.wordsJson,time)-1;
     // console.log("this.state.wordsStart",this.state.wordsStart);
      //this.state.wordsStart =wordsStart;
      this.state.curPage=0;
      this.setWords();
   }
   this.state.autoOnSeek=0;
    
  },
  setWords:function(){
    this.state.wordsStart++;
    if( this.state.wordsJson && this.state.wordsJson[this.state.wordsStart]){
      this.setWordLists();
      this.state.curWords = this.state.wordsJson[this.state.wordsStart];
      this.state.curWords.wordsStart=this.state.wordsStart;
    }
    
    //this.savePlayTime();//保存播放时间
  },

  onScreenTouch:function(_this){
    alert(123123);
  },

  savePlayTime:function(){
      reactApp.getStorage().save({
            key: this.state.params.title+"-curWords",   
            data: this.state.curWords,
            expires: null
          });
  },

  BinarySearch:function(arr, target) {
    // let s = 0;
    // let e = arr.length - 1;
    // let m = Math.floor((s + e) / 2);
    // let sortTag = arr[s] <= arr[e];//确定排序顺序
    // while (s < e ) {
    //     if (arr[m] > target) {
    //         sortTag && (e = m - 1);
    //         !sortTag && (s = m + 1);
    //     } else {
    //         !sortTag && (e = m - 1);
    //         sortTag && (s = m + 1);
    //     }
    //     m = Math.floor((s + e) / 2);
        
    // }
    for(var m in arr){
      if(target <= arr[m]['start_time_int'] &&  arr[m]['end_time_int']>=target){
           break;
      }
    }
    return m;
},
  //回到上次播放时间
  setPlayTime:function(){
   if(!this.state.params.wordStart){
      reactApp.getStorage().get(this.state.params.title+"-curWords",(ret)=>{
         reactApp.stores.IndexIndexIndex.setState({
            startTime: ret.start_time_int,
            wordsStart:ret.wordsStart
         });
        })
   }
    // reactApp.getStorage().load({
    //  key: this.state.params.title+"-curWords",
      
    //  // autoSync(default true) means if data not found or expired,
    //  // then invoke the corresponding sync method
    //  autoSync: true,
      
    //  // syncInBackground(default true) means if data expired,
    //  // return the outdated data first while invoke the sync method.
    //  // It can be set to false to always return data provided by sync method when expired.(Of course it's slower)
    //  syncInBackground: true,
      
    //  // you can pass extra params to sync method
    //  // see sync example below for example
    //  syncParams: {
    //    extraFetchOptions: {
    //      // blahblah
    //    },
    //    someFlag: true,
    //  },
    // }).then(ret => {
    //  //  console.log(ret);
    //    // var data = {
    //    //    startTime:ret.start_time_int,
    //    //    wordsStart:ret.wordsStart
    //    // }
    //  //  this.state.startTime = ret.start_time_int;
    //   // this.state.wordsStart=ret.wordsStart;
    //    reactApp.stores.IndexIndexIndex.setState({
    //       startTime: ret.start_time_int,
    //       wordsStart:ret.wordsStart
    //    });
    //    // if(this.state.video){
    //    //   this.setDuration();
    //    // }

    // }).catch(err => {
    //  console.log(err.message);
    // })
  },


  setWordLists:function(){
     var page = parseInt(this.state.wordsStart/this.state.pageSize)+1;
     if(page > this.state.curPage ){
         this.jumpPage(page);
     }
  },

  jumpPage:function(page){
        var list =[];
        var start = this.state.pageSize*(page-1);
         for(var i =0; i<this.state.pageSize;i++){
            var rowData = this.state.wordsJson[start+i];
             if(rowData){
              rowData.key = start+i;
              list.push(rowData);
            }
         }
         this.state.curPage = page;
         this.state.wordLists = list;
  },

//已有video
  setDuration: function() {
    //console.log(this.state.hasDuration);
    
    if(Number(this.state.startTime)>0 && this.state.video && this.state.hasDuration==0){
      this.state.hasDuration=1;
      //console.log(this.state.hasDuration,Number(this.state.startTime),this.state.video);
      this.state.autoOnSeek=1;
      this.state.video.player.ref.seek(Number(this.state.startTime));
     }
  },

  onEnd: function() {
    //console.log("onEnd");
  },
  videoError: function(e) {
    //console.log(e);
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
         // console.log('error', e);
        }
        s.play();
      });
    }
  },
  setVideo:function(_this){
     this.state.video = _this.event;
  },
  showChinese: function(_this) {  
    if(this.state.stopTime>0){
       return ;
    }
   // console.log(_this);
   var key = _this.event;
   var curWords = this.state.wordsJson[key];
   this.state.video.state.paused=true;
   if(curWords){
       this.state.curWords=curWords;
       this.state.showChineseStatus = key;
       //this.state.video.methods.togglePlayPause();
       this.state.autoOnSeek=1;
       //console.log(Number(curWords.start_time_int));
       this.state.stopTime=0;
       this.state.video.player.ref.seek(Number(curWords.start_time_int)-0.5); 
       if(this.state.showSearchWords != key){
        this.state.showSearchWords=-1;
       }
       this.state.wordsStart = key;
       this.state.stopTime = Number(curWords.end_time_int);
     }
    this.state.video.state.paused=false;
   // if(this.state.showChineseStatus=="none"){
   //    this.state.showChineseStatus = this.state.showChineseStatus == 'none' ? 'flex' : 'none';
   //    this.state.video.methods.togglePlayPause(); 
   // }else{
   //     this.state.video.player.ref.seek(Number(this.state.curWords.start_time_int));
   //     this.wordsStart = this.state.curWords.wordsStart;
   //     this.state.video.methods.togglePlayPause();
   //     //this.state.stop=1;
   // }
    //console.log(this._root)
  },
  searchWords: function(obj) {
    this.state.video.state.paused=true;
    this.state.stopTime=0;
    this.state.showSearchWords = obj.event.key;
    var word = obj.event.word;
    reactApp.tools.searchWords(word,function(data){
        reactApp.stores.IndexIndexIndex.setState({
          searchWordInfo: data
        });
    });
  },
  
  getWordsJson:function(){
   reactApp.getStorage().get(this.state.params.title,(ret)=>this.loadCallback(ret),(err)=> this.loadFormGithub())

    // reactApp.getStorage().load({
    //  key: this.state.params.title,
      
    //  // autoSync(default true) means if data not found or expired,
    //  // then invoke the corresponding sync method
    //  autoSync: true,
      
    //  // syncInBackground(default true) means if data expired,
    //  // return the outdated data first while invoke the sync method.
    //  // It can be set to false to always return data provided by sync method when expired.(Of course it's slower)
    //  syncInBackground: true,
      
    //  // you can pass extra params to sync method
    //  // see sync example below for example
    //  syncParams: {
    //    extraFetchOptions: {
    //      // blahblah
    //    },
    //    someFlag: true,
    //  },
    // }).then(ret => {
    //  // found data go to then()
    //  //console.log(ret);
    //  this.loadCallback(ret);
    // }).catch(err => {
    //  // any exception including data not found 
    //  // goes to catch()
    // // console.log(err.message);
    //  this.loadFormGithub();
    //  switch (err.name) {
    //      case 'NotFoundError':
    //          // TODO;
    //          //this.loadFormGithub();
    //          break;
    //         case 'ExpiredError':
    //             // TODO
    //         break;
    //  }
    // })
  },

  loadCallback:function(responseJson,fun){
      reactApp.stores.IndexIndexIndex.setState({
              wordsJson: responseJson
           });
      reactApp.stores.IndexIndexIndex.call("setWords");
  },

  loadFormGithub:function(){
      var jsonUrl = "https://raw.githubusercontent.com/wenzouquan/EnglishStudy/master/src/data/"+this.state.params.title+".json";
    //  console.log(jsonUrl);
      fetch(jsonUrl)
        .then((response) => response.json())
        .then((responseJson) => {
          this.loadCallback(responseJson);
          //存到本地
          reactApp.getStorage().save({
            key: this.state.params.title,   // Note: Do not use underscore("_") in key!
            data: responseJson,
            expires: null
          });

          //this.setWords();
        })
        .catch((error) => {
          console.log(error);
          alert(jsonUrl+"找不到!");
      });
  },
  notebook:function(_this){
    var word = _this.event.word;
    console.log(_this.event);
    var db = reactApp.getDb();
    db.success(function(){
       alert('恭喜，收藏成功');
    }).setTableName("notebook").add({
      word:word,
      movieUrl:this.state.params.movieUrl,
      movieName:this.state.params.title,
      startTime:_this.event.curWords.start_time_int?_this.event.curWords.start_time_int:0,
      wordStart:_this.event.curWords.key
    });
   // console.log(word);
  },
  init: function() { //store,实例化会执行一次
    //console.log(this.state);
   
    if(this.state.params.wordStart){
       this.state.wordsStart=Number(this.state.params.wordStart)-1;
    }
     this.setPlayTime();
    if (this.state.params && this.state.params.movieUrl) {
      this.state.movieUrl = this.state.params.movieUrl;
      this.getWordsJson();
    }
    if(this.state.params.startTime){
      this.state.startTime = this.state.params.startTime;
     // console.log("params.startTime",this.state.startTime);
    }
    

  }
};
export default new reactApp.reducer(initialState);