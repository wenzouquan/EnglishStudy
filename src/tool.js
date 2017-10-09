
class tools {
	
	//查单词
	searchWords(word,suc) {
	word = word.replace(/[^a-z]/ig,"").toLowerCase();
	reactApp.getStorage().get(word+"-searchWords",(ret)=>{
        suc?suc(ret):'';
     },()=>{
     	let url = 'http://dict-co.iciba.com/api/dictionary.php?w=' + word + '&key=2EAB7B39653B2440C7A53B2FE19F4C52&type=json';
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
	        data.word=word;
	        suc?suc(data):'';
	        reactApp.getStorage().save({
	            key: word+"-searchWords",   
	            data: data,
	            expires: null
	         });
	      })
	      .catch((error) => {
	        console.log(error);
	      });
     })  	
  }
}

module.exports = tools;