var page = new Vue({
    el: '#master_datas_article_list_div',
    data: {
        user_datas: [],
        cate_datas:[
            {
                'cateName':'图文群发每日数据',
                'type':1,
                'select':true
            },
            {
                'cateName':'图文群发每日总数据',
                'type':2,
                'select':false
            },
            {
                'cateName':'图文统计每日数据',
                'type':3,
                'select':false
            },
            {
                'cateName':'图文统计每日分时数据',
                'type':4,
                'select':false
            },
            {
                'cateName':'图文分享每日转发数据',
                'type':5,
                'select':false
            },
            {
                'cateName':'图文分享每日转发分时数据',
                'type':6,
                'select':false
            }
        ],
        selectedType:1,
        pageIndex:0,

        currentPage: 1,
        total: 1,
    },
    methods: {
        selcet_cate_fun:function(event){
            var obj = event.currentTarget;
            var currValue=$(obj).val();

            for (var i = 0; i < this.cate_datas.length; i++) {

                if(this.cate_datas[i].type == currValue){
                    this.cate_datas[i].select = true;
                    this.selectedType = this.cate_datas[i].type;
                    this.search_datas(1);
                }else{
                    this.cate_datas[i].select = false;
                }
            }
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.search_datas(val);
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
                dataType:$('#type').val(),
                pageIndex: val,
                pageSize: 10,
            };

            HttpUtils.requestPost("/api/analysis/wechat/getarticlesummary", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {
                    // if(isSearch){
                    //     _this.user_datas = dataResult.data;
                    //     _this.user_datas.map((item,index) => {
                    //         item.getDate = timestampToTime(item.getDate);
                    //     })
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
            // var tokenValue=storage.get("userInfo")==null?'':storage.get("userInfo").token;
            window.location.href=HttpUtils.data.hostUrl+"/api/analysis/wechat/exparticlesummary?beginDate="+$("#startTime").val()+"&endDate="+$("#endTime").val()+"&dataType="+$('#type').val();
           
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