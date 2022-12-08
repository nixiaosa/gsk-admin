var page = new Vue({
    el: '#master_admin_oper_logger_list_div',
    data: {
        user_datas: [],
        pageIndex:0,

        currentPage: 1,
        total: 1,
    },
    methods: {
        handleCurrentChange(val) {
            this.currentPage = val;
            this.search_datas(val);
        },
        search_datas: function (val) {
            var _this = this;

            // if(isSearch){
            //     _this.pageIndex=0;
            //     _this.user_datas=[];
            // }

            var jsonData = {
                startTime:$("#startTime").val(),
                endTime:$("#endTime").val(),
                // pageIndex:_this.pageIndex,
                pageIndex: val,
                pageSize: 10,
            };

            HttpUtils.requestPost("/api/admin/oper/logger/infos", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {

                    // if(isSearch){
                    //     _this.user_datas = dataResult.data;
                    // }else{
                    //     if(dataResult.data!=null){
                    //         for(var i=0;i<dataResult.data.length;i++){
                    //             _this.user_datas.push(dataResult.data[i]);
                    //         }
                    //     }
                    // }

                    // _this.pageIndex=_this.pageIndex+1;
                    _this.user_datas = dataResult.data.list;
                    _this.total = dataResult.data.total;
                    
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
        this.search_datas(1);
        this.initDate();

        // $(window).scroll(function () {
		// 	var scrollTop = $(this).scrollTop();
		// 	var scrollHeight = $(document).height();
        //     var windowHeight = $(this).height();
        //     var href=location.href;
		// 	if (scrollTop + windowHeight >= scrollHeight){
                
        //         if(href.indexOf("admin_logger_list")>0){
        //             _this.search_datas(false);
        //         }
        //         //alert("已经到最底部了！");　
				
		// 	}
		// });
    }
});