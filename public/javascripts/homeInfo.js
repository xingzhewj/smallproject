function getSelected(){
	var row = $('#menudata').datagrid('getSelected');
	if (row){
		$.messager.alert('Info', row.itemid+":"+row.productid+":"+row.attr1);
	}
}
function getSelections(){
	var ss = [];
	var rows = $('#menudata').datagrid('getSelections');
	for(var i=0; i<rows.length; i++){
		var row = rows[i];
		ss.push('<span>'+row.itemid+":"+row.productid+":"+row.attr1+'</span>');
	}
	$.messager.alert('Info', ss.join('<br/>'));
}

function pagerFilter(data){
			if (typeof data.length == 'number' && typeof data.splice == 'function'){	// is array
				data = {
					total: data.length,
					rows: data
				}
			}
			var dg = $(this);
			var opts = dg.datagrid('options');
			var pager = dg.datagrid('getPager');
			pager.pagination({
				onSelectPage:function(pageNum, pageSize){
					opts.pageNumber = pageNum;
					opts.pageSize = pageSize;
					pager.pagination('refresh',{
						pageNumber:pageNum,
						pageSize:pageSize
					});
					dg.datagrid('loadData',data);
				}
			});
			if (!data.originalRows){
				data.originalRows = (data.rows);
			}
			var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
			var end = start + parseInt(opts.pageSize);
			data.rows = (data.originalRows.slice(start, end));
			return data;
		}
var getinfo = (function homeInfo(){
		
	var ajaxParam = "";
	var getData = function(str){
		$.ajax({
			type :"post",
			url : "http://localhost:3000/home",
			data : "username="+str,
			success : function(data){
				$('#menudata').datagrid({loadFilter:pagerFilter}).datagrid('loadData', data);
			}	
		});
	}

	return {
		getinfo : getData
	};
})();

//初始化所有人员信息
$.ajax({
	type:"get",
	url : "http://localhost:3000/getstudent",
	data : "",
	success : function(data){
		$('#menudata').datagrid({loadFilter:pagerFilter}).datagrid('loadData', data);
	}
});

$.ajax({
	type:"get",
	url:"http://localhost:3000/getEatStudent",
	success:function(data){
		var html = '<li style="float:left;list-style:none;"><div style="border:1px solid black;width:50px;height:60px;margin:2px 0 0 10px;cursor: pointer;">'+
					'<div style="height:15px;background-color:rgb(70, 69, 69);margin:45px 0 0 0px;text-align: center;">'+
					'<span style="line-height:15px;display:block;">[nameP]</span>'+
					'</div>'+
					'</div></li>';
		for (var i = 0; i < data.length; i++) {
			$(html.replace("[nameP]",data[i].nameP)).appendTo($("#todaystudent"));
		};
		$("#todaystudent").click(function(e){
			if($(e.target).data("isselect") == "yes"){
				$(e.target).data("isselect","no");
				$(e.target).css({"border-color":"black"});
			}else{
				$(e.target).data("isselect","yes");
				$(e.target).css({"border-color":"yellow"});
			}
			
		});
	}
});

//编辑用户信息
function editUser(arg){
	var selectRow = $("#menudata").datagrid("getSelections");
	if(selectRow.length){
		var winEdit = $('#winUserEidt').window({   
		    width:600,   
		    height:400,   
		    modal:true  
		});  
		winEdit.find("#nameEdit").val(selectRow[0].nameP);
		winEdit.find("#owemoneyEdit").val(selectRow[0].owemoney);
		if(arg=="money"){
			winEdit.find("#nameEdit");
		}
		winEdit.find("input").focus(function(){
			$(this).val("");
		});
	}else{
		$.messager.alert("警告","请选择编辑的用户");
	}
}
//添加用户
function addUser(){
	$("#fm").form("clear");
	$('#dlg').dialog('open').dialog('setTitle','添加用户');
}
//保存编辑
function saveUserData(arg){
	if(arg=="edit" || arg =="money"){
		var selectRow = $("#menudata").datagrid("getSelections")[0];
		var data = {};
		var queryUserEdit = $('#winUserEidt').find("input");
		for (var i = 0; i < queryUserEdit.length; i++) {
			data[$(queryUserEdit[i]).attr("name")] = $(queryUserEdit[i]).val();
		}
		data.id=selectRow.id;
		data.typeY = arg;
		$.ajax({
			type:"post",
			url:"http://localhost:3000/saveUserEdit",
			dataType:"json",
			data:data,
			success:function(data){
				if(data.affectedRows){
					$.messager.alert("消息","编辑成功！");
				}
			}
		});
	}else{
		$('#fm').form('submit',{
			url: "http://localhost:3000/saveUser",
			onSubmit: function(){
				return $(this).form('validate');
			},
			success: function(result){
				var result = eval('('+result+')');
				if (result.errorMsg){
					$.messager.show({
						title: 'Error',
						msg: result.errorMsg
					});
				} else {
					$('#dlg').dialog('close');		// close the dialog
					window.location.href="http://localhost:3000/home/";
					$('#menudata').datagrid('reload');	// reload the user data
				}
			}
		});
		$("#fm").submit();
	}
}
//删除用户
function deleteUser(){
	var selectRow = $("#menudata").datagrid("getSelections");
	if(selectRow.length){
		$.messager.confirm('确认框','你确定删除'+selectRow[0].nameP+'数据吗?',function(r){   
			if (r){   
				$.ajax({
					type:"get",
					data:"id="+selectRow[0].id+"&nameP="+selectRow[0].nameP,
					url:"http://localhost:3000/deleteUser",
					success:function(data){
						alert('删除'+data.nameP+'成功！');  
					}
				});
			} 
		});
	}else{
		$.messager.alert("警告","请先选择数据！");
	} 
}
//刷新列表
function refreshTable(){
	$("#menudata").datagrid("reload");
}
		
//列运算
var lastIndex;
$('#menudata1').datagrid({
	onClickRow:function(rowIndex){
		if (lastIndex != rowIndex){
			$('#menudata').datagrid('endEdit', lastIndex);
			$('#menudata').datagrid('beginEdit', rowIndex);
			setEditing(rowIndex);
		}
		lastIndex = rowIndex;
	}
});

//小于某个数变红警示 
function formatPrice(val,row){
	if (val < 0){
		return '<span style="color:red;">'+val+'</span>';
	} else {
		return val;
	}
}

function setEditing(rowIndex){
	var editors = $('#menudata').datagrid('getEditors', rowIndex);
	var owemoneyEditor = editors[0];
	var ownmoneyEditor = editors[1];
	var costEditor = editors[2];
	owemoneyEditor.target.bind('change', function(){
		calculate();
	});
	ownmoneyEditor.target.bind('change', function(){
		calculate();
	});
	function calculate(){
		var cost = parseInt(owemoneyEditor.target.val() - parseInt(ownmoneyEditor.target.val()));//加法
		$(costEditor.target).numberbox('setValue',cost);
	}
}

function saveTodayStudent(){
	var isSelectTodays = $("#todaystudent").find("div");
	var selectData = [];
	for (var i = 0; i < isSelectTodays.length; i++) {
		if($(isSelectTodays[i]).data("isselect")=="yes"){
			selectData.push($(isSelectTodays[i]).text());
		}
	}
	var selectStr = selectData.toString();
	$.ajax({
		type:"post",
		dataType:"json",
		data:{"selectData":selectStr},
		url:"http://localhost:3000/saveTodayStu",
		success:function(data){
			if(data.affectedRows){
				$.messager.alert("信息","提交成功！");
			}
		}
	});
}
