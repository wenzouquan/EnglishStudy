import {
NativeModules
} from 'react-native';
import SQLiteStorage from 'react-native-sqlite-storage';
SQLiteStorage.DEBUG(true);
let initialState = {
  state: {
    count: 0,
    movieList: [],
    isModal:false,
    chooseVideo:{}
  },
  playMovie: function(action) {
    console.log(action);
  },
  init:function(){
     this.setMovieList();
  },

  setMovieList:function(){
    var Db = reactApp.getDb();
     Db.success((data)=>{
        reactApp.stores.IndexListIndex.setState({
          movieList: data
        });
     }).order("id desc").select();
  },

  showModal:function() {
      reactApp.stores.IndexListIndex.setState({
           isModal:true
      })
  },
   onRequestClose:function() {
      reactApp.stores.IndexListIndex.setState({
          isModal:false
      });
  },
  setVideoName:function(_this){
    this.chooseVideo.name = _this.event;
  },
  deleteRow:function(_this){
    var id =_this.event;
    var Db = reactApp.getDb();
    Db.success((data)=>{
       this.setMovieList();
     }).where({id:id}).delete();
  },
  openPickerVideo:function(){
    var ImagePicker = NativeModules.ImageCropPicker;
    ImagePicker.openPicker({
      //mediaType: "video",
     // width: 300,
     // height: 400
    }).then(images => {
      var path = images.path;
      this.chooseVideo = images;
      var Db = reactApp.getDb();
      Db.success((data)=>{
         this.setMovieList();
      }).add({name:images.filename,url:images.path});
      //this.showModal();
    });
  }


};
export default new reactApp.reducer(initialState);