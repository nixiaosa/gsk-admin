var page = new Vue({
    el: '#master_admin_edit_div',
    data: {
        uuid: ''
    },
    methods: {

        save_info: function () {

            var mobile = $("#mobile").val();
            var roleUuid = $(":checked").val();
//            var password = $("#password_div").find("input").val();
//            var confirmPassword = $("#confim_password_div").find("input").val();
            var aliPayUrl = $("#alipayurl").attr("data-img-name");
            var wxPayUrl = $("#wxpayurl").attr("data-img-name");
            var wxServiceUrl = $("#wxserviceurl").attr("data-img-name");

            var href=location.href;
            var hrefs=href.split("=");
            var uuid =hrefs.length==2?hrefs[1]:'';
//            if(uuid == ""){
//                var reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,20}$/;
//                if (password === '') {
//                    HttpUtils.showMessage('请输入密码');
//                    return
//                }
//                if (!reg.test(password)) {
//                    HttpUtils.showMessage('密码为8-20位，字母大小写，数字，特殊字符，至少包含三种');
//                    return
//                }
//                if(confirmPassword != password){
//                    HttpUtils.showMessage('两次输入密码不一致！');
//                    return
//                }
//            }


            var jsonData = {
                uuid: this.uuid,
                loginName: mobile,
                password: '1234qwer!G',
                confirmPassword: '1234qwer!G',
                aliPayUrl: aliPayUrl,
                wxPayUrl: wxPayUrl,
                wxServiceUrl: wxServiceUrl,
                roleUuid:roleUuid
            };

            HttpUtils.requestPost("/api/admin/saveInfo", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {
                    $.toast("保存成功!");
                    router.push({
                        path: 'admin_list',
                        query: {
                            uuid: ''
                        }
                    });
                } else {
                    HttpUtils.showMessage(dataResult.data);
                }
            });
        },
        find_info:function(uuid){

            this.uuid=uuid;
            var jsonData={key:uuid};
            HttpUtils.requestPost("/api/admin/findInfo", JSON.stringify(jsonData), function (dataResult) {
                if (dataResult.status == 1000) {
                    var info=dataResult.data;
                    $("#mobile").val(info.loginName);
                    $(":radio").each(function(){
                        if($(this).val()==info.roleUuid){
                            $(this).attr("checked","checked");
                        }
                    });
                } else {
                    HttpUtils.showMessage(dataResult.data);
                }
            });
        }
    },
    mounted: function () {
        $("[name='imgfile']").change(function () {
            imgUpload.uploadImg(this);
        });

        var href=location.href;
        var hrefs=href.split("=");
        var uuid =hrefs.length==2?hrefs[1]:'';

        if(uuid!=''){
            this.find_info(uuid);
        }else{
            $("#password_div").show();
            $("#confim_password_div").show();
        }
    }
});
