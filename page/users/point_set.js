var page = new Vue({
    el: '#master_point_set_div',
    data: {
        pro_info: {
            count: "0.00",
            userId: router.currentRoute.query.uuid,
            pointType: ''
        },
    },
    methods: {
        save_pro_info: function (proStatus) {
            var roleUuid = $(":checked").val();
            var _this = this;
            var jsonData = {
                userId: router.currentRoute.query.uuid,
                count: this.pro_info.count,
                pointType: roleUuid
            };

            HttpUtils.requestPost("/api/user/integralSetting", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {
                    $.toast("保存成功!");
                    router.push({
                        path: 'user_list',
                        query: {
                            uuid: ''
                        }
                    });
                } else {
                    HttpUtils.showMessage(dataResult.data);
                }
            });
        },
    },
    mounted: function () {
        // this.save_pro_info();
    }
});