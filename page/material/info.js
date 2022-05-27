var page = new Vue({
    el: '#master_material_info_div',
    data: {
        myEditor: null,
        one_type_datas: [],
        two_type_datas: [],
        pro_info: {
            content: "",
            title: "",
            excerpt: "",
            postLink: "",
            fileUrl: "",
            oldTitle: "",
            uuid: "",
            status: 0,
            id:0
        }
    },
    methods: {
        set_img: function () {
            
           
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
            this.pro_info.title=$("#tilte").val();
            this.pro_info.fileUrl = $("#file").attr("data-file-name");
            this.pro_info.oldTitle = $("#fileShow").val();
            this.pro_info.status = proStatus;

            var _this = this;
            HttpUtils.requestPost("/api/material/save", JSON.stringify(_this.pro_info), function (dataResult) {

                if (dataResult.status == 1000) {
                   
                    $.toast("保存成功!");
                    router.push({path:'material_list',query:{uuid:''}});
                } else {
                    HttpUtils.showMessage("请填写完整的资料信息");
                }
            });
        },
        find_pro_info: function (proUUid) {

            var _this = this;
            var jsonData = {
                key: proUUid
            };
            HttpUtils.requestPost("/api/material/info", JSON.stringify(jsonData), function (dataResult) {

                if (dataResult.status == 1000) {
                    _this.pro_info = dataResult.data;
                    _this.init();
                }
            });
        },
        init: function () {
            var _this = this;

            $("[name='file']").change(function () {
                
                var eleId=$(this).attr("id");
                console.log("upload");
                imgUpload.ajax_upload_file(eleId,function(dataResult){
                    console.log(dataResult);
                    if(dataResult.status == 1000){
                        $("#"+eleId).attr("data-file-name",dataResult.data[0].imgName);
                        //$("#"+eleId).val(dataResult.data[0].originalFilename);
                        $("#fileShow").val(dataResult.data[0].originalFilename);
                    }else{
                        HttpUtils.showMessage("支持上传的文件格式：doc、xlsx、pdf、png、jpg");
                    }

                    _this.init();
                    
                });
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