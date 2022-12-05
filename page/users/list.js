var page = new Vue({
    el: '#master_user_list_div',
    data: {
        user_datas: [],
        pageIndex:0,

        currentPage: 1,
        total: 1,
    },
    methods: {
        handleCurrentChange(val) {
            // this.currentPage = val;
            // this.getApplyList(val)
        },
        save_status: function (index) {

            var _this = this;
            var isdel = this.user_datas[index].isDel;
            var uuid = this.user_datas[index].uuid;
            var statusName = isdel == 0 ? "禁用" : "启用";
            $.confirm("您确定要" + statusName + "吗?", "确认" + statusName + "?", function () {
                var jsonData = {
                    key: uuid,
                    value: isdel == 0 ? '1' : '0'
                };
                HttpUtils.requestPost("/api/user/saveStatus", JSON.stringify(jsonData), function (dataResult) {
                    if (dataResult.status == 1000) {
                        _this.search_datas();
                        $.toast("操作成功!");
                    } else {
                        $.toast("操作失败!");
                    }
                });
            }, function () {
                //取消操作
            });
        },
        search_datas: function (isSearch) {
            var _this = this;

            if(isSearch){
                _this.pageIndex=0;
                _this.user_datas=[];
            }

            var jsonData = {
                key: $("#mobile").val(),
                startTime:$("#startTime").val(),
                endTime:$("#endTime").val(),
                pageIndex:_this.pageIndex
            };

            HttpUtils.requestPost("/api/user/searchInfos", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {

                    if(isSearch){
                        _this.user_datas = dataResult.data;
                    }else{
                        if(dataResult.data!=null){
                            for(var i=0;i<dataResult.data.length;i++){
                                _this.user_datas.push(dataResult.data[i]);
                            }
                        }
                    }

                    _this.pageIndex=_this.pageIndex+1;
                    
                }
            });
        },
        export_datas: function () {
            var _this = this;
            var jsonData = {
                key: $("#mobile").val()
            };

            // var tokenValue=storage.get("userInfo")==null?'':storage.get("userInfo").token;
            window.location.href=HttpUtils.data.hostUrl+"/api/user/exportInfos?key="+$("#mobile").val()+"&startTime="+$("#startTime").val()+"&endTime="+$("#endTime").val();
           
        },
        give_point:function(index){
            var uuid=this.user_datas[index].id;
            router.push({path:'point_set',query:{uuid:uuid}});
        },
        link_pro_detail:function(index){
            var uuid=this.user_datas[index].id;
            router.push({path:'user_action',query:{uuid:uuid}});
        },
        initDate:function(){
            var startTime = new DateJs({
				inputEl: '#startTime',
				el: '.start'
			})
            var endTime = new DateJs({
				inputEl: '#endTime',
				el: '.end'
			})
            
        }
    },
    mounted: function () {
        var _this=this;
        this.search_datas(true);
        this.initDate();

        $(window).scroll(function () {　　
			var scrollTop = $(this).scrollTop();　　
			var scrollHeight = $(document).height();　　
            var windowHeight = $(this).height();　　
            var href=location.href;
			if (scrollTop + windowHeight >= scrollHeight) {　
                
                if(href.indexOf("user_list")>0){
                    _this.search_datas(false);
                }　　　 //alert("已经到最底部了！");　
				
			}
		});
    }
});