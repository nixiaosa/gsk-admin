/*
 * @Author: Freja
 * @Date: 2024-07-26 14:21:52
 * @FilePath: /gsk-admin/page/dataAnalysis/userBehaviorStatistics.js
 * @LastEditors: Freja
 * @LastEditTime: 2024-07-26 16:28:38
 */
var page = new Vue({
	el: "#master_datas_userBehaviorStatistics_list_div",
	data: {
		user_datas: [],
		cate_datas: [
			{
				cateName: "视频",
				type: 1,
				select: false,
			},
			{
				cateName: "文章",
				type: 2,
				select: false,
			},
		],
		selectedContentType: 1,
		currentPage: 1,
		pageSize: 10,
		total: 1,
	},
	methods: {
		handleCurrentChange(val) {
			this.currentPage = val;
			this.search_datas();
		},
		selcet_cate_fun: function (event) {
			var obj = event.currentTarget;
			var currValue = $(obj).val();

			for (var i = 0; i < this.cate_datas.length; i++) {
				if (this.cate_datas[i].type == currValue) {
					this.cate_datas[i].select = true;
					this.selectedContentType = this.cate_datas[i].type;
				} else {
					this.cate_datas[i].select = false;
				}
			}
		},
		search_datas: function (isSearch) {
			var _this = this;
			if (isSearch) {
				_this.user_datas = [];
				if ($("#startTime").val() == "") {
					HttpUtils.showMessage("请选择查询开始时间");
					return false;
				}
				if ($("#endTime").val() == "") {
					HttpUtils.showMessage("请选择查询结束时间");
					return false;
				}
			}

			var jsonData = {
				pageNum: this.currentPage,
				pageSize: this.pageSize,
				params: {
					startTime: $("#startTime").val(),
					endTime: $("#endTime").val(),
					contentType: this.selectedContentType,
					contentId: null,
				},
			};
			console.log("jsonData---", jsonData);

			if (window.location.href.indexOf(":8080") !== -1) {
				// 本地启动使用mock数据
				const dataResult = MockData;
				if (dataResult.code == 0) {
					_this.user_datas = dataResult.data.list;
					_this.total = dataResult.data.total;
					_this.user_datas.map((item, index) => {
						item.startTime = timestampToTime(item.startTime);
						item.lastTime = timestampToTime(item.lastTime);
					});
					// console.log(_this.user_datas);
				}
				return false;
			}

			HttpUtils.requestPost(
				"/api/yb-business-api/watch/getWatchPage",
				JSON.stringify(jsonData),
				function (dataResult) {
					if (dataResult.code == 0) {
						_this.user_datas = dataResult.data.list;
						_this.total = dataResult.data.total;
						_this.user_datas.map((item, index) => {
							item.startTime = timestampToTime(item.startTime);
							item.lastTime = timestampToTime(item.lastTime);
						});
						// console.log(_this.user_datas);
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

			var jsonData = {
				pageNum: this.currentPage,
				pageSize: this.pageSize,
				params: {
					startTime: $("#startTime").val(),
					endTime: $("#endTime").val(),
					contentType: this.selectedContentType,
					contentId: null,
				},
			};
			console.log("jsonData---", jsonData);

			if (window.location.href.indexOf(":8080") !== -1) {
				// 本地启动使用mock数据
				const dataResult = {
					code: 0,
					message: "success",
					data: "https://cn01skyyhdevtestsa01.blob.core.chinacloudapi.cn/files/yake/tmp/行为数据.xlsx",
				};
				if (dataResult.code == 0) {
					window.location.href = dataResult.data;
					// console.log(dataResult.data);
				}
				return false;
			}

			HttpUtils.requestPost(
				"/api/yb-business-api/watch/exportWatchList",
				JSON.stringify(jsonData),
				function (dataResult) {
					if (dataResult.code == 0) {
						window.location.href = dataResult.data;
						// console.log(dataResult.data);
					}
				}
			);
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
		this.search_datas();
		this.initDate();
	},
});
