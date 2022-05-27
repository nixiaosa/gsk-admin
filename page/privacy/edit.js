var page = new Vue({
    el: '#master_privacy_edit_div',
    data: {
        proUUId:'',
        myEditor: null,
    },
    methods: {
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
                _this.myEditor.setContent(router.currentRoute.query.content, false);
            }, 700);
        },
        save_info: function () {
            var title = $('#title').val();
            var version = $("#version").val();
            var linkUrl = $("#linkUrl").val();
            var content = this.myEditor.getContent();
            var jsonData = {
                version:version,
                link:linkUrl,
                title:title,
                content:content,
                id:this.proUUId
            };
            HttpUtils.requestPost("/api/admin/saveps", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {
                    $.toast("保存成功!");
                    router.push({path:'privacy_list'});
                } else {
                    HttpUtils.showMessage(dataResult.data);
                }
            });
        },
        get_info:function(uuid){
            HttpUtils.requestPost("/api/admin/saveps", null, function (dataResult) {
                if (dataResult.status == 1000) {
                    var info = dataResult.data;
                    $("#version").val(info.version);
                    $("#linkUrl").val(info.link);
                    $('#title').val(info.title);
                } else {
                    HttpUtils.showMessage(dataResult.data);
                }
            });
        }
    },
    mounted: function () {
        var href = location.href;
        this.editorInit();
        if(href.indexOf('uuid') != -1){
            this.proUUId = router.currentRoute.query.uuid;
            $("#version").val(router.currentRoute.query.version);
            $("#linkUrl").val(router.currentRoute.query.link);
            $('#title').val(router.currentRoute.query.title);
            
        }
        
        
    }
});