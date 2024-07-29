var page = new Vue({
	el: "#master_wxmaterial_list_div",
	data: {
		contentRelatedMaterials: null, // 关联素材-当前内容已关联素材数据
		relatedContentData: null, // 关联素材-当前内容数据
		contentType: 1, // 关联素材-内容类型（1.文章，2视频）
		relatedMaterialsVisible: false,
		relatedMaterialLoading: false,
		materialsList: [],
		product_datas: [
			{
				itemTitle: "",
				cateName: "",
				itemAuthor: "",
				statusName: "待上架",
				updateTimeStr: "2018-09-03 12:23:12",
			},
		],
		source: [
			{
				materialType: "",
				name: "全部",
				select: true,
			},
			{
				materialType: "news",
				name: "公众号",
				select: false,
			},
			{
				materialType: "gskpost",
				name: "小程序",
				select: false,
			},
		],
		cate_datas: [
			{
				cateSlug: "all",
				cateName: "全部",
				select: true,
			},
			{
				cateSlug: "shouyezonghe",
				cateName: "首页-综合",
				select: false,
			},
			{
				cateSlug: "yamingan",
				cateName: "牙敏感",
				select: false,
			},
			{
				cateSlug: "kouqiangzhengji",
				cateName: "口腔正畸",
				select: false,
			},
			{
				cateSlug: "ertongkouqiang",
				cateName: "牙体牙髓",
				select: false,
			},
			{
				cateSlug: "yayishenghuo",
				cateName: "口腔黏膜",
				select: false,
			},
			{
				cateSlug: "huanjiaokepu",
				cateName: "牙槽外科",
				select: false,
			},
			{
				cateSlug: "kouqiangxiufu",
				cateName: "口腔修复",
				select: false,
			},
			{
				cateSlug: "yazhoujibing",
				cateName: "牙周疾病",
				select: false,
			},
			{
				cateSlug: "kouqiangzhongzhi",
				cateName: "口腔种植",
				select: false,
			},
			{
				cateSlug: "kouqiangyufang",
				cateName: "口腔预防",
				select: false,
			},
			{
				cateSlug: "huanzhejiaoyu-1",
				cateName: "患者教育-牙敏感",
				select: false,
			},
			{
				cateSlug: "huanzhejiaoyu-2",
				cateName: "患者教育-口腔正畸",
				select: false,
			},
			{
				cateSlug: "huanzhejiaoyu-3",
				cateName: "患者教育-义齿护理",
				select: false,
			},
			{
				cateSlug: "huanzhejiaoyu-4",
				cateName: "患者教育-义齿稳固",
				select: false,
			},
			{
				cateSlug: "huanzhejiaoyu-5",
				cateName: "患者教育-常规口腔患教",
				select: false,
			},
			{
				cateSlug: "huanzhejiaoyu-6",
				cateName: "患者教育-牙基会合作专区",
				select: false,
			},
			{
				cateSlug: "jingyingguanli",
				cateName: "经营管理",
				select: false,
			},
			{
				cateSlug: "hangyezixun",
				cateName: "行业资讯",
				select: false,
			},
		],
		pageIndex: 0,
		currentPage: 1,
		total: 1,
	},
	methods: {
		clearDialogData() {
			this.contentRelatedMaterials = null;
			this.relatedContentData = null;
			this.materialsList.map((item) => {
				if (item.selectedType === "Array") {
					item.selected = [];
				} else {
					item.selected = "";
				}
			});
		},
		openRelatedMaterialsDialog(item) {
			this.clearDialogData();
			this.relatedMaterialsVisible = true;
			this.relatedContentData = item;
			this.categoryActivityGetInfo();
		},
		handleRelatedMaterials() {
			let verifyResult = true;
			this.materialsList.map((item) => {
				if (item.selected.length < 1) {
					verifyResult = false;
				}
			});
			if (!verifyResult) {
				this.$message({
					type: "error",
					message: "请选择关联内容",
				});
				return false;
			}
			this.categoryActivitySave();
		},
		/*
		 * 关联素材-素材列表
		 * */
		categoryBaseList: function () {
			var _this = this;
			var jsonData = {
				pageNum: 1,
				pageSize: 10,
				contentType: this.contentType,
			};

			if (window.location.href.indexOf(":8080") !== -1) {
				// 本地启动使用mock数据
				const dataResult = JSON.parse(
					JSON.stringify(CategoryBaseList_MockData)
				);
				if (dataResult.code == 0) {
					_this.materialsList = dataResult.data.map((item, index) => {
						if (index < 3) {
							item.selected = [];
							item.selectedType = "Array";
						} else {
							item.selected = "";
							item.selectedType = "String";
						}
						return item;
					});
				}
				return false;
			}

			HttpUtils.requestPost3(
				"https://skyyh-ybtest.corpnet5.com/api/yb-business-api/category/base/list",
				JSON.stringify(jsonData),
				function (dataResult) {
					if (dataResult.code == 0) {
						_this.materialsList = dataResult.data.map((item, index) => {
							if (index < 3) {
								item.selected = [];
								item.selectedType = "Array";
							} else {
								item.selected = "";
								item.selectedType = "String";
							}
							return item;
						});
					}
				}
			);
		},
		/*
		 * 关联素材-获取已关联详情
		 * */
		categoryActivityGetInfo() {
			var _this = this;
			var jsonData = {
				contentId: this.relatedContentData.id,
				contentType: this.contentType,
			};

			if (window.location.href.indexOf(":8080") !== -1) {
				// 本地启动
				this.contentRelatedMaterials = JSON.parse(
					JSON.stringify(CategoryActivityGetInfo_MockData)
				).data.list;
				this.materialsList.map((item) => {
					this.contentRelatedMaterials.map((item2) => {
						if (item.id == item2.categoryParentId) {
							if (item.selectedType === "Array") {
								item.selected.push(item2.categoryId.toString());
							} else {
								item.selected = item2.categoryId.toString();
							}
						}
					});
				});
				this.relatedMaterialsVisible = true;
				return false;
			}

			HttpUtils.requestPost3(
				"https://skyyh-ybtest.corpnet5.com/api/yb-business-api/category/activity/getInfo",
				JSON.stringify(jsonData),
				function (dataResult) {
					if (dataResult.code === 0) {
						_this.contentRelatedMaterials = dataResult?.data?.list;
						if (_this.contentRelatedMaterials) {
							_this.materialsList.map((item) => {
								_this.contentRelatedMaterials.map((item2) => {
									if (item.id == item2.categoryParentId) {
										if (item.selectedType === "Array") {
											item.selected.push(item2.categoryId.toString());
										} else {
											item.selected = item2.categoryId.toString();
										}
									}
								});
							});
						}
						_this.relatedMaterialsVisible = true;
					}
				}
			);
		},
		/*
		 * 关联素材-保存
		 * */
		categoryActivitySave: function () {
			var _this = this;
			let relatedList = [];
			this.materialsList.forEach((parentItem) => {
				if (parentItem.selected.length > 0) {
					let relatedObj = {
						categoryParentId: parentItem.id,
						categoryParentName: parentItem.name,
						categoryId: "",
						categoryName: "",
					};

					if (Array.isArray(parentItem.selected)) {
						parentItem.selected.forEach((selectedItem) => {
							parentItem.list.forEach((childItem) => {
								if (childItem.id === selectedItem) {
									relatedObj = {
										...relatedObj,
										categoryId: childItem.id,
										categoryName: childItem.name,
									};
									relatedList.push({ ...relatedObj });
								}
							});
						});
					} else {
						parentItem.list.forEach((childItem) => {
							if (childItem.id === parentItem.selected) {
								relatedObj = {
									...relatedObj,
									categoryId: childItem.id,
									categoryName: childItem.name,
								};
								relatedList.push({ ...relatedObj });
							}
						});
					}
				}
			});
			var jsonData = {
				contentId: this.relatedContentData.id,
				contentType: this.contentType,
				activityName: this.relatedContentData.itemTitle,
				list: relatedList,
			};

			if (window.location.href.indexOf(":8080") !== -1) {
				// 本地启动
				this.$message({
					type: "success",
					message: "关联成功！",
				});
				this.relatedMaterialsVisible = false;
				return false;
			}

			this.relatedMaterialLoading = true;
			HttpUtils.requestPost3(
				"https://skyyh-ybtest.corpnet5.com/api/yb-business-api/category/activity/save",
				JSON.stringify(jsonData),
				function (dataResult) {
					if (dataResult.code === 0) {
						_this.$message({
							type: "success",
							message: "关联成功！",
						});
						_this.relatedMaterialsVisible = false;
						_this.relatedMaterialLoading = false;
					}
				}
			);
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			this.search_pro(val);
		},
		selcet_cate_fun: function (event) {
			var obj = event.currentTarget;
			var currValue = $(obj).val();

			for (var i = 0; i < this.cate_datas.length; i++) {
				if (this.cate_datas[i].cateSlug == currValue) {
					this.cate_datas[i].select = true;
				} else {
					this.cate_datas[i].select = false;
				}
			}
		},
		search_pro: function (val) {
			var _this = this;
			// if(isSearch){
			//     _this.pageIndex=0;
			//     _this.product_datas=[];
			// }

			var name = $("#proName").val();
			var cateSlug = $("#cateSlug").val();
			var proSatus = $("#proSatus").val();
			var materialType = $("#materialType").val();
			var status = [];
			var jsonData = {
				name: name,
				slug: cateSlug,
				status: status,
				materialType: materialType,
				pageIndex: val,
				value: proSatus,
				pageSize: 10,
			};

			if (window.location.href.indexOf(":8080") !== -1) {
				// 本地启动使用mock数据
				const dataResult = JSON.parse(JSON.stringify(WxmaterialList_MockData));
				if (dataResult.status == 1000) {
					_this.product_datas = dataResult.data.list;
					_this.total = dataResult.data.total;
				}
				return false;
			}

			HttpUtils.requestPost(
				"/api/wxmaterial/list",
				JSON.stringify(jsonData),
				function (dataResult) {
					if (dataResult.status == 1000) {
						_this.product_datas = dataResult?.data?.list;
						_this.total = dataResult.data.total;
					}
				}
			);
		},
		export_datas: function () {
			var name = $("#proName").val();
			var cateSlug = $("#cateSlug").val();
			var proSatus = $("#proSatus").val();
			var materialType = $("#materialType").val();
			// var tokenValue=storage.get("userInfo")==null?'':storage.get("userInfo").token;
			window.location.href =
				HttpUtils.data.hostUrl +
				"/api/wxmaterial/exportInfos?name=" +
				name +
				"&slug=" +
				cateSlug +
				"&value=" +
				proSatus +
				"&materialType=" +
				materialType;
		},
		save_pro_status: function (index, event) {
			var obj = event.currentTarget;
			var _this = this;
			var oldStatus = this.product_datas[index].status;
			var uuid = this.product_datas[index].id;
			var newStatus = oldStatus == 0 || oldStatus == 2 ? 1 : 0;

			var jsonData = { key: uuid, value: newStatus };
			HttpUtils.requestPost(
				"/api/wxmaterial/saveStatus",
				JSON.stringify(jsonData),
				function (dataResult) {
					if (dataResult.status == 1000) {
						_this.product_datas[index].status = newStatus;
						_this.product_datas[index].statusName =
							newStatus == 1 ? "已发布" : "已下线";
						$.toast("操作成功!");
					}
				}
			);
		},
		link_pro_detail: function (index) {
			var uuid = this.product_datas[index].id;
			if (
				this.product_datas[index].materialType != undefined &&
				this.product_datas[index].materialType == "news"
			) {
				router.push({ path: "wxmaterial_info", query: { uuid: uuid } });
			}
			if (
				this.product_datas[index].materialType != undefined &&
				this.product_datas[index].materialType == "gskpost"
			) {
				router.push({ path: "wxmaterial_create", query: { uuid: uuid } });
			}
		},
		go_browse_records_page: function (index) {
			var uuid = this.product_datas[index].id;
			router.push({
				path: "wxmaterial_records",
				query: { type: 1, uuid: uuid },
			});
		},
	},
	mounted: function () {
		var _this = this;
		this.search_pro(1);
		this.categoryBaseList();

		// $(window).scroll(function () {
		// 	var scrollTop = $(this).scrollTop();
		// 	var scrollHeight = $(document).height();
		//     var windowHeight = $(this).height();
		//     var href=location.href;
		// 	if (scrollTop + windowHeight >= scrollHeight) {

		//         if(href.indexOf("wxmaterial_list")>0){
		//             _this.search_pro(false);
		//         }//alert("已经到最底部了！");

		// 	}
		// });
	},
});
$(document).ready(function () {
	var clipboard = new ClipboardJS(".copy");

	clipboard.on("success", function (e) {
		$.toast("复制成功!");
	});
});
