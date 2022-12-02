var page = new Vue({
    el: '#master_product_add_div',
    data: {
        myEditor: null,
        one_type_datas: [],
        two_type_datas: [],
        pro_info: {
            content: "",
            costPrice: "0",
            imgs: [{
                id: 0,
                proUuid: "",
                url: "",
                seqNumber: 0
            }],
            name: "",
            newPrice: "0",
            oldPrice: "0",
            startValidity: '',
            endExpiry:'',
            oneTypes: [{
                isAdd: false,
                name: "",
                uuid: ""
            }],
            proMenus: [{
                childs: [{
                    childName: "",
                    childUuid: "",
                    proPrice: "0"
                }],
                parentName: "",
                parentUuid: ""
            }],
            showImgUrl: "",
            smallImgUrl: "",
            sourceGoodsAddress: "",
            twoTypes: [{
                isAdd: false,
                name: "",
                uuid: ""
            }],
            uuid: "",
            status: 0
        },
        pro_menu_lable: [{
            name: 'S'
        }, {
            name: 'M'
        }, {
            name: 'L'
        }, {
            name: 'XL'
        }, {
            name: '2XL'
        }, {
            name: '3XL'
        }, {
            name: '4XL'
        }, {
            name: '红色'
        }, {
            name: '黑色'
        }, {
            name: '白色'
        }, {
            name: '焦糖色'
        }, {
            name: '藏青色'
        }, {
            name: '卡其色'
        }, {
            name: '墨绿色'
        }, {
            name: '蓝色'
        }, {
            name: '灰色'
        }, {
            name: '酒红色'
        }]
    },
    methods: {
        set_img: function () {
            
            if (this.pro_info.showImgUrl != '') {
                var imgUrl =  this.pro_info.showImgUrl;
                var parentStyle = $("#showImgUrl").parent().attr("style");
                $("#showImgUrl").parent().attr("style", parentStyle + ";background-image:url(" + imgUrl + ")");
                $("#showImgUrl").parent().removeClass("weui_uploader_input_wrp");
            }
        },
        editorInit: function () {
            UE.delEditor('myEditor');
            this.myEditor = UE.getEditor('myEditor', {
                serverUrl: HttpUtils.data.hostUrl + "/api/img/exe",
                elementPathEnabled: false,
                wordCount: false,
                toolbars: [
                    [
                        'bold', 'italic', 'underline', 'fontborder', '|', 'blockquote', 'superscript', 'subscript', 'insertunorderedlist', 'insertorderedlist', 'kityformula', , '|', 'justifyleft', //居左对齐
                        'justifyright', //居右对齐
                        'justifycenter', //居中对齐
                        'justifyjustify', //两端对齐
                        'forecolor', //字体颜色
                        'imagenone', //默认
                        'imageleft', //左浮动
                        'imageright' //右浮动
                    ]
                ],
                textarea: "description"
            });
            var _this = this;
            setTimeout(() => {
                _this.myEditor.setContent(_this.pro_info.content, false);
            }, 700);
        },
        save_pro_info: function (proStatus) {

            var imgs = [];
            var selectOneType = false;
            var selectTwoType = false;
            this.pro_info.showImgUrl = $("#showImgUrl").attr("data-img-name");
            this.pro_info.smallImgUrl = $("#smallImgUrl").attr("data-img-name");
            this.pro_info.imgs = imgs;
            this.pro_info.status = proStatus;
            this.pro_info.content = this.myEditor.getContent();

            var _this = this;
            HttpUtils.requestPost("/api/product/saveInfo", JSON.stringify(_this.pro_info), function (dataResult) {

                if (dataResult.status == 1000) {
                    alert("操作成功!");
                    _this.find_pro_info(dataResult.data);
                } else {
                    HttpUtils.showMessage("请填写完整的商品信息");
                }
            });
        },
        find_pro_info: function (proUUid) {

            var _this = this;
            var jsonData = {
                key: proUUid
            };
            HttpUtils.requestPost("/api/product/findInfo", JSON.stringify(jsonData), function (dataResult) {

                if (dataResult.status == 1000) {
                    _this.pro_info = dataResult.data;
                    _this.init();
                }
            });
        },
        init: function () {
            var _this = this;
            plus_sub_btn.initClient();

            $("[name='imgfile']").change(function () {
                imgUpload.uploadImg(this);
            });

            this.editorInit();
            this.set_img();
        }
    },
    mounted: function () {
        var href = location.href;
        var hrefs = href.split("=");
        var proUUId = hrefs.length == 2 ? hrefs[1] : '';
        if (proUUId != '') {
            this.find_pro_info(proUUId);
        } else {
            this.init();
        }
    }
});