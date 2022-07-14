var page = new Vue({
    el: '#master_point_set_div',
    data: {
        pro_info: {
            count: "0.00",
            userId: 0,
        },
    },
    methods: {
        save_pro_info: function (proStatus) {
            var roleUuid = $(":checked").val();
            var _this = this;
            console.log('lcc1', router.currentRoute.query.uuid)
            console.log('lcc2', this.pro_info)
            // HttpUtils.requestPost("/api/user/integralSetting", JSON.stringify(_this.pro_info), function (dataResult) {

            //     if (dataResult.status == 1000) {
            //         alert("操作成功!");
            //         _this.find_pro_info(dataResult.data);
            //     } else {
            //         HttpUtils.showMessage("");
            //     }
            // });
        },
    },
    mounted: function () {
        // this.save_pro_info();
    }
});