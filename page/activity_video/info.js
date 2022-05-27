var page = new Vue({
    el: '#master_activity_video_info_div',
    data: {
        myEditor: null,
        one_type_datas: [],
        two_type_datas: [],
        pro_info: {
            testContent: "",
            title: "",
            videoUrl: "",
            watchTime: "15",
            testFileName: "",
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
            this.pro_info.testContent = $("#file").attr("data-file-name");
            this.pro_info.testFileName = $("#fileShow").val();
            this.pro_info.watchTime=$("#watchTime").val();
            this.pro_info.videoUrl=$("#videoUrl").val();
            this.pro_info.webPageUrl=$("#webPageUrl").val();
            this.pro_info.status = proStatus;

            var _this = this;
            HttpUtils.requestPost("/api/activity/video/info/save", JSON.stringify(_this.pro_info), function (dataResult) {

                if (dataResult.status == 1000) {
                   
                    $.toast("保存成功!");
                    router.push({path:'activity_video_list',query:{uuid:''}});
                } else {
                    HttpUtils.showMessage("请填写完整的活动信息");
                }
            });
        },
        find_pro_info: function (proUUid) {

            var _this = this;
            var jsonData = {
                id: proUUid
            };
            HttpUtils.requestPost("/api/activity/video/info", JSON.stringify(jsonData), function (dataResult) {

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
                imgUpload.ajax_upload_file_url(eleId,"/api/activity/video/file/upload",function(dataResult){
                    console.log(dataResult);
                    if(dataResult.status == 1000){
                        $("#"+eleId).attr("data-file-name",dataResult.data[0].imgName);
                        //$("#"+eleId).val(dataResult.data[0].originalFilename);
                        $("#fileShow").val(dataResult.data[0].originalFilename);
                    }else{
                        HttpUtils.showMessage("支持上传的文件格式：xlsx");
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