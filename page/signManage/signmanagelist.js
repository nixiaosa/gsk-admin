var page = new Vue({
    el: '#master_sign_manage_list_div',
    data: {
        userHost: '',
    },
    methods: {
        initData:function(){
            var _this = this;
            const href = window.location.href
            if (href.indexOf('.dev.') >= 0) {
                _this.userHost = 'https://gsk.test.100url.cn/' // 本地调试走代理
            } else if (href.indexOf('.test.') >= 0) {
                _this.userHost = 'https://gsk.test.100url.cn/'
            } else if (href.indexOf('localhost') >= 0 ){
                _this.userHost = ''
            } else if (href.indexOf('skyyh') >= 0 ){
                _this.userHost = 'https://skyyh.healthy-bone.com.cn/' // gsk生产
            } else {
                _this.userHost = 'https://healthy-bone.com.cn/'    // gsk测试
            }
            
        }
    },
    mounted: function () {
        var _this=this;
        this.initData();
    }
});