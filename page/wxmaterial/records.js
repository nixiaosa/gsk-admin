var page = new Vue({
	el: "#master_wxmaterial_records_div",
	data: {
		user_datas: [],
		cate_datas: [
			{
				cateName: "每日访问来源",
				type: 1,
				select: true,
			},
			{
				cateName: "每日访问时长",
				type: 2,
				select: false,
			},
			{
				cateName: "每日访问深度",
				type: 3,
				select: false,
			},
		],
		selectedName: "访问来源",
	},
	methods: {
		selcet_cate_fun: function (event) {
			var obj = event.currentTarget;
			var currValue = $(obj).val();

			for (var i = 0; i < this.cate_datas.length; i++) {
				if (this.cate_datas[i].type == currValue) {
					this.cate_datas[i].select = true;
					this.selectedName = this.cate_datas[i].cateName;
				} else {
					this.cate_datas[i].select = false;
				}
			}
		},
		search_datas: function (isSearch) {
			var _this = this;

			if (isSearch) {
				_this.user_datas = [];
			}
			// if ($("#startTime").val() == "") {
			// 	HttpUtils.showMessage("请选择查询开始时间");
			// 	return false;
			// }
			// if ($("#endTime").val() == "") {
			// 	HttpUtils.showMessage("请选择查询结束时间");
			// 	return false;
			// }

			var jsonData = {
				pageNum: 1,
				pageSize: 10,
				params: {
					startTime: $("#startTime").val(),
					endTime: $("#endTime").val(),
					contentType: router.currentRoute.query.type,
					contentId: router.currentRoute.query.uuid,
				},
			};

			if (window.location.href.indexOf(":8080") !== -1) {
				// 本地启动使用mock数据
				const dataResult = MockData;
				if (dataResult.code == 0) {
					if (isSearch) {
						_this.user_datas = dataResult.data.list;
						_this.user_datas.map((item, index) => {
							item.startTime = timestampToTime(item.startTime);
							item.lastTime = timestampToTime(item.lastTime);
						});
						console.log(_this.user_datas);
					}
				}
				return false;
			}

			HttpUtils.requestPost(
				"/api/yb-business-api/watch/getWatchPage",
				JSON.stringify(jsonData),
				function (dataResult) {
					if (dataResult.code == 0) {
						if (isSearch) {
							_this.user_datas = dataResult.data.list;
							_this.user_datas.map((item, index) => {
								item.startTime = timestampToTime(item.startTime);
								item.lastTime = timestampToTime(item.lastTime);
							});
							console.log(_this.user_datas);
						}
					}
				}
			);
		},
		export_datas: function () {
			if ($("#startTime").val() == "") {
				HttpUtils.showMessage("请选择查询开始时间");
				return false;
			}
			if ($("#endTime").val() == "") {
				HttpUtils.showMessage("请选择查询结束时间");
				return false;
			}
			// var tokenValue=storage.get("userInfo")==null?'':storage.get("userInfo").token;
			window.location.href =
				HttpUtils.data.hostUrl +
				"/api/analysis/applet/expvisitdistribution?beginDate=" +
				$("#startTime").val() +
				"&endDate=" +
				$("#endTime").val() +
				"&dataType=" +
				$("#type").val();
		},
		initDate: function () {
			var startTime = new DateJs({
				inputEl: "#startTime",
				el: ".start",
			});
			var endTime = new DateJs({
				inputEl: "#endTime",
				el: ".end",
			});
		},
	},
	mounted: function () {
		var _this = this;
		this.search_datas(true);
		// this.initDate();
	},
});
