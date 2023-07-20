var page = new Vue({
    el: '#master_wxmaterial_create_div',
    data: {
        proUUId:'',
        myEditor: null,
        one_type_datas: [],
        two_type_datas: [],
        pro_info: {
            materialType:'gskpost',
            itemTitle: "",
            itemDigest: "",
            itemThumbUrl: "",
            htmlContent:"",
            uuid: "",
            itemUrl:"",
            status: 0,
            id:0
        },
        cate_datas:[
            {
                cateSlug:'',
                cateName:'请选择',
                select:true
            },
            {
                cateSlug:'shouyezonghe',
                cateName:'首页-综合',
                select:false
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
            },
            {
                cateSlug:'huanzhejiaoyu-1',
                cateName:'患者教育-牙敏感',
                select:false
            },{
                cateSlug:'huanzhejiaoyu-2',
                cateName:'患者教育-口腔正畸',
                select:false
            },{
                cateSlug:'huanzhejiaoyu-3',
                cateName:'患者教育-义齿护理',
                select:false
            },{
                cateSlug:'huanzhejiaoyu-4',
                cateName:'患者教育-义齿稳固',
                select:false
            },
            {
                cateSlug:'huanzhejiaoyu-5',
                cateName:'患者教育-常规口腔患教',
                select:false
            },
            {
                cateSlug:'huanzhejiaoyu-6',
                cateName:'患者教育-牙基会合作专区',
                select:false
            },
            {
                cateSlug:'jingyingguanli',
                cateName:'经营管理',
                select:false
            }
            // {
            //     cateSlug:'hangyezixun',
            //     cateName:'行业资讯',
            //     select:false
            // }
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
                imageMaxSize:2048000,
                toolbars: [
                    [
                        'bold', 'italic', 'underline', 'fontborder', 'blockquote', 'superscript', 'subscript', 'insertunorderedlist', 'insertorderedlist', 'kityformula', 'insertimage', '|', 'justifyleft', //居左对齐
                        'justifyright', //居右对齐
                        'justifycenter', //居中对齐
                        'justifyjustify', //两端对齐
                        'forecolor', //字体颜色
                        // 'imagenone', //默认
                        // 'imageleft', //左浮动
                        // 'imageright', //右浮动
                        'touppercase',//字母大写
                        // 'link',//超链接
                        'horizontal',//分割线
                        'removeformat',//清除格式
                        // 'unlink',//取消链接
                        // 'insertrow',//前叉入行
                        // 'insertcol', //前插入列
                        'spechars', //特殊字符
                        'justifyleft', //居左对齐
                        'backcolor', //背景色'backcolor', //背景色
                        'fullscreen', //全屏
                        'directionalityltr', //从左向右输入
                        'directionalityrtl', //从右向左输入
                        'rowspacingtop', //段前距
                        'rowspacingbottom', //段后距
                        'edittd', //单元格属性
                        'lineheight', //行间距
                        'charts', // 图表
                        // 'preview', //预览
                        // 'emotion', //表情
                        'time', //时间
                        'date', //日期
                        'cleardoc', //清空文档
                        'insertcode', //代码语言
                        'fontsize', //字号
                        'paragraph', //段落格式

                    ]
                ],
                textarea: "description"
            });
            var _this = this;
            setTimeout(() => {
                _this.myEditor.setContent(_this.pro_info.htmlContent, false);
            }, 700);
        },
        checking:function(){
            
            

        },
        lcEncode: function (str){
            // 对字符串进行编码
            var encode = encodeURI(str);
            // 对编码的字符串转化base64
            var base64 = btoa(encode);   //这一行就可以字符串转base64了
            return base64;
        },
        save_pro_info: function (proStatus) {
            this.pro_info.itemThumbUrl = $("#showImgUrl").attr("data-img-name");
            this.pro_info.status = proStatus;
            this.pro_info.cateSlug=$("#cateSlug").val();
            this.pro_info.cateName=this.get_cateName($("#cateSlug").val());
            // this.pro_info.htmlContent = this.myEditor.getContent();
            this.pro_info.htmlContent = this.lcEncode(this.myEditor.getContent());
            if(!this.pro_info.htmlContent) {
                HttpUtils.showMessage("输入内容不能为空");
                return;
            }
            if(this.pro_info.itemTitle == ''){
                HttpUtils.showMessage("标题不能为空");
                return;
            }
            if(this.pro_info.itemThumbUrl == ''){
                HttpUtils.showMessage("对外展示图片不能为空");
                return;
            }
            if(this.pro_info.itemDigest == ''){
                HttpUtils.showMessage("摘要不能为空");
                return;
            }
            if(this.pro_info.cateSlug == ''){
                HttpUtils.showMessage("文章类型不能为空");
                return;
            }
            if(this.proUUId == ""){
                delete this.pro_info.id
                delete this.pro_info.itemUrl
            }
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
    beforeRouteUpdate(to,from,next){
        alert('111')
        console.log(to,from,next)
        if(to.fullPath!=from.fullPath){
            next()
            
        }
    },
    mounted: function () {
        var href = location.href;
        var hrefs = href.split("=");
        this.proUUId = hrefs.length == 2 ? hrefs[1] : '';
        this.editorInit();
        if (this.proUUId != '') {
            this.find_pro_info(this.proUUId);
        } else {
            this.init();
        }
    }
});
$(document).ready(function(){
        
    var clipboard = new ClipboardJS('.copy');

    clipboard.on('success', function(e) {
        $.toast("复制成功!");
    });
})