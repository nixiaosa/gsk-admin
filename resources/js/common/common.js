var storage = {
    set(key, value) {
        if(value != null){
            value = encode(JSON.stringify(value));
        }
        localStorage.setItem(key, value);
    },
    get(key) {
        var value = localStorage.getItem(key);
        if(value != null && value != 'null'){
            value = decode(value);
            return JSON.parse(value);
        } else {
            return null;
        }
        
    },
    remove(key) {
        localStorage.removeItem(key);
    }
}
var cookies = {
    set(key, value, _path = '/') {
        var expdate = new Date();
        //设置Cookie过期日期
        expdate.setDate(expdate.getDate() + 5) ;
        console.log(value);
        //添加Cookie
        document.cookie = key + "=" + escape(value) + ";expires=" + expdate.toUTCString() + ';path=' + _path;
    },
    get(key) {
        //获取name在Cookie中起止位置
        var start = document.cookie.indexOf(key+"=");

        if ( start != -1 )
        {
            start = start + key.length + 1 ;
            //获取value的终止位置
            var end = document.cookie.indexOf(";", start) ;
            if ( end == -1 )
                end = document.cookie.length ;
            //截获cookie的value值,并返回
            return unescape(document.cookie.substring(start,end));
        }
        return '';
    },
    remove(key) {
        cookies.set( key, "");
    }
}
function encode(val){
    return CryptoJS.AES.encrypt(val, 'secret key 123').toString();
}
function decode(val){
    var bytes  = CryptoJS.AES.decrypt(val, 'secret key 123');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}
var login = {
    showLogin() {
       $("#login_div").show();
    },
    hideLogin() {
        $("#login_div").hide();
    },
    confimLog(mobile, password,captcha) {

        var json = {
            key: mobile,
            // authCode:captcha,
            value: password
        };
        HttpUtils.requestPost("/api/admin/login", JSON.stringify(json), function (dataResult) {
            if (dataResult.status == 1000) {
                if(dataResult.data.key != 'loginlock'){
                    storage.set("userInfo", {
                        //mobile: dataResult.data.key,
                        // token: dataResult.data.value,
                        funcs:dataResult.data.datas,
                        mobile: dataResult.data.key
                    });
                    cookies.set('cmtgsk',dataResult.data.value);
                    login.hideLogin();
                    window.location.reload();
                } else {
                    $("#login_tip").show();
                    $("#login_tip").text(dataResult.data.value);
                }
                
            } else {

                // if(dataResult.status == 1002){
                    $("#login_tip").show();
                    $("#login_tip").text(dataResult.data);
                // }
                //HttpUtils.showMessage("手机号或密码错误");
            }
        });
    }
}

var plus_sub_btn = {//加减操作
    initClient() {
        $('.weui-number-plus').click(function (event) {
            event.stopImmediatePropagation();
            plus_sub_btn.upDownOperation($(this));
        });
        $('.weui-number-sub').click(function (event) {
            event.stopImmediatePropagation();
            plus_sub_btn.upDownOperation($(this));
        });
    },
    upDownOperation(element) {
        var _input = element.parent().find('input'),
            _value = _input.val(),
            _step = _input.attr('data-step') || 1;
            _input.focus();
        //检测当前操作的元素是否有disabled，有则去除
        element.hasClass('disabled') && element.removeClass('disabled');
        //检测当前操作的元素是否是操作的添加按钮（.input-num-up）‘是’ 则为加操作，‘否’ 则为减操作
        if (element.hasClass('weui-number-plus')) {
            var _new_value = parseFloat(parseFloat(_value) + parseFloat(_step)),
                _max = _input.attr('data-max') || false,
                _down = element.parent().find('.weui-number-sub');

            //若执行‘加’操作且‘减’按钮存在class='disabled'的话，则移除‘减’操作按钮的class 'disabled'
            _down.hasClass('disabled') && _down.removeClass('disabled');
            if (_max && _new_value >= _max) {
                _new_value = _max;
                element.addClass('disabled');
            }
        } else {
            var _new_value = parseFloat(parseFloat(_value) - parseFloat(_step)),
                _min = _input.attr('data-min') || false,
                _up = element.parent().find('.weui-number-plus');
            //若执行‘减’操作且‘加’按钮存在class='disabled'的话，则移除‘加’操作按钮的class 'disabled'
            _up.hasClass('disabled') && _up.removeClass('disabled');
            if (_min && _new_value <= _min) {
                _new_value = _min;
                element.addClass('disabled');
            }
        }
        _input.val(_new_value);
        element.parent().find('input')[0].dispatchEvent(new Event('input'))
    }
}

