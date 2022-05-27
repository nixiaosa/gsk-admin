var page = new Vue({
    el: '#master_fun_list_div',
    data: {
        fun_datas: [{
            uuid: '1233',
            name: '订单管理-订单列表',
            url: 'order_list',
            isAdd: false,
            levels: [{
                name: '一级',
                id: 100101,
                checked: true
            }, {
                name: '二级',
                id: 100202,
                checked: false
            }],
            roles: [{
                name: '超级管理员',
                id: 1001,
                checked: true
            }, {
                name: '员工',
                id: 1002,
                checked: false
            }, {
                name: '游客',
                id: 1003,
                checked: true
            }]
        }, {
            uuid: '1233',
            name: '订单管理-订单信息',
            url: 'order_info',
            isAdd: false,
            levels: [{
                name: '一级',
                id: 100101,
                checked: false
            }, {
                name: '二级',
                id: 100202,
                checked: true
            }],
            roles: [{
                name: '超人',
                id: 1001,
                checked: true
            }, {
                name: '雷神',
                id: 1002,
                checked: false
            }, {
                name: '钢铁侠',
                id: 1003,
                checked: true
            }]
        }]
    },
    methods: {
        save_info_fun: function (index, event) {
            var obj = event.currentTarget;
            var parentTrObj = $(obj).parent().parent();
            var funInfo = this.fun_datas[index];

            if (funInfo.isAdd) {
               

                var funName = "";
                var funUrl = "";
                var isAdd = false;
                var levels = [];
                var roles = [];
                var checkedlevels = [];
                var checkedroles = [];

                funName = $(parentTrObj).find("[name='fun_name" + index + "']").val();
                funUrl = $(parentTrObj).find("[name='fun_url" + index + "']").val();

                $(parentTrObj).find("[name='level" + index + "']").each(function () {

                    var data = {
                        id: $(this).val(),
                        name: $(this).attr('level-name'),
                        checked: $(this).prop("checked")
                    };
                    levels.push(data);

                    if ($(this).prop("checked")) {
                        checkedlevels.push(data);
                    }
                });

                $(parentTrObj).find("[name='role" + index + "']").each(function () {

                    var data = {
                        id: $(this).val(),
                        name: $(this).attr('role-name'),
                        checked: $(this).prop("checked")
                    };
                    roles.push(data);

                    if ($(this).prop("checked")) {
                        checkedroles.push(data);
                    }
                });

                if(!this.validate_param(funName,funUrl,checkedlevels,checkedroles)){
                    return;
                }

                this.save_func_info_dao(funInfo.uuid, funName, funUrl, isAdd, checkedlevels, checkedroles, levels, roles);
                funInfo.name = funName;
                funInfo.url = funUrl;
                funInfo.levels = levels;
                funInfo.roles = roles;
                $(obj).text('编辑');
                funInfo.isAdd = false;
                this.fun_datas[index] = funInfo;
                
            } else {
                $(obj).text('保存');
                funInfo.isAdd = true;
                this.fun_datas[index] = funInfo;
            }
        },
        add_info_fun: function (event) {
            var obj = event.currentTarget;
            var parentTrObj = $(obj).parent().parent();

            var funName = "";
            var funUrl = "";
            var isAdd = false;
            var levels = [];
            var roles = [];
            var checkedlevels = [];
            var checkedroles = [];

            funName = $(parentTrObj).find("[name='fun_name']").val();
            funUrl = $(parentTrObj).find("[name='fun_url']").val();

            $(parentTrObj).find("[name='leveGroup']").each(function () {

                var data = {
                    id: $(this).val(),
                    name: $(this).attr('level-name'),
                    checked: $(this).prop("checked")
                };
                levels.push(data);

                if ($(this).prop("checked")) {
                    checkedlevels.push(data);
                }
            });

            $(parentTrObj).find("[name='roleGroup']").each(function () {

                var data = {
                    id: $(this).val(),
                    name: $(this).attr('role-name'),
                    checked: $(this).prop("checked")
                };
                roles.push(data);

                if ($(this).prop("checked")) {
                    checkedroles.push(data);
                }
            });

            if(!this.validate_param(funName,funUrl,checkedlevels,checkedroles)){
                return;
            }

            this.save_func_info_dao('', funName, funUrl, isAdd, checkedlevels, checkedroles, levels, roles);
            this.clear_add_info_fun(parentTrObj);
        },
        clear_add_info_fun: function (parentTrObj) {
            $(parentTrObj).find("[name='fun_name']").val('');
            $(parentTrObj).find("[name='fun_url']").val('');
            $(parentTrObj).find("[name='leveGroup']").each(function () {
                $(this).removeProp("checked");
            });
            $(parentTrObj).find("[name='roleGroup']").each(function () {
                $(this).removeProp("checked");
            });
        },
        validate_param: function (name, url, checkedLevels, checkedRoles) {

            if (name == '' || url == '' || checkedLevels.length == 0 || checkedRoles == 0) {
                return false;
            }

            return true;
        },
        save_func_info_dao: function (uuid, funName, funUrl, isAdd, checkedLevels, checkedRoles, levels, roles) {

            var _this = this;
            var jsonData = {
                name: funName,
                url: funUrl,
                isAdd: isAdd,
                levels: checkedLevels,
                roles: checkedRoles,
                uuid: uuid
            };

            HttpUtils.requestPost("/api/func/save", JSON.stringify(jsonData), function (dataResult) {

                if (dataResult.status == 1000) {

                    if (uuid == '') {
                        _this.fun_datas.push({
                            uuid: dataResult.data,
                            name: funName,
                            url: funUrl,
                            isAdd: isAdd,
                            levels: levels,
                            roles: roles
                        });
                    }
                }
            });
        },
        init_func_datas: function () {
            var _this = this;
            HttpUtils.requestPost("/api/func/findFuncs", null, function (dataResult) {
                if (dataResult.status == 1000) {
                    _this.fun_datas = dataResult.data;
                }
            });
        }
    },
    mounted: function () {
        this.init_func_datas();
    }
});