var page = new Vue({
    el: '#master_activity_video_list_div',
    data: {
        product_datas: [{
            title: ''
        }],
        pageIndex:0
    },
    methods:{
        search_pro:function(isSearch){
            var _this=this;
            if(isSearch){
                _this.pageIndex=0;
                _this.product_datas=[];
            }

            var name=$("#proName").val();
            var status=[];

            var jsonData={name:name,status:status,pageIndex:_this.pageIndex};
            HttpUtils.requestPost("/api/activity/video/list",JSON.stringify(jsonData),function(dataResult){
                if(dataResult.status==1000){
                    if(isSearch){
                        _this.product_datas=dataResult.data;
                    }else{
                        if(dataResult.data!=null){
                            for(var i=0;i<dataResult.data.length;i++){
                                _this.product_datas.push(dataResult.data[i]);
                            }
                        }
                    }

                    _this.pageIndex=_this.pageIndex+1;
                }
            });
        },
        save_pro_status:function(index,event){
            var obj = event.currentTarget;
            var _this=this;
            var oldStatus=this.product_datas[index].status
            var id=this.product_datas[index].id;
            var newStatus=oldStatus==0||oldStatus==2?1:0;

            var jsonData={id:id,status:newStatus};
            
            HttpUtils.requestPost("/api/activity/video/status/save",JSON.stringify(jsonData),function(dataResult){
                if(dataResult.status==1000){
                    _this.product_datas[index].status=newStatus;
                    _this.product_datas[index].statusName=newStatus==1?'已发布':'待发布';
                    $.toast("操作成功!");
                }
            });
        },
        export_datas:function(index,event){
            var id=this.product_datas[index].id;
            var sTime=$("#startTime").val();
            var eTime=$("#endTime").val();
            // var tokenValue=storage.get("userInfo")==null?'':storage.get("userInfo").token;
            if(sTime==''||eTime==''){
                HttpUtils.showMessage("请输入导出开始时间和结束时间");        
            }else{
                window.location.href=HttpUtils.data.hostUrl+"/api/activity/video/export?id="+id+"&sTime="+$("#startTime").val()+"&eTime="+$("#endTime").val();
            }
        },
        export_datas_detail:function(index,event){
            var id=this.product_datas[index].id;
            var sTime=$("#startTime").val();
            var eTime=$("#endTime").val();
            // var tokenValue=storage.get("userInfo")==null?'':storage.get("userInfo").token;
            if(sTime==''||eTime==''){
                HttpUtils.showMessage("请输入导出开始时间和结束时间");        
            }else{
                window.location.href=HttpUtils.data.hostUrl+"/api/activity/video/exportdetail?id="+id+"&sTime="+$("#startTime").val()+"&eTime="+$("#endTime").val();
            }
        },
        link_pro_detail:function(index){
            var uuid=this.product_datas[index].id;
            router.push({path:'activity_video_info',query:{uuid:uuid}});
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
        this.search_pro(true);
        this.initDate();
    }
});