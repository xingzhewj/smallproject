/*
 * GET home page.
 */

var myData = require("./mysqldata.js");

exports.index = function(req, res) {
    res.render('index', {title: 'Express'});
};

exports.login = function(req, res) {
    res.render('login', {
        title: '用户登陆'
    });
};

exports.dologin = function(req, res) {
    myData.stuendFoodOperate.selectData({
        key: "nameP",
        value: req.body.username
    }, function(data) {
        if (data.length) {
            var pass = data[0].password;
            if (pass == req.body.password) {
                res.redirect('home?username=' + data[0].nameP);
            } else {
                res.redirect('login');
            }
        }
    });
};
/************************基础信息*****************************/
exports.home = function(req, res) {
    var user = {
        username: req.query.username,
    }
    res.render('home', {
        title: 'Home',
        user: user
    });
};

exports.getInfo = function(req, res) {
    var username = req.body.username;
    myData.stuendFoodOperate.selectData({
        key: "nameP",
        value: username
    }, function(data) {
        res.send(data);
    })
};

exports.getStudent = function(req, res) {
    myData.stuendFoodOperate.getStudentInfo(function(data) {
        res.send(data);
    });
};

exports.getEatStudent = function(req, res) {
    myData.stuendFoodOperate.getEatStudent(function(data) {
        res.send(data);
    });
};

exports.saveTodayStudent = function(req, res) {
    myData.stuendFoodOperate.saveTodayStudent(function(data) {
        res.send(data);
    });
};

exports.saveUser = function(req, res) {
    var reqobj = req.body;
    reqobj.id = Math.floor(Math.random() * 10000);
    myData.stuendFoodOperate.saveUser(reqobj, function(data) {
        res.send(data);
    });
};

exports.saveUserEdit = function(req, res) {
    var reqobj = req.body;
    myData.stuendFoodOperate.saveUserEdit(reqobj, function(data) {
        res.send(data);
    });
};

exports.deleteUser = function(req, res) {
    var obj = req.query;
    myData.stuendFoodOperate.deleteUser(obj, function(data) {
        res.send(data);
    });
};

exports.getTodayPeople = function(req, res) {
    myData.stuendFoodOperate.getTodayPeople(function(data) {
        res.send(data);
    });
};
/*************************菜单信息*********************************/
exports.getMenuName = function(req, res) {
    myData.operateMenuName.getMenuName(function(data) {
        res.send(data);
    });
};

exports.savaMenu = function(req, res) {
    var obj = req.body;
    myData.operateMenuName.insertMenu(obj, function(data) {
        if (data.success) {
            res.send({
                "msg": "成功"
            });
        }
    });
};

exports.getMenuInfo = function(req, res) {
    var obj = req.query;
    myData.operateMenuName.getMenuInfo(obj, function(data) {
        res.send(data);
    });
};


/******************今日菜单******************************/
exports.gettodaymenu = function(req, res) {
    var obj = req.query;
    myData.operateFood.getTodayFood(obj, function(data) {
        res.send(data);
    });
};

exports.saveTodayStu = function(req, res) {
    var obj = req.body;
    myData.operateFood.saveTodayStus(obj, function(data) {
        res.send(data);
    });
};

/********************留言板模块*************************/
exports.noteindex = function(req, res) {
    res.render("note/login1");
}
exports.noteLogin = function(req, res) {
    var obj = req.body;
    myData.noteOperate.login(obj,function(data){
    	if(data.length){
    		res.redirect("note");
    	}else{
    		console.dir(2);
    	}
    });
}
exports.note = function(req,res){
	res.render("note/node");
}
exports.notecontent = function(req,res){
	res.render("note/nodecontent");
}
exports.getNoteContent = function(req,res){
	var obj = req.query;
	myData.noteOperate.getNodeData(obj,function(result){
		if(result){
			res.send(result);
		}
	});
};
exports.submitnote = function(req,res){
	var obj = req.body;
	myData.noteOperate.submitnote(obj,function(result){
		if(result){
			res.send({"msg":"成功！"});
		}else{
			res.send({"msg":"失败！"});
		}
		
	});
};
exports.getContentId = function(req,res){
    var obj = req.query;
    myData.noteOperate.getContentById(obj,function(result){
        if(result){
            res.send(result);
        }else{
            res.send({});
        }
    });
};