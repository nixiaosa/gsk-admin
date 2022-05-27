var imgUpload = {

	uploadImg(eleObj) {

		var elementId=$(eleObj).attr("id");
		imgUpload.ajax_upload(elementId, function (dataResult) {

			var thisW = $("#" + elementId).attr("w");
			var thisH = $("#" + elementId).attr("h");

			if (dataResult.status == 1000) {

				var imgName = dataResult.data[0].imgName;
				var w = dataResult.data[0].width;

				imgUpload.cutPic({
					"x": 0,
					"y": 0,
					"x2": 600,
					"y2": 600,
					"aspectRatio": thisW / thisH,
					"imgName": imgName,
					"width": 1000,
					"w": w,
					"eleId":elementId
				}, function (dataImg) {
					var imgUrl=dataImg.data;
					var parentStyle=$("#"+elementId).parent().attr("style");
					$("#"+elementId).attr("data-img-name",dataImg.data);
					$("#"+elementId).parent().attr("style",parentStyle+";background-image:url("+imgUrl+")");
					$("#"+elementId).parent().removeClass("weui_uploader_input_wrp");
				});
			}

			$("#" + elementId).replaceWith(function () {
				return "<input class='weui_uploader_input' style='position:static' type='file' onchange='imgUpload.uploadImg(this)' data-cutImg-ParentId='"+$("#" + elementId).attr("data-cutImg-ParentId")+"' value='" + $("#" + elementId).attr("value") + "' id='" + elementId + "' name='" + $("#" + elementId).attr("name") + "' w='" + $("#" + elementId).attr("w") + "' h='" + $("#" + elementId).attr("h") + "' />";
			});
		});
	},
	cutPic(cutArea, callback) {
		var parentId=$("#"+cutArea.eleId).attr("data-cutImg-ParentId");
		var imgName = cutArea.imgName;
		var imgurl =   imgName;
		var prop = parseInt(cutArea.w) / 600;
		var model = "<div class='mask cutmask' style='display:block;'></div>\
		<div class='cutpic'>\
			<img id='cutpic' src='" + imgurl + "' />\
			<div class='btn cancel'>取消</div>\
			<div class='btn confirm'>裁剪</div>\
		</div>";
		$("#"+parentId).append(model);
		$(".cutpic").css("top", ($(document).scrollTop() + 100) + "px");
		$("#cutpic").on('load',function () {
			setTimeout(function () {
				$("#cutpic").Jcrop({
					setSelect: [cutArea.x, cutArea.y, cutArea.x2, cutArea.y2],
					onSelect: updateArea,
					allowResize: true,
					allowSelect: false,
					aspectRatio: cutArea.aspectRatio
				});
			}, 500);

		});

		function updateArea(c) {
			cutArea = c;
			console.log(JSON.stringify(cutArea));
		}
		$(".cutpic .btn").click(function () {
			if ($(this).hasClass("confirm")) {
				var jsonData = {
					"x": cutArea.x*prop,
					"y": cutArea.y*prop,
					"endX": cutArea.x2*prop,
					"endY": cutArea.y2*prop,
					"imgName": imgName
				};
				HttpUtils.requestPost("/api/img/cutImage", JSON.stringify(jsonData), function (dataResult) {
					callback(dataResult);

					$(".cutmask,.cutpic").remove();
				});
			} else {
				$(".cutmask,.cutpic").remove();

			}
		});
	},
	ajax_upload(elementId, callback) { //具体的上传图片方法
		var feid = elementId;
		var uploadImg = HttpUtils.data.hostUrl + "/api/img/upload";

		$.ajaxFileUpload({
			fileElementId: feid, //需要上传的文件域的ID，即<input type="file">的ID。
			url: uploadImg, //后台方法的路径
			dataType: 'json', //服务器返回的数据类型。可以为xml,script,json,html。如果不填写，jQuery会自动判断。
			secureuri: false, //是否启用安全提交，默认为false。
			success: callback,
			error: callback
		});
	},
	ajax_upload_file(elementId, callback) { //具体的上传文件方法
		var feid = elementId;
		var uploadImg = HttpUtils.data.hostUrl + "/api/img/file/upload";

		$.ajaxFileUpload({
			fileElementId: feid, //需要上传的文件域的ID，即<input type="file">的ID。
			url: uploadImg, //后台方法的路径
			dataType: 'json', //服务器返回的数据类型。可以为xml,script,json,html。如果不填写，jQuery会自动判断。
			secureuri: false, //是否启用安全提交，默认为false。
			success: callback,
			error: callback
		});
	},
	ajax_upload_file_url(elementId,uploadUrl, callback) { //具体的上传文件方法
		var feid = elementId;
		var uploadImg = HttpUtils.data.hostUrl + uploadUrl;

		$.ajaxFileUpload({
			fileElementId: feid, //需要上传的文件域的ID，即<input type="file">的ID。
			url: uploadImg, //后台方法的路径
			dataType: 'json', //服务器返回的数据类型。可以为xml,script,json,html。如果不填写，jQuery会自动判断。
			secureuri: false, //是否启用安全提交，默认为false。
			success: callback,
			error: callback
		});
	}
}