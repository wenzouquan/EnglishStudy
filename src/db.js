import React from 'react';
import SQLiteStorage from 'react-native-sqlite-storage';

SQLiteStorage.DEBUG(true);
var database_name = "xifan.db";
var database_version = "1.0";
var database_displayname = "MySQLite";
var database_size = -1;


class SQLite {
    constructor(config = {}) {
        this.db = null ;
        this.tableName= 'Collection';
        this.option={};
        this.open();
        this.successfun=[];
    }
    open(){
         this.db = SQLiteStorage.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
            ()=>{
                this._successCB('open');
            },
            (err)=>{
                this._errorCB('open',err);
            });

    }

    createTable(){
        if (!this.db) {
            this.open();
        }
        //创建收藏表
        this.db.transaction((tx)=> {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tableName + '(' +
                'id INTEGER PRIMARY KEY NOT NULL,' +
                'name VARCHAR,' +
                'actor VARCHAR,' +
                'time VARCHAR,' +
                'pic VARCHAR,' +
                'url VARCHAR,' +
                'title VARCHAR'
                + ');'
                , [], ()=> {
                    this._successCB('executeSql');
                }, (err)=> {
                    this._errorCB('executeSql', err);
                });
        }, (err)=> {
            this._errorCB('transaction', err);
        }, ()=> {
            this._successCB('transaction');
        })
    }


    add(data){
        var columns=Array();
        var values=Array();
        for(var k in data){
             columns.push(k);
             if(typeof(data[k])=="string"){
                 values.push("'"+data[k]+"'");
             }else{
                 values.push(data[k]);
             }        
        }
       var sql = "INSERT INTO "+this.tableName+" ("+ columns.join(",")+") VALUES ("+values.join(",")+" )";
       this.executeSql(sql);
        
    }

    executeSql(sql){
        if(this.db){
            this.db.executeSql(sql,[],
                (datas)=>{
                    var successfuns =  this.successfun;
                    this.successfun=[];
                    var len2 = successfuns.length;
                    for(let i=0;i<len2;i++){
                        successfuns[i](datas);
                    };
                },(err)=>{
                      console.log("delete err",err);
                });
        }else{
            console.log('db not open');
        }
        this.option={};
    }


    where(conditions={}){
        var where=" where 1";
        for(var k in conditions){
             if(typeof(conditions[k])=="string"){
                var v = "'"+conditions[k]+"'";
             }else{
                var v = conditions[k];
             }
            where+= " and "+k+"="+v;
        }
        this.option.where=where;
        return this;
    }

    order(orderBy=""){
        this.option.order=orderBy?" order by "+orderBy:"";
         return this;
    }
    
    success(fun){
        this.successfun.push(fun);
        return this;
     }

    delete(){
        var where = this.option.where?this.option.where:'';
        var sql = "DELETE FROM "+this.tableName + where;
        this.executeSql(sql);
    }

    select(){
         if(this.db){
            var where = this.option.where?this.option.where:'';
            var orderBy =  this.option.order?this.option.order:"";
            var sql = "SELECT * FROM "+this.tableName + where + orderBy;
            //console.log(this.db);
            this.db.executeSql(sql,[],(results)=>{
                var successfuns = this.successfun;
                this.successfun=[];
                var len = results.rows.length;
                var datas = [];
                for(let i=0;i<len;i++){
                    datas.push(results.rows.item(i));
                }
                var len2 = successfuns.length;
               // console.log(this.successfun);
                for(let i=0;i<len2;i++){
                    successfuns[i](datas);
                };
            },(err)=>{
                console.log("select err",err);
            });
        }else{
            console.log('db not open');
        }
        this.option={};
        return this;
    }

   

    close(){
        if(this.db){
            this._successCB('close');
            db.close();
        }else {
            console.log("SQLiteStorage not open");
        }
        db = null;
    }

    _successCB(name){
        console.log("SQLiteStorage "+name+" success");
    }

    _errorCB(name, err){
        console.log("SQLiteStorage "+name+" error:"+err);
    }
}
// const SQLite = React.createClass({

//     render(){
//         return null;
//     },
//     componentWillUnmount(){
//         if(db){
//             this._successCB('close');
//             db.close();
//         }else {
//             console.log("SQLiteStorage not open");
//         }
//     },
    
// });

module.exports = SQLite;