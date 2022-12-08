var page = new Vue({
    el: '#master_activity_list_div',
    data: {
        product_datas: [{
            title: '',
            excerpt: 12.00,
            statusName: '待上架',
            createTimeStr:'2018-09-03 12:23:12'
        }],
        pageIndex:0,
        currentPage: 1,
        total: 1,
    },
    methods:{
        handleCurrentChange(val) {
            this.currentPage = val;
            this.search_pro(val);
        },
        search_pro:function(val){
            var _this=this;
            // if(isSearch){
            //     _this.pageIndex=0;
            //     _this.product_datas=[];
            // }

            var name=$("#proName").val();
            var status=[];

            var jsonData={name:name,status:status,pageIndex:val};
            HttpUtils.requestPost("/api/activity/list",JSON.stringify(jsonData),function(dataResult){
                if(dataResult.status==1000){
                    // if(isSearch){
                    //     _this.product_datas=dataResult.data;
                    // }else{
                    //     if(dataResult.data!=null){
                    //         for(var i=0;i<dataResult.data.length;i++){
                    //             _this.product_datas.push(dataResult.data[i]);
                    //         }
                    //     }
                    // }

                    // _this.pageIndex=_this.pageIndex+1;
                    _this.product_datas = dataResult.data.list;
                    _this.total = dataResult.data.total;
                }
            });
        },
        save_pro_status:function(index,event){
            var obj = event.currentTarget;
            var _this=this;
            var oldStatus=this.product_datas[index].status
            var uuid=this.product_datas[index].id;
            var newStatus=oldStatus==0||oldStatus==2?1:0;

            var jsonData={key:uuid,value:newStatus};
            HttpUtils.requestPost("/api/product/saveProStatus",JSON.stringify(jsonData),function(dataResult){
                if(dataResult.status==1000){
                    _this.product_datas[index].status=newStatus;
                    _this.product_datas[index].statusName=newStatus==1?'已发布':'已下线';
                    $.toast("操作成功!");
                }
            });
        },
        link_pro_detail:function(index){
            var uuid=this.product_datas[index].id;
            router.push({path:'activity_info',query:{uuid:uuid}});
        }
    },
    mounted: function () {
        var _this=this;
        this.search_pro(1);
    }
});