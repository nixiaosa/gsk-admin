var subscribeVue = new Vue({
    el: '#master_subscribe_div',
    data: {
        subscrive_array: [],
        pcar_sub_index: 1
    },
    methods: {
        cancelSubInfo: function (pcarId) {

            var _this=this;
            var data = {
                key: pcarId
            };

            HttpUtils.requestPost("api/pcar/cancelSubInfo", JSON.stringify(data), function (dataResult) {
                console.log(dataResult);
                if (dataResult.status == 1000) {
                    var arr = _this.subscrive_array;

                    for (var i = 0; i < arr.length; i++) {

                        if (arr[i].id == pcarId) {
                            arr.splice(i, 1);
                        }
                    }

                    _this.subscrive_array = arr;
                }
            });
        },
        load_pcar_sub_datas: function () {
            var _this = this;
            var pcar_sub_index = _this.pcar_sub_index;
            var wxOpenId = storage.get("userInfo").openid;

            var data = {
                key: pcar_sub_index,
                value: wxOpenId
            };

            HttpUtils.requestPost("api/pcar/findMySubInfos", JSON.stringify(data), function (dataResult) {
                console.log(dataResult);
                if (dataResult.status == 1000) {
                    var arr = _this.subscrive_array;
                    var length = dataResult.data.datas.length;
                    var pageIndex = dataResult.data.pageIndex;

                    for (var i = 0; i < length; i++) {
                        arr.push(dataResult.data.datas[i]);
                    }

                    _this.subscrive_array = arr;
                    _this.pcar_sub_index = pageIndex;
                }
            });
        }
    },
    mounted:function(){
        this.load_pcar_sub_datas();

        var _this = this;
		$(window).scroll(function () {　　
			var scrollTop = $(this).scrollTop();　　
			var scrollHeight = $(document).height();　　
			var windowHeight = $(this).height();　　
			if (scrollTop + windowHeight == scrollHeight) {　　　　 //alert("已经到最底部了！");
				　　
				_this.load_pcar_sub_datas();
			}
		});
    }
});