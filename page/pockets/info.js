var page = new Vue({
    el: '#master_pocket_info_div',
    data: {
        product_datas: [],
        pageIndex: 0,
        pro_select_input_obj: null
    },
    methods: {
        cancel_pro_select_fun: function () {
            $(".pop").hide();
        },
        config_select_pro: function () {

            $(".pop").hide();

            if ($(":checked").length == 0) {
                HttpUtils.showMessage("请选择商品");
                return;
            }

            var index = $(":checked").attr("data-pro-index");
            console.log(index);
            var proUuid = this.product_datas[index].uuid;
            var showImgUrl = this.product_datas[index].showImgUrl;

            $(this.pro_select_input_obj).attr("data-pro-uuid", proUuid);
            $(this.pro_select_input_obj).parent().find("p").text(this.product_datas[index].name);

            var imgUrl = showImgUrl;
            var parentStyle = $(this.pro_select_input_obj).parent().attr("style");
            $(this.pro_select_input_obj).parent().attr("style", parentStyle + ";background-image:url(" + imgUrl + ")");
        },
        search_pro: function (isSearch) {
            var _this = this;
            if (isSearch) {
                _this.pageIndex = 0;
                _this.product_datas = [];
            }

            var name = $("#proName").val();
            var status = [1];

            var jsonData = {
                name: name,
                status: status,
                pageIndex: _this.pageIndex
            };
            HttpUtils.requestPost("/api/product/findPros", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {
                    if (isSearch) {
                        _this.product_datas = dataResult.data;
                    } else {
                        if (dataResult.data != null) {
                            for (var i = 0; i < dataResult.data.length; i++) {
                                _this.product_datas.push(dataResult.data[i]);
                            }
                        }
                    }

                    _this.pageIndex = _this.pageIndex + 1;
                }
            });
        },
        save_pocket_data: function () {

            var content=$("#pocket_content").val();
            var imgs=[];
            var proUuid=$("[name='repro_li']").find("input").attr("data-pro-uuid");
            $("[name='lunbo_li']").find("input").each(function(){
                var value=$(this).attr("data-img-name");
                if(value!=undefined){
                    imgs.push(value);
                }
                
            });
            
            if((content==""||content.length==0)&&imgs.length==0){
                HttpUtils.showMessage("请填写动态内容或上传动态图片");
                return;
            }

            var jsonData={key:content,value:proUuid,datas:imgs};
            HttpUtils.requestPost("/api/pocket/addCircleInfo", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {
                    $.toast("发布成功");
                    setTimeout(() => {
                        location.reload();
                    }, 200);
                }else{
                    HttpUtils.showMessage(dataResult.data);
                }
            });
        }
    },
    mounted: function () {
        var _this = this;
        $("[name='imgfile']").change(function () {
            imgUpload.uploadImg(this);
        });

        $("[name='pro_select']").click(function () {
            _this.pro_select_input_obj = this;
            _this.search_pro(true);
            $(".pop").show();
        });
    }
});