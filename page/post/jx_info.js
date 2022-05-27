var page = new Vue({
    el: '#master_post_jx_info_div',
    data: {
        myEditor: null,
        one_type_datas: [],
        two_type_datas: [],
        pro_info: {
            content: "",
            title: "",
            excerpt: "",
            postLink: "",
            showImgUrl: "",
            smallImgUrl: "",
            sourceGoodsAddress: "",
            twoTypes: [{
                isAdd: false,
                name: "",
                uuid: ""
            }],
            uuid: "",
            status: 0,
            id:0
        }
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
                        'bold', 'italic', 'underline', 'fontborder', '|', 'blockquote', 'superscript', 'subscript', 'insertunorderedlist', 'insertorderedlist', 'kityformula', 'insertimage', '|', 'justifyleft', //居左对齐
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
            this.pro_info.showImgUrl = $("#showImgUrl").attr("data-img-name");
            this.pro_info.smallImgUrl = $("#smallImgUrl").attr("data-img-name");
            this.pro_info.imgs = imgs;
            this.pro_info.status = proStatus;

            var _this = this;
            HttpUtils.requestPost("/api/live/post_save", JSON.stringify(_this.pro_info), function (dataResult) {

                if (dataResult.status == 1000) {
                    _this.find_pro_info(dataResult.data);
                    $.toast("保存成功!");
                    router.push({path:'post_jx_list',query:{uuid:''}});
                } else {
                    HttpUtils.showMessage("请填写完整的文章信息");
                }
            });
        },
        find_pro_info: function (proUUid) {

            var _this = this;
            var jsonData = {
                key: proUUid
            };
            HttpUtils.requestPost("/api/live/info", JSON.stringify(jsonData), function (dataResult) {

                if (dataResult.status == 1000) {
                    _this.pro_info = dataResult.data;
                    _this.init();
                }
            });
        },
        init: function () {
            var _this = this;

            $("[name='imgfile']").change(function () {
                imgUpload.uploadImg(this);
            });

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