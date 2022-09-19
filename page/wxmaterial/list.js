var page = new Vue({
    el: '#master_wxmaterial_list_div',
    data: {
        product_datas: [{
            itemTitle: '',
            cateName: '',
            itemAuthor:'',
            statusName: '待上架',
            updateTimeStr:'2018-09-03 12:23:12'
        }],
        source:[
            {
                materialType:'',
                name:'全部',
                select:true
                
            },
            {
                materialType:'news',
                name:'公众号',
                select:false
            },
            {
                materialType:'gskpost',
                name:'小程序',
                select:false

            }
        ],
        cate_datas:[
            {
                cateSlug:'all',
                cateName:'全部',
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
        ],
        pageIndex:0
    },
    methods:{
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
        search_pro:function(isSearch){
            var _this=this;
            if(isSearch){
                _this.pageIndex=0;
                _this.product_datas=[];
            }

            var name=$("#proName").val();
            var cateSlug=$("#cateSlug").val();
            var proSatus=$("#proSatus").val();
            var materialType = $("#materialType").val();
            var status=[];

            var jsonData={name:name,slug:cateSlug,status:status,materialType:materialType,pageIndex:_this.pageIndex,value:proSatus};
            HttpUtils.requestPost("/api/wxmaterial/list",JSON.stringify(jsonData),function(dataResult){
                if(dataResult.status==1000){
                    if(isSearch){
                        _this.product_datas=dataResult.data;
                    }else{
                        if(dataResult.data!=null){
                            for(var i=0;i<dataResult.data.length;i++){
                                _this.product_datas.push(dataResult.data[i]);
                            }
                        }
                    }
                    
                    _this.pageIndex=_this.pageIndex+1;
                }
            });
        },
        export_datas:function(){

            var name=$("#proName").val();
            var cateSlug=$("#cateSlug").val();
            var proSatus=$("#proSatus").val();
            var materialType = $("#materialType").val();
            // var tokenValue=storage.get("userInfo")==null?'':storage.get("userInfo").token;
            window.location.href=HttpUtils.data.hostUrl+"/api/wxmaterial/exportInfos?name="+name+"&slug="+cateSlug+"&value="+proSatus+"&materialType="+materialType;
        },
        save_pro_status:function(index,event){
            var obj = event.currentTarget;
            var _this=this;
            var oldStatus=this.product_datas[index].status;
            var uuid=this.product_datas[index].id;
            var newStatus=oldStatus==0||oldStatus==2?1:0;

            var jsonData={key:uuid,value:newStatus};
            HttpUtils.requestPost("/api/wxmaterial/saveStatus",JSON.stringify(jsonData),function(dataResult){
                if(dataResult.status==1000){
                    _this.product_datas[index].status=newStatus;
                    _this.product_datas[index].statusName=newStatus==1?'已发布':'已下线';
                    $.toast("操作成功!");
                }
            });
        },
        link_pro_detail:function(index){
            var uuid=this.product_datas[index].id;
            if(this.product_datas[index].materialType != undefined && this.product_datas[index].materialType == 'news'){
                router.push({path:'wxmaterial_info',query:{uuid:uuid}});
            }
            if(this.product_datas[index].materialType != undefined && this.product_datas[index].materialType == 'gskpost'){
                router.push({path:'wxmaterial_create',query:{uuid:uuid}});
            }
            
        }
    },
    mounted: function () {
        var _this=this;
        this.search_pro(true);

        $(window).scroll(function () {
			var scrollTop = $(this).scrollTop();
			var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            var href=location.href;
			if (scrollTop + windowHeight >= scrollHeight) {
                
                if(href.indexOf("wxmaterial_list")>0){
                    _this.search_pro(false);
                }//alert("已经到最底部了！");　
				
			}
		});
    }
});
$(document).ready(function(){
        
    var clipboard = new ClipboardJS('.copy');

    clipboard.on('success', function(e) {
        $.toast("复制成功!");
    });
})