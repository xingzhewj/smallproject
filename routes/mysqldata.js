var http = require('http');
var mysql = require('mysql');
var TEST_DATABASE = 'food';
var TEST_TABLE = 'food';

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '123',
});
connection.query('USE ' + TEST_DATABASE);

//人员信息操作
this.stuendFoodOperate = {
	//插入数据
	insertData: function(dataArray,fun) {
		var query = connection.query(
			'INSERT INTO studentfood' +
			' SET id = ?,name= ?,ownmoney = ?,owemoney = ?,lovemenu = ?,lovefood = ?', [dataArray["id"], dataArray["name"], dataArray["ownmoney"], dataArray["owemoney"], dataArray["lovemenu"], dataArray["lovefood"]], function(err, results) {
				if (err) throw err;
				fun(results);
			});
	},

	//查询，并设置回调函数
	selectData: function(obj,fun) {
		connection.query(
			"SELECT * FROM studentfood where " + obj.key + " =?", [obj.value],
			function selectCb(err, results, fields) {
				if (err) {
					throw err;
				}
				fun(results);
			}
		);
	},

	//获取所有人员信息
	getStudentInfo:function(fun){
		connection.query("select * from studentfood ",function(err,results,fields){
			if(err) throw err;
			fun(results);
		});
	},

	//新增人员
	saveUser:function(obj,fun){
		connection.query("insert into studentfood set id=?,nameP=?,ownmoney=?",[obj.id,obj.nameP,obj.ownmoney],function(err,results){
			if(err) throw err;
			fun(results);
		});
	},

	//删除人员
	deleteUser:function(obj,fun){
		connection.query("delete from studentfood where id=?",[obj.id],function(err,results){
			if(err) throw err;
			fun({"msg":"success","id":obj.id,"nameP":obj.nameP});
		});
	},

	saveUserEdit:function(obj,fun){
		connection.query("update studentfood set nameP=?,owemoney=? where id =?",[obj.userNameP,obj.userOwemoney,obj.id],function(err,results){
			if (err) {throw err};
			fun(results);
		});
	},

	//获取吃饭人员信息
	getEatStudent : function(fun){
		connection.query("select * from studentfood",function(err,results){
			if(err) throw err;
			fun(results);
		});
	},

	//获取今日吃饭人员
	getTodayPeople : function(fun){
		connection.query("select * from studentfood where istoday=1",function(err,results){
			if(err) throw err;
			fun(results);
		});
	},
	//保存今日就就餐人
	saveTodayStudent : function(fun){
		connection.query("update studentfood set istoday = 0");
	},

	//删除数据
	deleteData: function(obj,fun) {
		connection.query("delete from studentfood where " + obj.key + " = ?", [obj.value], function(err, results) {
			if (err) throw err;
			if (results.affectedRows > 1) {
				fun("success");
			}
		})
	},

	//修改数据
	updateData: function(obj, dataArray,fun) {
		var query = connection.query("update studentfood set id = ?,nameP= ?,ownmoney = ?,owemoney = ?,lovemenu = ?,lovefood = ? where " + obj.key + " = ?", [dataArray.id, dataArray.nameP, dataArray.ownmoney, dataArray.owemoney, dataArray.lovemenu, dataArray.lovefood, obj.value],
			function(err, results) {
				if (err) throw err;
				if (results.affectedRows > 1) {
					fun(true);
				}
			})
	}
};

//操作菜单表
this.operateMenuName = (function(){
	function getMenuName(fun){
		var menuNames = null;
		var query = connection.query("select nameP,id from menufood",function(err,results,fields){
			if(err) throw err;
			fun(results);
		});
	}

	function insertMenu(obj,fun){
		var _id = Math.round(Math.random()*100000);
        obj.id = _id;
		var query = connection.query("insert into menufood set nameP=? , id = ?,foodId = ?",[obj.nameP,obj.id,obj.foodId],function(err,results){
			if(err) throw err;
			if(results.affectedRows){
				fun({success:true});
			}
		});
	}

	function getMenuInfo(obj,fun){
		var _id = obj.id;
		var query = connection.query("select * from food where menuid = ?",[_id],function(err,results){
			if(err) throw err;
			fun(results);
		})
	}

	return {
		insertMenu : insertMenu,
		getMenuName:getMenuName,
		getMenuInfo:getMenuInfo
	};
})();

this.operateFood = (function(){
	function getTodayFood(obj,fun){
		var query = connection.query("select * from food where istoday = ?",["1"],function(err,results){
			if (err) throw err;
			fun(results);
		});
	}

	function saveTodayStus(obj,fun){
		connection.query("update studentfood set istoday=0");
		var t = obj.selectData.split(",");
		var results = [];
		for (var i = 0; i < t.length; i++) {
			var query = connection.query("update studentfood set istoday = 1 where nameP =?",[t[i]],function(err,result){
				if(err) throw err;
				fun(result);
			});
		}
		
	}

	return{
		getTodayFood : getTodayFood,
		saveTodayStus : saveTodayStus
	}
})();

/*******************留言板模块**************************/
this.noteOperate = (function(){
	function noteLogin(obj,fun){
		var _name = obj.notename;
    	var _password = obj.notepassword;
		var query = connection.query("select nameP,password from studentfood where nameP=? and password=?",[_name,_password],function(err,result){
			if(err) throw err;
			fun(result);
		});
	}

	function submitnote(obj,fun){
		var _content = obj.content;
		var _title = obj.title;
		var query = connection.query("insert into note set username =?,content=?,title=?",['wangjie',_content,_title],function(err,result){
			if(err) throw err;
			var count = result.affectedRows;
			if(count){
				fun(true);
			}else{
				fun(false);
			}
		});
	}

	function getNodeData(obj,fun){
		var _name = obj.name;
		var query = connection.query("select * from note where username = ?",[_name],function(err,result){
			if(err) throw err;
			fun(result);
		});
	}

	function getContentById(obj,fun){
		var _id = obj.id;
		console.dir(_id);
		var query = connection.query("select * from note where id=?",[_id],function(err,result){
			if(err) throw err;
			fun(result);
		});
	}

	return{
		login: noteLogin,
		submitnote : submitnote,
		getNodeData : getNodeData,
		getContentById : getContentById
	}
})();