// var getHostUrl = () =>{
//     var hostUrl;
//     const href = window.location.href
//     if (href.indexOf('localhost') >= 0 || (href.indexOf('.dev.')) >= 0) {
//         hostUrl = 'https://gsk.dev.100url.cn/yake.manage' // 本地调试走代理
//     } else if (href.indexOf('.test.') >= 0) {
//         hostUrl = 'https://gsk.test.100url.cn/yake.manage'
//     } else {
//         //hostUrl = 'https://api.cmalive.cn/'
//     }
//     return hostUrl;
// }

var getHostUrl = () =>{
let hostUrl = 'https://gsk-k8s.100url.cn/yake.manage';
  return hostUrl;
}

var HttpUtils = {
    data: {
        targetHostUrl: 'https://skyyh-dev.healthy-bone.com.cn/yake.manage/',
        //hostUrl:'https://yake.medtrib.cn/yake.manage'
        //hostUrl: 'https://gsk.dentalcmt.com/yake.manage'
        // hostUrl: 'https://skyyh.gsk.com/yake.manage',
        //hostUrl:'https://skyyh-dev.healthy-bone.com.cn/yake.manage',
        //hostUrl: 'https://localhost:8080/yake.manage'
        //hostUrl: 'https://gsk.dev.100url.cn/yake.manage',
        hostUrl: this.getHostUrl()
    },
    requestPost(url, jsonData, func) {
        var _this = this;
        var targetHostUrl = _this.data.targetHostUrl;
        var hostUrl = _this.data.hostUrl;
        // var tokenValue=storage.get("userInfo")==null?'':storage.get("userInfo").token;
        if (jsonData == null) {
            $.ajax({
                url: hostUrl + url,
                type: "POST",
                timeout: 10000, // 超时时间 10 秒
                headers: {
                    'data_url': targetHostUrl + url,
                    // 'token':tokenValue
                },
                async: false,
                dataType: "json",
                success: function(XMLHttpRequest){
                    if(XMLHttpRequest.status == 1008){
                        window.location.href= "http://"+window.location.host+"/yake.manage/page/index.html#/";
                    } else {
                        func(XMLHttpRequest);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                    if (XMLHttpRequest.status == 403) {
                        _this.showMessage("登录时间超时");
                        login.showLogin();
					    $('#loginName').val('');
                        storage.set("userInfo", null);
                        // window.location.href= "http://"+window.location.host+"/yake.manage/page/index.html#/";
                        window.location.href= "https://"+window.location.host+"/gsk-admin/#/";
		                return;
                    } else {

                        if (XMLHttpRequest.status == 413) {
                            _this.showMessage("无访问权限");
                        }else if(XMLHttpRequest.status == 204){
                            _this.showMessage("登录时间超时");
                            login.showLogin();
					        $('#loginName').val('');
                            storage.set("userInfo", null);
                            // window.location.href= "http://"+window.location.host+"/yake.manage/page/index.html#/";
                            window.location.href= "https://"+window.location.host+"/gsk-admin/#/";
		                    return;
                        } else {
                            _this.showMessage("请求错误");
                        }

                    }
                }
            });
        } else {
            $.ajax({
                url: hostUrl + url,
                data: jsonData,
                type: "POST",
                timeout: 10000, // 超时时间 10 秒
                headers: {
                    'data_url': targetHostUrl + url,
                    // 'token':tokenValue
                },
                async: false,
                dataType: "json",
                contentType: "application/json;charset=UTF-8",
                success: function(XMLHttpRequest){
                    if(XMLHttpRequest.status == 1008){
                        window.location.href= "https://"+window.location.host+"/yake.manage/page/index.html#/";
                    } else {
                        func(XMLHttpRequest);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                    if (XMLHttpRequest.status == 403) {
                        _this.showMessage("登录时间超时");
                        login.showLogin();
					    $('#loginName').val('');
                        storage.set("userInfo", null);
                        // window.location.href= "https://"+window.location.host+"/yake.manage/page/index.html#/";
                        window.location.href= "https://"+window.location.host+"/gsk-admin/#/";
		                return;
                    } else {

                        if (XMLHttpRequest.status == 413) {
                            _this.showMessage("无访问权限");
                        }else if(XMLHttpRequest.status == 204){
                            _this.showMessage("登录时间超时");
                            login.showLogin();
					        $('#loginName').val('');
                            storage.set("userInfo", null);
                            // window.location.href= "https://"+window.location.host+"/yake.manage/page/index.html#/";
                            window.location.href= "https://"+window.location.host+"/gsk-admin/#/";
		                    return;
                        } else {
                            _this.showMessage("请求错误");
                        }
                    }
                }
            });

        }
    },


    requestPost2(url, jsonData, func) {
        var _this = this;
        // var targetHostUrl = _this.data.targetHostUrl;
        // var tokenValue=storage.get("userInfo")==null?'':storage.get("userInfo").token;
        if (jsonData == null) {
            $.ajax({
                url: url,
                type: "POST",
                timeout: 10000, // 超时时间 10 秒
                headers: {
                    'data_url': url,
                    // 'token':tokenValue
                },
                async: false,
                dataType: "json",
                success: function(XMLHttpRequest){
                    if(XMLHttpRequest.status == 1008){
                        window.location.href= "http://"+window.location.host+"/yake.manage/page/index.html#/";
                    } else {
                        func(XMLHttpRequest);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                    if (XMLHttpRequest.status == 403) {
                        _this.showMessage("登录时间超时");
                        login.showLogin();
					    $('#loginName').val('');
                        storage.set("userInfo", null);
                        // window.location.href= "http://"+window.location.host+"/yake.manage/page/index.html#/";
                        window.location.href= "https://"+window.location.host+"/gsk-admin/#/";
		                return;
                    } else {

                        if (XMLHttpRequest.status == 413) {
                            _this.showMessage("无访问权限");
                        }else if(XMLHttpRequest.status == 204){
                            _this.showMessage("登录时间超时");
                            login.showLogin();
					        $('#loginName').val('');
                            storage.set("userInfo", null);
                            // window.location.href= "http://"+window.location.host+"/yake.manage/page/index.html#/";
                            window.location.href= "https://"+window.location.host+"/gsk-admin/#/";
		                    return;
                        } else {
                            _this.showMessage("请求错误");
                        }

                    }
                }
            });
        } else {
            $.ajax({
                url: url,
                data: jsonData,
                type: "POST",
                timeout: 10000, // 超时时间 10 秒
                headers: {
                    'data_url': url,
                    // 'token':tokenValue
                },
                async: false,
                dataType: "json",
                contentType: "application/json;charset=UTF-8",
                success: function(XMLHttpRequest){
                    if(XMLHttpRequest.status == 1008){
                        window.location.href= "https://"+window.location.host+"/yake.manage/page/index.html#/";
                    } else {
                        func(XMLHttpRequest);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                    if (XMLHttpRequest.status == 403) {
                        _this.showMessage("登录时间超时");
                        login.showLogin();
					    $('#loginName').val('');
                        storage.set("userInfo", null);
                        // window.location.href= "https://"+window.location.host+"/yake.manage/page/index.html#/";
                        window.location.href= "https://"+window.location.host+"/gsk-admin/#/";
		                return;
                    } else {

                        if (XMLHttpRequest.status == 413) {
                            _this.showMessage("无访问权限");
                        }else if(XMLHttpRequest.status == 204){
                            _this.showMessage("登录时间超时");
                            login.showLogin();
					        $('#loginName').val('');
                            storage.set("userInfo", null);
                            // window.location.href= "https://"+window.location.host+"/yake.manage/page/index.html#/";
                            window.location.href= "https://"+window.location.host+"/gsk-admin/#/";
		                    return;
                        } else {
                            _this.showMessage("请求错误");
                        }
                    }
                }
            });

        }
    },


    showMessage(msg) {
        //$.alert(msg, "提示");
        $.toptips(msg);
    },
    showMessageTitle(msg, title) {
        $.alert(msg, title);
    }
}