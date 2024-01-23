var page = new Vue({
    el: '#master_privacy_list_div',
    data: {
        privacy_datas: [],
        pageIndex:0
    },
    methods:{
        search_pro:function(isSearch){
            var _this=this;
            if(isSearch){
                _this.pageIndex=0;
                _this.privacy_datas=[];
            }
            

            var jsonData={pageIndex:_this.pageIndex};
            HttpUtils.requestPost("/api/admin/privacys",JSON.stringify(jsonData),function(dataResult){
                if(dataResult.status==1000){
                    if(isSearch){
                        _this.privacy_datas = dataResult.data;
                    } else {
                        if(dataResult.data!=null){
                            for(var i=0;i<dataResult.data.length;i++){
                                _this.privacy_datas.push(dataResult.data[i]);
                            }
                        }
                    }
                    _this.pageIndex=_this.pageIndex+1;
                }
            });
        },
        save_pro_status:function(index,event){
            var _this=this;
            var oldStatus=this.privacy_datas[index].status
            var uuid=this.privacy_datas[index].id;
            var newStatus = oldStatus == 0 ? 1 : 0;

            var jsonData={id:uuid,status:newStatus};
            HttpUtils.requestPost("/api/admin/savepsStatus",JSON.stringify(jsonData),function(dataResult){
                if(dataResult.status==1000){
                    $.toast("操作成功!");
                    _this.search_pro(true);
                }
            });
        },
        link_pro_detail:function(index){
            var uuid=this.privacy_datas[index].id;
            var link = this.privacy_datas[index].link;
            var version = this.privacy_datas[index].version;
            var editionTime = this.privacy_datas[index].editionTime;
            var title = this.privacy_datas[index].title;
            var content = this.privacy_datas[index].content;
            router.push({path:'privacy_edit',query:{uuid:uuid,link:link,version:version,editionTime:editionTime,title:title,content:content}});
        }
    },
    mounted: function () {
        var _this=this;
        this.search_pro(true);

        $(window).scroll(function () {
			var scrollTop = $(this).scrollTop();
			var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            var href=location.href;
			if (scrollTop + windowHeight >= scrollHeight){
                
                if(href.indexOf("privacy_list")>0){
                    _this.search_pro(false);
                }
                //alert("已经到最底部了！");　
				
			}
		});
    }
});