var page = new Vue({
    el: '#master_admin_list_div',
    data: {
        admin_datas: []
    },
    methods: {
        link_to_detail: function (index) {
            var uuid = this.admin_datas[index].uuid;
            router.push({
                path: 'admin_edit',
                query: {
                    uuid: uuid
                }
            });
        },
        save_status: function (index) {

            var _this=this;
            var isdel=this.admin_datas[index].isDel;
            var uuid = this.admin_datas[index].uuid;
            var statusName=isdel==0?"禁用":"启用";
            $.confirm("您确定要"+statusName+"吗?", "确认"+statusName+"?", function () {
                var jsonData = {
                    key: uuid,
                    value:isdel==0?'1':'0'
                };
                HttpUtils.requestPost("/api/admin/saveStatus", JSON.stringify(jsonData), function (dataResult) {
                    if (dataResult.status == 1000) {
                        _this.search_datas();
                        $.toast("操作成功!");
                    } else {
                        $.toast("操作失败!");
                    }
                });
            }, function () {
                //取消操作
            });
        },
        search_datas: function () {
            var _this = this;
            var jsonData = {
                key: $("#mobile").val()
            };

            HttpUtils.requestPost("/api/admin/searchInfos", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {
                    _this.admin_datas = dataResult.data;
                }
            });
        }
    },
    mounted: function () {
        this.search_datas();
    }
});