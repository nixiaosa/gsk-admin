var page = new Vue({
    el: '#master_home_config_info_div',
    data: {
        product_datas: [],
        pageIndex: 0,
        pro_select_input_obj: null
    },
    methods: {
        cancel_pro_select_fun: function () {
            $(".pop").hide();
        },
        save_setting_data: function () {

            var _this=this;
            var settingDatas = [];

            $("[name='lunbo_li']").each(function () {
                var imgUrl = $(this).find("[name='imgfile']").attr("data-img-name");
                var linkUrl = $(this).find(":text").val();
                if (imgUrl != null && imgUrl != '') {
                    settingDatas.push({
                        id: $(this).attr("data-id"),
                        type: 1,
                        seqNumber: $(this).attr("data-img-seq-number"),
                        imgUrl: imgUrl,
                        linkUrl: linkUrl
                    });
                }
            });

            $("[name='banner_li']").each(function () {
                var imgUrl = $(this).find("[name='imgfile']").attr("data-img-name");
                var linkUrl = $(this).find(":text").attr("placeholder");
                if (imgUrl != null && imgUrl != '') {
                    settingDatas.push({
                        id: $(this).attr("data-id"),
                        type: 2,
                        seqNumber: $(this).attr("data-img-seq-number"),
                        imgUrl: imgUrl,
                        linkUrl: linkUrl
                    });
                }
            });

            HttpUtils.requestPost("/api/homepage/saveSetting", JSON.stringify(settingDatas), function (dataResult) {
                if (dataResult.status == 1000) {
                    $.toast("保存成功!");
                    setTimeout(() => {
                        _this.init_data();
                    }, 200);
                } else {
                    HttpUtils.showMessage(dataResult.data);
                }
            });
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
                        console.log(JSON.stringify(dataResult.data));
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

            var imgUrl =  showImgUrl;
            var parentStyle = $(this.pro_select_input_obj).parent().attr("style");
            $(this.pro_select_input_obj).parent().attr("style", parentStyle + ";background-image:url(" + imgUrl + ")");
        },
        init_data: function () {

            HttpUtils.requestPost("/api/homepage/findSettings", null, function (dataResult) {
                if (dataResult.status == 1000) {

                    for(var i=0;i<dataResult.data.length;i++){

                        var info=dataResult.data[i];
                        if(info.type==1){
                            $("[name='lunbo_li']").each(function () {
                                if($(this).attr("data-img-seq-number")==info.seqNumber){
                                    var imgUrl =  info.imgUrl;
                                    var parentStyle = $(this).attr("style");
                                    $(this).attr("style", parentStyle + ";background-image:url(" + imgUrl + ")");
                                    $(this).attr("data-id",info.id);
                                    $(this).find("[name='imgfile']").attr("data-img-name",info.imgUrl);
                                    $(this).find(":text").val(info.linkUrl);
                                }
                            });
                        }

                        if(info.type==2){
                            $("[name='banner_li']").each(function () {
                                if($(this).attr("data-img-seq-number")==info.seqNumber){
                                    var imgUrl =  info.imgUrl;
                                    var parentStyle = $(this).attr("style");
                                    $(this).attr("style", parentStyle + ";background-image:url(" + imgUrl + ")");
                                    $(this).attr("data-id",info.id);
                                    $(this).find("[name='imgfile']").attr("data-img-name",info.imgUrl);
                                    $(this).find(":text").val(info.linkUrl);
                                }
                            });
                        }
                    }
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

        _this.init_data();
    }
});