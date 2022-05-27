var page = new Vue({
    el: '#master_user_action_div',
    data: {
        myEditor: null,
        one_type_datas: [],
        two_type_datas: [],
        pro_info: {
            nickname: "",
            sexName: "",
            outpatient: "",
            cityName: "",
            country: "",
            province: "",
            uid:0
        },
        watch_info:{
            readValue:"",
            liveValue:""
        }
    },
    methods: {
        find_pro_info: function (proUUid) {

            var _this = this;
            var jsonData = {
                key: proUUid
            };
            HttpUtils.requestPost("/api/user/lable/info", JSON.stringify(jsonData), function (dataResult) {

                if (dataResult.status == 1000) {
                    _this.pro_info = dataResult.data;
                    
                }
            });
        },
        find_action_datas:function(proUUid){
            _this=this;
            var jsonData = {
                key: proUUid
            };
            HttpUtils.requestPost("/api/user/integral/actions", JSON.stringify(jsonData), function (dataResult) {

                if (dataResult.status == 1000) {

                    if(dataResult.data!=null){
                        var actionDatas=_this.set_action_data(dataResult.data);
                        _this.init_echarts_action(actionDatas);
                    }else{
                        $("#main").text("无");
                    }
                }
            });
        },
        find_watch_datas:function(proUUid){

            var _this = this;
            var jsonData = {
                key: proUUid
            };
            HttpUtils.requestPost("/api/user/watch/info", JSON.stringify(jsonData), function (dataResult) {

                if (dataResult.status == 1000) {
                    _this.watch_info = dataResult.data;
                    
                }
            });
        },
        set_action_data:function(actionData){
            var nameList =actionData;
            var legendData = [];
            var seriesData = [];
            var selected = {};

            for (var i = 0; i < nameList.length; i++) {
                var name =nameList[i].integralTypeName;
                legendData.push(name);
                seriesData.push({
                    name: name,
                    value: nameList[i].totalCount
                });
                selected[name] = nameList[i].totalCount;
            }
        
            return {
                legendData: legendData,
                seriesData: seriesData,
                selected: selected
            };
        },
        init_echarts_action:function(actionDatas){
            var myChart = echarts.init(document.getElementById('main'));
            var data = actionDatas;
            // 指定图表的配置项和数据
            option = {
                title: {
                    text: '',
                    subtext: '',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: 10,
                    top: 20,
                    bottom: 20,
                    data: data.legendData,
            
                    selected: data.selected
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: '55%',
                        center: ['40%', '50%'],
                        data: data.seriesData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
    
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
    },
    mounted: function () {
        var href = location.href;
        var hrefs = href.split("=");
        var proUUId = hrefs.length == 2 ? hrefs[1] : '';
        if (proUUId != '') {
            this.find_pro_info(proUUId);
            this.find_action_datas(proUUId);
            this.find_watch_datas(proUUId);
        } else {
            //this.init();
        }

       
    }
});