var page = new Vue({
    el: '#master_order_list_div',
    data: {
        order_datas: [{
            number: 1222,
            price: 12.00,
            status: '待发货',
            createTime: '2018-08-28 12:23:00',
            payType: '微信支付',
            payAccountName: 'wx0978'
        },{
            number: 1222,
            price: 12.00,
            status: '待支付',
            createTime: '2018-08-28 12:23:00',
            payType: '支付宝',
            payAccountName: 'wx0978'
        },{
            number: 1222,
            price: 12.00,
            status: '待发货',
            createTime: '2018-08-28 12:23:00',
            payType: '微信支付',
            payAccountName: 'wx0978'
        },{
            number: 1222,
            price: 12.00,
            status: '待发货',
            createTime: '2018-08-28 12:23:00',
            payType: '微信支付',
            payAccountName: 'wx0978'
        }],
        pageIndex:0,

        currentPage: 1,
        total: 1,
    },
    methods:{
        link_to_detail:function(index){
            var uuid=this.order_datas[index].uuid;
            router.push({path:'order_info',query:{uuid:uuid}});
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.search_order(val);
        },
        search_order:function(val){
            var _this=this;
            // if(isSearch){
            //     _this.pageIndex=0;
            //     _this.order_datas=[];
            // }

            var orderNumber=$("#orderNumber").val();
            var status=[];

            var jsonData={orderNumber:orderNumber,status:status,pageIndex:val,pageSize:10};
            HttpUtils.requestPost("/api/order/findOrders",JSON.stringify(jsonData),function(dataResult){
                if(dataResult.status==1000){
                    // if(isSearch){
                    //     _this.order_datas=dataResult.data;
                    // }else{
                    //     if(dataResult.data!=null){
                    //         for(var i=0;i<dataResult.data.length;i++){
                    //             _this.order_datas.push(dataResult.data[i]);
                    //         }
                    //     }
                    // }

                    // _this.pageIndex=_this.pageIndex+1;
                    _this.order_datas = dataResult.data.list;
                    _this.total = dataResult.data.total;
                }
            });
        },
        export_datas:function(){
            var orderNumber=$("#orderNumber").val();
            // var tokenValue=storage.get("userInfo")==null?'':storage.get("userInfo").token;
            window.location.href=HttpUtils.data.hostUrl+"/api/order/exportInfos?orderNumber="+orderNumber;
        }
    },
    mounted:function(){
        var _this=this;
        _this.search_order(1);

       
    }
});