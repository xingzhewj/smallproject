var dataTable = (function (){
	function createTableHead(obj,target){
		var thead = $("<thead />").appendTo(target);
		var theadTool = $("<thead />").appendTo(target);
		var th = $("<th />");
		th.text(obj.headTitle).appendTo(thead).attr("colspan",2);//设置标题
		var toolStr = "";
		for (var i = 0; i < obj.tools.length; i++) {
			toolStr+="<th >"+obj.tools[i]+"</th>";
		};
		theadTool.html(toolStr);
	}

	function createTableBody(data,target){
		var tbody = $("<tbody />").appendTo(target);
		var datas = data.datas;
		for (var i = 0; i < datas.length; i++) {
			var data = datas[i];
			var tdtxt = "<tr>";
			for (var i = 0; i < data.length; i++) {
				tdtxt += "<td />"+data[i]+"</td>";
			};
			tdtxt += "</tr>";
			tbody.html(tbody.html()+tdtxt);
		};
	}

	function createTable(obj){
		var eleId = obj.eleId;
		if(eleId){
			var target = $("#"+eleId);
			target.html("");
			var table = $("<table />");
			table.appendTo(target);
			var headTitle = obj.headTitle,
				tools = obj.tools.split(","),
				datas = obj.data,
				footer = obj.footer,
				footPage = obj.footPage;
			var tableHead = {
				headTitle : headTitle,
				tools :tools
			};
			createTableHead(tableHead,table);
		}
	};

	return {
		datas : [],
		setTable : createTable
	};
})();

var datas = {datas:[{data:["wangjie","23"]},{data:["xingzhe","34","nan"]}]};