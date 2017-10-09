import {
NativeModules,CameraRoll
} from 'react-native';

//import ImagePicker from 'react-native-image-crop-picker';
var ImagePicker2 = require('react-native-image-picker');


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

  getVideos:function(){
    var fetchParams = {
      first: 6,
      groupTypes: 'All',
      assetType: 'Videos'
    }
    var promise = CameraRoll.getPhotos(fetchParams)
          promise.then(function(data){
            console.log(data);
                var edges = data.edges;
                var photos = [];
                for (var i in edges) {
                    var filename = edges[i].node.image.filename.split(".");
                    photos.push({
                      url:edges[i].node.image.uri,
                      name:filename[0],
                    });
                }
                reactApp.stores.IndexListIndex.setState({
                  movieList: photos
                });
          },function(err){
          alert('获取照片失败！');
    });
  },
  init:function(){
     var Db = reactApp.getDb();
     Db.createTable();
     //this.setMovieList();
     this.getVideos();
  },

  setMovieList:function(){
    var Db = reactApp.getDb();
     Db.setTableName("Collection").success((data)=>{
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
      
  },
  hideModal:function(){
    reactApp.stores.IndexListIndex.setState({
          isModal:false
      });
  },
  saveVideo:function(){
    if(this.state.chooseVideo.name && this.state.chooseVideo.name !=""){
      var Db = reactApp.getDb();
      Db.success((data)=>{
         this.setMovieList();
         this.hideModal();
      }).add({name:this.state.chooseVideo.name,url:this.state.chooseVideo.path});
    }else{
      alert('请输入视频名称');
    }
    
  },
  setVideoName:function(_this){
    this.state.chooseVideo.name = _this.event.text;
  },
  setVideoUrl:function(_this){
       var path =_this.event;
       this.state.chooseVideo.path = path;   
       this.state.chooseVideo.name = "怦然心动"; 
       this.saveVideo();   
  },

  deleteRow:function(_this){
    var id =_this.event;
    var Db = reactApp.getDb();
    Db.setTableName("Collection").success((data)=>{
       this.setMovieList();
     }).where({id:id}).delete();
  },
  openPickerVideo:function(){
    //ImagePickerIOS.canRecordVideos(() => alert('能获取视频'))
    
    //ImagePickerIOS.canUseCamera(() => alert('能获取图片'))
     // openSelectDialog(config, successCallback, errorCallback);
    // ImagePickerIOS.openSelectDialog({ 
    //   showImages: true,
    //   showVideos: true
    //  }, (data) => {
    //   console.log(data);
    //   //this.setState({ image: imageUri });
    // }, error => console.log(error));
    //this.showModal();
    //var path =e.event;
    //this.state.chooseVideo.path = path;
    //this.state.chooseVideo.isModal = true;
    //console.log(e.event);
    //alert(url);
   var options = {
     title: 'Select Avatar',
      // customButtons: [
      //   {name: 'fb', title: 'Choose Photo from Facebook'},
      // ],
      takePhotoButtonTitle:null,
      noData:true,
      mediaType:'video',
      videoQuality:'high',
      ompressVideo:false,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker2.showImagePicker(options, (response) => {
        this.state.chooseVideo.path = response.origURL;
        this.showModal();
        // console.log('Response = ', response);
    });

    // ImagePicker.openPicker({
    // //  mediaType: "video",
    // compressVideoPreset:false,
    //   compressVideo:false
    //  // width: 300,
    //  // height: 400
    // }).then(images => {
    //   console.log(images);
    //   // var path = images.path;
    //   // reactApp.stores.IndexListIndex.setState({
    //   //     chooseVideo:images
    //   // });
    //   // this.showModal();
    // }).catch((error) => {
    //     console.log(error);
    //   });
  }


};
export default new reactApp.reducer(initialState);