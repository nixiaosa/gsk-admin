var page = new Vue({
    el: '#master_user_verify_list_div',
    data: {
        verify_datas: [],
        // basicInfo: {
        //     config: 0
        // },
        pageIndex:0,
       
        currentPage: 1,
        total: 1,
    },
    methods: {
        handleCurrentChange(val) {
            this.currentPage = val;
            this.search_datas(val);
        },
        save_verify_status: function (index,isSuccess) {

            var _this = this;
            var id = this.verify_datas[index].id;
            var statusName = isSuccess == 0 ? "通过" : "驳回";
            $.confirm("您确定要" + statusName + "吗?", "确认" + statusName + "?", function () {
                var jsonData = {
                    key: id,
                    value: isSuccess
                };
                HttpUtils.requestPost("/api/user/saveVerifyStatus", JSON.stringify(jsonData), function (dataResult) {
                    if (dataResult.status == 1000) {
                        _this.search_datas(1)
                        $.toast("操作成功!");
                    } else {
                        $.toast("操作失败!");
                    }
                });
            }, function () {
                //取消操作
            });
        },
        search_datas: function (val) {
            var _this = this;

            // if(isSearch){
            //     _this.pageIndex=0;
            //     _this.user_datas=[];
            // }

            var jsonData = {
                key: $("#mobile").val(),
                content: $("#content").val(),
                pageIndex:val,
                pageSize: 10,
            };

            HttpUtils.requestPost("/api/user/searchVerifyInfos", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {

                    // if(isSearch){
                    //     _this.verify_datas = dataResult.data;
                    // }else{
                    //     if(dataResult.data!=null){
                    //         for(var i=0;i<dataResult.data.length;i++){
                    //             _this.verify_datas.push(dataResult.data[i]);
                    //         }
                    //     }
                    // }
                   
                    // _this.pageIndex=_this.pageIndex+1;
                    _this.verify_datas = dataResult.data.list;
                    _this.total = dataResult.data.total;
                }
            });
        },

        // hcp_switch: function (val) {
        //     var _this = this;
        //     var jsonData = {
        //         config: basicInfo.config
        //     };

        //     HttpUtils.requestPost("https://gsk-k8s.100url.cn/api/yb-business-api/promoter/config/value", JSON.stringify(jsonData), function (dataResult) {
        //         if (dataResult.status == 1000) {
                    
        //         }
        //     });
        // }
    },




    },
    mounted: function () {
        var _this=this;
        this.search_datas(1);

        // $(window).scroll(function () {
		// 	var scrollTop = $(this).scrollTop();
		// 	var scrollHeight = $(document).height();
        //     var windowHeight = $(this).height();
        //     var href=location.href;
		// 	if (scrollTop + windowHeight >= scrollHeight) {
                
        //         if(href.indexOf("user_verify_list")>0){
        //             _this.search_datas(false);
        //         } //alert("已经到最底部了！");　
				
		// 	}
		// });
    }
});