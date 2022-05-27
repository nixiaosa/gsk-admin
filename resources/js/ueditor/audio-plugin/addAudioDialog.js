UE.registerUI('add-cmt-audio',function(editor,uiName){
    //创建dialog
    var dialog = new UE.ui.Dialog({
        //指定弹出层中页面的路径，这里只能支持页面,因为跟addCustomizeDialog.js相同目录，所以无需加路径
        //iframeUrl:editor.options.UEDITOR_HOME_URL + 'postDialog/customizeDialogPage.html?'+new Date(),
        iframeUrl:contextPath+"/media/iframe/select_more.do?type=6",
        //需要指定当前的编辑器实例
        editor:editor,
        //指定dialog的名字
        name:uiName,
        //dialog的标题
        title:"插入音频",
        //指定dialog的外围样式
        cssRules:"width:550px;height:490px;",

        //如果给出了buttons就代表dialog有确定和取消
        buttons:[
            {
                className:'edui-okbutton',
                label:'确定',
                onclick:function () {
                    dialog.close(true);
                }
            },
            {
                className:'edui-cancelbutton',
                label:'取消',
                onclick:function () {
                    dialog.close(false);
                }
            }
        ]});


    var iconUrl = editor.options.UEDITOR_HOME_URL + 'audio-plugin/icon.png';

    //参考addCustomizeButton.js
    var btn = new UE.ui.Button({
        name:'dialogbutton' + uiName,
        title:'插入音频',
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'background: url("' + iconUrl + '") !important',
        onclick:function () {
            //渲染dialog
            dialog.render();
            dialog.open();
        }
    });

    utils = UE.utils
    editor.addInputRule(function(node){
        utils.each(node.getNodesByTagName('div'),function(n){
            if (/\b(cmt-audio)\b/.test(n.getAttr('class'))) {
                var id = n.getAttr('data-id');
                var html = '<img src="https://image.medtrib.cn/image/post/picture/4925/9aadb8b7-a805-459b-893b-2a5c52ae1c37.png" controls preload="none" data-id="'+id+'" class="cmt_audio" />'
                n.parentNode.replaceChild(UE.uNode.createElement(html),n);
                /*if(s){
                 var html = '<img src="'+editor.options.UEDITOR_HOME_URL+'/themes/default/images/spacer.gif" data-cover="'+s+'" data-vid="'+vid+'" class="prism-player"/>';
                 n.parentNode.replaceChild(UE.uNode.createElement(html),n);
                 }else{
                 n.parentNode.removeChild(n,true);
                 }*/
            }
        });
    });
    //从编辑器出去的内容
    editor.addOutputRule(function(node){
        utils.each(node.getNodesByTagName('img'),function(n){
            if (/\b(cmt_audio)\b/.test(n.getAttr('class'))) {
                var id = n.getAttr('data-id');
                // var html = '<div class="cmt-audio" data-id="'+id+'"><audio src="'+id.split("_")[2]+'" controls preload="meta" data-id="'+id.split("_")[1]+'"></audio><div class="audio_cnt"><div class="audio_ctrl audio_play audioPlayer"></div><div class="audio_title"><div class="audio-right"><marquee scrollamount="2" direction="left" height="30">'+id.split("_")[0]+'</marquee><div class="progress-bar-bg" id="progressBarBg"><span class="progressDot"></span><div class="progress-bar" id="progressBar"></div></div><div class="audio-time"><span class="audio-length-current audioCurTime"></span><span class="audio-length-total audioAllTime"></span></div></div></div></div></div>';
                var html='<div class="cmt-audio" data-id="'+id+'"><marquee scrollamount="2" direction="left">'+id.split("_")[0]+'</marquee><audio src="'+id.split("_")[2]+'" preload="auto" controls data-id="'+id.split("_")[1]+'"></audio></div>'
                n.parentNode.replaceChild(UE.uNode.createElement(html),n);
            }
        });
    });
    return btn;
},14);