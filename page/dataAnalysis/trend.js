var page = new Vue({
    el: '#master_datas_trend_list_div',
    data: {
        user_datas: [],
        cate_datas:[
            {
                'cateName':'日',
                'type':1,
                'select':true
            },
            {
                'cateName':'周',
                'type':2,
                'select':false
            },
            {
                'cateName':'月',
                'type':3,
                'select':false
            }
        ],
        pageIndex:0,

        currentPage: 1,
        total: 1,
    },
    methods: {
        handleCurrentChange(val) {
            this.currentPage = val;
            this.search_datas(val);
        },
        selcet_cate_fun:function(event){
            var obj = event.currentTarget;
            var currValue=$(obj).val();

            for (var i = 0; i < this.cate_datas.length; i++) {

                if(this.cate_datas[i].type == currValue){
                    this.cate_datas[i].select = true;
                }else{
                    this.cate_datas[i].select = false;
                }
            }
        },
        search_datas: function (val) {
            var _this = this;

            // if(isSearch){
            //     _this.user_datas=[];
            // }
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
                endDate:$("#endTime").val(),
                dateType:$('#type').val(),
                pageIndex: val,
                pageSize: 10,
            };

            HttpUtils.requestPost("/api/analysis/applet/getdailyvisitrrend", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {
                    // if(isSearch){
                    //     _this.user_datas = dataResult.data;
                    //     _this.user_datas.map((item,index) => {
                    //         item.getDate = timestampToTime(item.getDate);
                    //     })
                    //     if(_this.user_datas.length == 0 && ($('#type').val() == 2 || $('#type').val() == 3)){
                    //         var text = $('#dateType').val() == '2' ? '周' : '月'
                    //         HttpUtils.showMessage("查询起始日期必须包含上一个自然"+text);
				    //         return false;
                    //     }
                    //     // if(_this.user_datas.length == 0 && $('#type').val() != 1){
                    //     //     var info;
                    //     //     info = $('#type').val() == 2 ? '周' : '月';
                    //     //         HttpUtils.showMessage("查询起始日期必须包含上一个自然" + info);
				    //     //         return false;
                            
                    //     // }
                    //     console.log(_this.user_datas)
                    // }
                    _this.user_datas = dataResult.data.list;
                    _this.total = dataResult.data.total;
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
            console.log(HttpUtils.data.hostUrl+"/api/analysis/applet/expdailyvisitrrend?beginDate="+$("#startTime").val()+"&endDate="+$("#endTime").val()+"&dateType="+$('#type').val())
            // var tokenValue=storage.get("userInfo")==null?'':storage.get("userInfo").token;
            window.location.href=HttpUtils.data.hostUrl+"/api/analysis/applet/expdailyvisitrrend?beginDate="+$("#startTime").val()+"&endDate="+$("#endTime").val()+"&dateType="+$('#type').val();
           
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
        // this.search_datas(1);
        this.initDate();
    }
});