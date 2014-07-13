$("#menu").panel({
    fit:true,   
    title: '菜单列表',   
    tools: [{   
        iconCls:'icon-add',   
        handler:function(){$('#menuset').dialog('open').dialog('setTitle','Edit User');}   
    }]
});
$("#menuContent").panel({
    fit:true,   
    title: '菜单内容列表',   
    tools: [{   
        iconCls:'icon-add',   
        handler:function(){$('#menuset').dialog('open').dialog('setTitle','Edit User');}   
    }]
});

//获取菜单信息
$.ajax({
    type:"get",
    url:"http://localhost:3000/menu",
    data:"",
    success:function(data){
        var ul = $("#menuname");
        for (var i = 0; i < data.length; i++) {
            if(data[i].nameP.length>4){
                data[i].nameP = data[i].nameP.substr(0,4);
            }
            var txt = '<a id="btn'+i+'" href="#">'+data[i].nameP+'</a>';
            $(txt).data("menuid",data[i].id).css({"margin":"10px 8px 0 6px"}).appendTo(ul);
            $('#btn'+i).linkbutton({   
                iconCls: 'icon-tip'
            }).bind("click",function(){
                $("#menuInfo").html("");
                var _selectId = $(this).data("menuid");
                var _selectData = JSON.parse('{"id":"'+_selectId+'"}');
                $.ajax({
                    type:"get",
                    url : "http://localhost:3000/getmenuinfo",
                    dataType : "json",
                    data : _selectData,
                    success : function(obj){
                        setMenuInfo(obj,"menuInfo");
                    }
                });
            });
        };
    }
});

function setMenuInfo(data,ulid){
    var html = '<div style="height:100px;width:80px;border:1px solid black;float:left;margin:10px;">'+
                '<div style="height:80px;">'+
                '<div style="width:100%;height:18px;background-color: rgb(131, 131, 123);"><img id="level" src="/stylesheets/images/star.png" height="16" width="16" style="float:right;"></div>'+
                '<div style="width:100%;height:18px;margin-top:44px;text-align:center;background-color: yellow;opacity: 0.4;"><span style="color:green;">[nameP]</span></div>'+
                '</div>'+
                '<div style="text-align: center;">'+
                '<span>￥[price]</span>'+
                '</div>'+
                '</div>';
    for (var i =0;i< data.length;i++) {
        var menuInfo1 = $(html.replace("[price]",data[i]["price"]).replace("[nameP]",data[i]["nameP"]));
        menuInfo1.find("div").prevObject.data("price",data[i]["price"]);
        menuInfo1.appendTo($("#"+ulid));
        var level = data[i]["lovelevel"];
        for (var j = 1; j < level; j++) {
            menuInfo1.find("img").first().clone().insertAfter(menuInfo1.find("img").last());
        };
    };
}
//编辑或添加菜单信息
function saveMenu(){
    $("#fmMenu").form("submit",{
        url : "http://localhost:3000/savamenu",
        onSubmit : function(){
        },
        success : function(obj){
            obj = JSON.parse(obj);
            if(obj.msg=="成功"){
                $.messager.alert("info","添加成功！");
                $('#menuset').dialog('close');
            }else{
                $.messager.alert("warn","添加失败！");
            }
        }
    });
}

//获取今日菜
$.ajax({
    type : "get",
    url : "http://localhost:3000/gettodaymenu",
    data : "",
    success : function(obj){
        setMenuInfo(obj,"todayfood");
        var todaymoney = 0;
        for (var i = 0; i < obj.length; i++) {
            todaymoney += obj[i]["price"];
        };
        $("#todaymoney").html("￥: "+todaymoney);
    }
});

function getTodayAmout(){
    var todayAmount = 0;
    $("#todayfood").find("div").each(function(){
        if($(this).data("price")){
            todayAmount += $(this).data("price");
        }
    });
    $("#todaymoney").html("￥: "+todayAmount);
}

//获取今日就餐人员
(function getTodayPeople(){
    $.ajax({
        type:"get",
        url:"http://localhost:3000/getTodayPeople",
        success:function(data){
            var html = '<li style="margin-right:10px;float:left;">'+
                '<div style="height: 90px; border: 1px solid; width: 60px; text-align: center; margin-top: 4px;">'+
                    '<div style=" height: 65%;background-color:rgb(150, 150, 150);"></div>'+
                    '<span style=" line-height: 16px;  display: block;">[nameP]</span>'+
                    '<span>￥:[amount]</span>'+
                '</div></li>';
            var todayamout = (parseInt($("#todaymoney").text().substr(3))/data.length).toFixed(2);
            for (var i = 0; i < data.length; i++) {
                $(html.replace("[nameP]",data[i].nameP).replace("[amount]",todayamout)).appendTo("#todaystudent1");
            };
        }
    });
})();

