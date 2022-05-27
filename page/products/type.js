var page = new Vue({
    el: '#master_product_type_div',
    data: {
        one_type_datas: [],
        two_type_datas: []
    },
    methods: {
        add_one_type_temple_fun: function (even) {
            this.one_type_datas.push({
                uuid: '',
                name: '',
                isAdd: true,
                btnName: '保存'
            });
        },
        add_two_type_temple_fun: function (even) {

            if ($(":checked").length == 0) {
                HttpUtils.showMessage("请先选择一级类型");
                return;
            }
            this.two_type_datas.push({
                uuid: '',
                name: '',
                isAdd: true,
                btnName: '保存'
            });
        },
        save_one_type: function (index, event) {
            var obj = event.currentTarget;
            var parentTrObj = $(obj).parent().parent();
            var oneTypeInfo = this.one_type_datas[index];
            var name = $(parentTrObj).find(":text").val();

            if (name == '') {
                HttpUtils.showMessage("请填写类型名称");
                return;
            }

            if (oneTypeInfo.isAdd) {
                this.save_type_dao(oneTypeInfo.uuid, name, '-1', false, '编辑', index, oneTypeInfo);
            } else {
                oneTypeInfo.btnName = '保存';
                oneTypeInfo.isAdd = true;
                this.one_type_datas[index] = oneTypeInfo;
            }

            $(parentTrObj).find(":text").focus();
        },
        save_two_type: function (index, event) {
            var obj = event.currentTarget;
            var parentTrObj = $(obj).parent().parent();
            var twoTypeInfo = this.two_type_datas[index];
            var name = $(parentTrObj).find(":text").val();
            var parentUUid = $(":checked").attr("data-uuid");

            if (name == '') {
                HttpUtils.showMessage("请填写类型名称");
                return;
            }

            if (twoTypeInfo.isAdd) {
                this.save_type_dao(twoTypeInfo.uuid, name, parentUUid, false, '编辑', index, twoTypeInfo);
            } else {
                twoTypeInfo.btnName = '保存';
                twoTypeInfo.isAdd = true;
                this.two_type_datas[index] = twoTypeInfo;
            }

            $(parentTrObj).find(":text").focus();
        },
        one_type_checked: function (index, event) {
            var obj = event.currentTarget;
            var parentTrObj = $(obj).parent().parent();
            var parentUUid = this.one_type_datas[index].uuid;

            $(":radio").removeAttr('checked');
            $(parentTrObj).find(":radio").prop('checked', 'true');
            this.find_type_datas(parentUUid, false);
        },
        save_type_dao: function (uuid, name, parentUUid, isAdd, btnName, index, typeInfo) {

            var _this = this;
            var jsonData = {
                uuid: uuid,
                name: name,
                parentUUid: parentUUid
            };
            HttpUtils.requestPost("/api/product/saveType", JSON.stringify(jsonData), function (dataResult) {

                if (dataResult.status == 1000) {
                    var info = typeInfo;
                    info.uuid = dataResult.data;
                    info.name = name;
                    info.isAdd = isAdd;
                    info.btnName = btnName;
                }
            });
        },
        find_type_datas: function (parentUUid, isOneType) {

            var _this = this;
            var jsonData = {
                key: parentUUid
            };
            HttpUtils.requestPost("/api/product/findTypes", JSON.stringify(jsonData), function (dataResult) {

                if (dataResult.status == 1000) {
                    var datas = dataResult.data == null ? [] : dataResult.data;
                    if (isOneType) {
                        _this.one_type_datas = datas;
                    } else {
                        _this.two_type_datas = datas;
                    }
                }
            });
        },
        del_type_fun: function (index, isOneType) {

            var uuid = '';
            var _this = this;

            if (isOneType) {
                uuid = this.one_type_datas[index].uuid;
            } else {
                uuid = this.two_type_datas[index].uuid;
            }

            var jsonData = {
                key: uuid
            };
            HttpUtils.requestPost("/api/product/delType", JSON.stringify(jsonData), function (dataResult) {

                if (dataResult.status == 1000) {
                    if (isOneType) {
                        _this.one_type_datas.splice(index, 1);
                    } else {
                        _this.two_type_datas.splice(index, 1);
                    }
                } else {
                    HttpUtils.showMessage(dataResult.data);
                }
            });


        }
    },
    mounted: function () {
        this.find_type_datas('-1', true);
    }
});