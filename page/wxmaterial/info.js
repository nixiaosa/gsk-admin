var page = new Vue({
    el: '#master_wxmaterial_info_div',
    data: {
        myEditor: null,
        one_type_datas: [],
        two_type_datas: [],
        pro_info: {
            itemTitle: "",
            itemDigest: "",
            itemThumbUrl: "",
            itemUrl:'',
            uuid: "",
            status: 0,
            id:0
        },
        cate_datas:[
            {
                cateSlug:'all',
                cateName:'全部',
                select:true
            },
            {
                cateSlug:'yamingan',
                cateName:'牙敏感',
                select:false
            },
            {
                cateSlug:'kouqiangzhengji',
                cateName:'口腔正畸',
                select:false
            },
            {
                cateSlug:'ertongkouqiang',
                cateName:'牙体牙髓',
                select:false
            },
            {
                cateSlug:'yayishenghuo',
                cateName:'口腔黏膜',
                select:false
            },
            {
                cateSlug:'huanjiaokepu',
                cateName:'牙槽外科',
                select:false
            },
            {
                cateSlug:'kouqiangxiufu',
                cateName:'口腔修复',
                select:false
            },
            {
                cateSlug:'yazhoujibing',
                cateName:'牙周疾病',
                select:false
            },
            {
                cateSlug:'kouqiangzhongzhi',
                cateName:'口腔种植',
                select:false
            },
            {
                cateSlug:'kouqiangyufang',
                cateName:'口腔预防',
                select:false
            },{
                cateSlug:'huanzhejiaoyu',
                cateName:'患者教育',
                select:false
            },{
                cateSlug:'jingyingguanli',
                cateName:'经营管理',
                select:false
            },{
                cateSlug:'hangyezixun',
                cateName:'行业资讯',
                select:false
            }
        ]
    },
    methods: {

        selcet_cate_fun:function(event){
            var obj = event.currentTarget;
            var currValue=$(obj).val();

            for (var i = 0; i < this.cate_datas.length; i++) {

                if(this.cate_datas[i].cateSlug==currValue){
                    this.cate_datas[i].select = true;
                }else{
                    this.cate_datas[i].select = false;
                }
            }
        },
        set_img: function () {
            
            if (this.pro_info.itemThumbUrl != '') {
                var imgUrl =  this.pro_info.itemThumbUrl;
                var parentStyle = $("#showImgUrl").parent().attr("style");
                $("#showImgUrl").parent().attr("style", parentStyle + ";background-image:url(" + imgUrl + ")");
                $("#showImgUrl").parent().removeClass("weui_uploader_input_wrp");
            }
        },
        set_cate:function(){

            for (var i = 0; i < this.cate_datas.length; i++) {

                if(this.cate_datas[i].cateSlug==this.pro_info.cateSlug){
                    this.cate_datas[i].select = true;
                }else{
                    this.cate_datas[i].select = false;
                }
            }
        },
        get_cateName:function(cateSlug){

            for (var i = 0; i < this.cate_datas.length; i++) {

                if(this.cate_datas[i].cateSlug==cateSlug){
                    return this.cate_datas[i].cateName;
                }
            }

            return "";
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

            this.pro_info.itemThumbUrl = $("#showImgUrl").attr("data-img-name");
            this.pro_info.status = proStatus;
            this.pro_info.cateSlug=$("#cateSlug").val();
            this.pro_info.cateName=this.get_cateName($("#cateSlug").val());

            var _this = this;
            HttpUtils.requestPost("/api/wxmaterial/save", JSON.stringify(_this.pro_info), function (dataResult) {

                if (dataResult.status == 1000) {
                    
                    $.toast("保存成功!");
                    router.push({path:'wxmaterial_list',query:{uuid:''}});
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
            HttpUtils.requestPost("/api/wxmaterial/info", JSON.stringify(jsonData), function (dataResult) {

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
            this.set_cate();
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

