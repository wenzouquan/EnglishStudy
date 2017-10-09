let initialState = {
  state: {
    wordsList: [],
    searchWordInfo: {
      parts: []
    },

  },
  setWordsList:function(){
    var Db = reactApp.getDb();
     Db.setTableName("notebook").success((data)=>{
        reactApp.stores.IndexNotebookIndex.setState({
          wordsList: data
        });
     }).order("id desc").select();
  },
  deleteRow:function(_this){
    var id =_this.event;
    var Db = reactApp.getDb();
    Db.setTableName("notebook").success((data)=>{
       this.setWordsList();
     }).where({id:id}).delete();
  },
  searchWords: function(obj) {
    if(this.state.showSearchWords==obj.event.key){
      this.state.showSearchWords=-1;
    }else{
      this.state.showSearchWords = obj.event.key;
      var word = obj.event.word;
      let _this = this;
      reactApp.tools.searchWords(word,function(data){
           data.word = word;
          reactApp.stores.IndexNotebookIndex.setState({
            searchWordInfo: data
          });
      });
    }
  },

  init: function() { //store,实例化会执行一次
    //console.log(this.state);
    this.setWordsList();
  }
};
export default new reactApp.reducer(initialState);