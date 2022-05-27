var page = new Vue({
    el: '#master_pocket_list_div',
    data: {
        pocket_datas: [],
		pageIndex: 0
    },
    methods: {

        show_comment: function (index) {
			$("[name='comment" + index + "']").show();
			$("[name='comment" + index + "']").focus();
			$("[data-action-menu='" + index + "']").toggleClass('active');
		},
		publish_comment: function (index) {
			var _this=this;
			var content = $("[name='comment" + index + "']").find("input").val();
			if (content == '' || content.length == 0) {
				$.toptips("请输入评论内容");
				return;
            }
            content=content.replace(/\ud83d[\udc00-\ude4f\ude80-\udfff]/g, '');
			if (content.length > 20) {
				$.toptips("请输入评论内容最多20字");
				return;
			}

			var uuid = this.pocket_datas[index].uuid;
			var userInfo = storage.get("userInfo");
			var jsonData = {
				key: uuid,
				value: content
			};
			HttpUtils.requestPost("/api/pocket/saveComment", JSON.stringify(jsonData), function (dataResult) {
				if (dataResult.status == 1000) {
					_this.pocket_datas[index].cinfos.push({
						commentUuid: dataResult.data,
						content: content,
						userName: userInfo.mobile
					});
					$("[name='comment" + index + "']").find("input").val('');
				}else{
                    $.toptips("评论内容不支持表情符号");
                }
			});
		},
		save_liked:function(index){
			var _this=this;
			var userInfo = storage.get("userInfo");
			var uuid = this.pocket_datas[index].uuid;
			var jsonData = {
				key: uuid
			};
			HttpUtils.requestPost("/api/pocket/saveLiked", JSON.stringify(jsonData), function (dataResult) {
				if (dataResult.status == 1000) {
					var likeds=_this.pocket_datas[index].linfos;
					var checkdIndex=-1;
					for(var i=0;i<likeds.length;i++){
						if(likeds[i].likedUuid==dataResult.data){
							checkdIndex=i;
						}
					}

					if(checkdIndex==-1){//点赞
						likeds.push({likedUuid:dataResult.data,userName:userInfo.mobile});
						_this.pocket_datas[index].isCircle=1;
					}else{//取消点赞
						likeds.splice(checkdIndex, 1);
						_this.pocket_datas[index].isCircle=0;
                    }
                    
                    $("[data-action-menu='" + index + "']").toggleClass('active');
				}
			});
		},
		find_pocket_datas: function (isSearch) {
            var _this = this;
            if(isSearch){
                _this.pageIndex=0;
                _this.pocket_datas=[];
            }

			var jsonData = {
				pageIndex: this.pageIndex
			};
			HttpUtils.requestPost("/api/pocket/findList", JSON.stringify(jsonData), function (dataResult) {
				if (dataResult.status == 1000) {
                    _this.pocket_datas = dataResult.data;
                    _this.pageIndex=_this.pageIndex+1;
					setTimeout(() => {
						_this.set_js();
					}, 200);
				}
			});
		},
		set_js: function () {
			$("[name='moments']").each(function () {

				//定义文本
				const paragraph = $(this).find("[name='paragraph']");
				const paragraphText = paragraph.text();
				const paragraphLength = paragraph.text().length;
				//定义文章长度
				const maxParagraphLength = 80;
				//定义全文按钮
				const paragraphExtender = $(this).find("[name='paragraphExtender']");
				var toggleFullParagraph = false;

				//定义全文按钮
				if (paragraphLength < maxParagraphLength) {
					paragraphExtender.hide();
				} else {
					paragraph.html(paragraphText.substring(0, maxParagraphLength) + '...');
					paragraphExtender.click(function () {
						if (toggleFullParagraph) {
							toggleFullParagraph = false;
							paragraphExtender.html('显示全文');
							paragraph.html(paragraphText.substring(0, maxParagraphLength) + '...');
						} else {
							toggleFullParagraph = true;
							paragraphExtender.html('收起');
							paragraph.html(paragraphText);
						}
					});
				};
				const menu = $(this).find("[name='actionMenu']");
				const menuBtn = $(this).find("[name='actionToggle']");
				menuBtn.click(function () {
					menu.toggleClass('active')
				});
			});
        },
        del_comment:function(index,commentIndex){
            var _this=this;
            var uuid=this.pocket_datas[index].cinfos[commentIndex].commentUuid;
            $.confirm("您确定要删除此评论吗?", "提示", function () {
                var jsonData = {
                    key: uuid,
                    value:'1'
                };
                HttpUtils.requestPost("/api/pocket/delInfo", JSON.stringify(jsonData), function (dataResult) {
                    if (dataResult.status == 1000) {
                        _this.pocket_datas[index].cinfos.splice(commentIndex, 1)
                        $.toast("操作成功!");
                    } else {
                        $.toast("操作失败!");
                    }
                });
            }, function () {
                //取消操作
            });
        },
        del_pocket:function(index){
            var _this=this;
            var uuid=this.pocket_datas[index].uuid;
            $.confirm("您确定要删除此动态吗?", "提示", function () {
                var jsonData = {
                    key: uuid,
                    value:'2'
                };
                HttpUtils.requestPost("/api/pocket/delInfo", JSON.stringify(jsonData), function (dataResult) {
                    if (dataResult.status == 1000) {
                        _this.pocket_datas.splice(index, 1)
                        $.toast("操作成功!");
                    } else {
                        $.toast("操作失败!");
                    }
                });
            }, function () {
                //取消操作
            });
        },
		init: function () {
			this.pageIndex = 1;
			this.find_pocket_datas(true);
		}
    },
    mounted: function () {
        var _this=this;
        this.init();

        $(window).scroll(function () {　　
			var scrollTop = $(this).scrollTop();　　
			var scrollHeight = $(document).height();　　
            var windowHeight = $(this).height();　　
            var href=location.href;
			if (scrollTop + windowHeight == scrollHeight) {　
                
                if(href.indexOf("pocket_list")>0){
                    _this.find_pocket_datas(false);
                }
			}
		});
    }
});