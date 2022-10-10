<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html>
<title>找不到页面</title>
<script type="text/javascript" src="./resources/js/common/jquery.min.js"></script>
<script language="javascript" src="./resources/js/common/jquery-3.3.1.js"></script>
<script type="text/javascript" src="./resources/js/common/jquery.Jcrop.js"></script>
<script language="javascript">
$(document).ready(function(e) {
	var timing=setInterval(function(){
		var url = location.href;
		if(url.indexOf("code") > -1){
			$(".msg").html("加载中,请稍候...");
			window.location.href= url;
			clearInterval(timing);
		}
	},1000);
});
</script>
<body>
<h2 class="msg">很抱歉，您访问的页面不存在<br /></h2>
</body>
</html>
