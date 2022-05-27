var page = new Vue({
    el: '#master_order_info_div',
    data: {
        order_opers_datas: [{
            uuid: '123212',
            name: '李思',
            content: '确认支付',
            createTime: '2018-08-09 12:12:00'
        }, {
            uuid: '123212',
            name: '李思',
            content: '确认支付',
            createTime: '2018-08-09 12:12:00'
        }],
        order_info: null
    },
    methods: {
        find_order_data: function (orderUUID) {
            var _this = this;
            var jsonData = {
                key: orderUUID
            };

            HttpUtils.requestPost("/api/order/findOrderInfo", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {
                    _this.order_info = dataResult.data;
                }
            });
        },
        find_order_opera_data: function (orderUUID) {
            var _this = this;
            var jsonData = {
                key: orderUUID
            };
            HttpUtils.requestPost("/api/order/findOrderOperaDatas", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {
                    _this.order_opers_datas = dataResult.data;
                }
            });
        },
        save_pay_status:function(payStatus){

            var _this=this;
            var orderUUID=this.order_info.uuid;
            var content=$("#pay_opera_content").val();

            if(content==''){
                HttpUtils.showMessage("请填写支付操作内容");
                return;
            }

            var jsonData={key:orderUUID,value:payStatus,content:content};
            HttpUtils.requestPost("/api/order/savePayStatus", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {
                     _this.find_order_data(orderUUID);
                    _this.find_order_opera_data(orderUUID);
                    $.toast("操作成功!");
                }else{
                    HttpUtils.showMessage(dataResult.data);
                }
            });
        },
        save_expre_number:function(){
            var _this=this;
            var orderUUID=this.order_info.uuid;
            var expressNumber=$("#expressNumber").val();
            var expressGs=$("#expressGs").val();

            if(expressNumber==''){
                HttpUtils.showMessage("请填写完整的快递单号");
                return;
            }

            var jsonData={key:orderUUID,value:expressNumber,content:expressGs};
            HttpUtils.requestPost("/api/order/saveExpreNumber", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {
                    _this.find_order_data(orderUUID);
                    _this.find_order_opera_data(orderUUID);
                    _this.order_info.orderExpressData.expressNumber=expressNumber;
                    $.toast("操作成功!");
                }else{
                    HttpUtils.showMessage(dataResult.data);
                }
            });
        }
    },
    mounted: function () {
        var href = location.href;
        var hrefs = href.split("=");
        var orderUUId = hrefs.length == 2 ? hrefs[1] : '';
        if (orderUUId != '') {
            this.find_order_data(orderUUId);
            this.find_order_opera_data(orderUUId);
        }
    }
});