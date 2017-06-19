$(".navbar-brand").click(function (e) {
	var sidebar = $(".sidebar");
	var w = sidebar.css("width");
	console.log(w);
	if(w === "0px") {
		sidebar.css("width","350px");
		sidebar.css("display","block");
	} else {
		sidebar.css("width","0");
		sidebar.css("display","none");
	}
});