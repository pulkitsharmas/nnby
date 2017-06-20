$(".navbar-brand").click(function (e) {
	var sidebar = $(".sidebar");
	var w = sidebar.css("width");
	if(w === "0px") {
		sidebar.css("width","350px");
		sidebar.css("display","block");
	} else {
		sidebar.css("width","0");
		sidebar.css("display","none");
	}
});

function isNavOpen() {
	var sidebar = $(".sidebar");
	var w = sidebar.css("width");
	if(w === "350px")
		return true;
}

function navClose() {
	var sidebar = $(".sidebar");
	var w = sidebar.css("width");
	if(w === "350px") {
		sidebar.css("width","0");
		sidebar.css("display","none");
	}
	if(w === "0")
		return true;
}