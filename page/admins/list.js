var page = new Vue({
    el: '#master_admin_list_div',
    data: {
        admin_datas: [],
        pageIndex:0,

        currentPage: 1,
        total: 1,
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
                        _this.search_datas(1);
                        $.toast("操作成功!");
                    } else {
                        $.toast("操作失败!");
                    }
                });
            }, function () {
                //取消操作
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.search_datas(val);
        },
        search_datas: function (val) {
            var _this = this;
            var jsonData = {
                key: $("#mobile").val(),
                pageIndex: val,
                pageSize: 10,
            };

            HttpUtils.requestPost("/api/admin/searchInfos", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {
                    _this.admin_datas = dataResult.data.list;
                    _this.total = dataResult.data.total;
                }
            });
        }
    },
    mounted: function () {
        this.search_datas(1);
    }
});