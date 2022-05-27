var page = new Vue({
    el: '#master_datas_survey_list_div',
    data: {
        user_datas: [],
    },
    methods: {
        search_datas: function (isSearch) {
            var _this = this;

            if(isSearch){
                _this.user_datas=[];
            }
            if($("#startTime").val() == ""){
                HttpUtils.showMessage("请选择查询开始时间");
				return false;
            }
            if($("#endTime").val() == ""){

                HttpUtils.showMessage("请选择查询结束时间");
				return false;
            }

            var jsonData = {
                beginDate:$("#startTime").val(),
                endDate:$("#endTime").val()
            };

            HttpUtils.requestPost("/api/analysis/applet/getweanalysisappiddailysummarytrend", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {
                    if(isSearch){
                        _this.user_datas = dataResult.data;
                        _this.user_datas.map((item,index) => {
                            item.getDate = timestampToTime(item.getDate);
                        })
                        console.log(_this.user_datas)
                    }
                }
            });
        },
        export_datas: function () {
            if($("#startTime").val() == ""){
                HttpUtils.showMessage("请选择查询开始时间");
				return false;
            }
            if($("#endTime").val() == ""){

                HttpUtils.showMessage("请选择查询结束时间");
				return false;
            }
            // var tokenValue=storage.get("userInfo")==null?'':storage.get("userInfo").token;
            window.location.href=HttpUtils.data.hostUrl+"/api/analysis/applet/expweanalysisappiddailysummarytrend?beginDate="+$("#startTime").val()+"&endDate="+$("#endTime").val();
           
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
        // this.search_datas(true);
        this.initDate();
    }
});