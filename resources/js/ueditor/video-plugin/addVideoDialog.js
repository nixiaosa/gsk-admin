UE.registerUI('add-cmt-video',function(editor,uiName){
	//创建dialog
    var dialog = new UE.ui.Dialog({
        //指定弹出层中页面的路径，这里只能支持页面,因为跟addCustomizeDialog.js相同目录，所以无需加路径
        //iframeUrl:editor.options.UEDITOR_HOME_URL + 'postDialog/customizeDialogPage.html?'+new Date(),
    	iframeUrl:contextPath+"/media/iframe/select_more.do?type=5",
        //需要指定当前的编辑器实例
        editor:editor,
        //指定dialog的名字
        name:uiName,
        //dialog的标题
        title:"插入视频",
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

    
    var iconUrl = editor.options.UEDITOR_HOME_URL + 'video-plugin/icon.png';
    
    //参考addCustomizeButton.js
    var btn = new UE.ui.Button({
        name:'dialogbutton' + uiName,
        title:'插入视频',
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
    		if (/\b(prism-player)\b/.test(n.getAttr('class'))) {
    			var s = n.getAttr('data-cover');
    			var vid = n.getAttr('data-vid');
    			if(s){
    				var html = '<img src="'+editor.options.UEDITOR_HOME_URL+'/themes/default/images/spacer.gif" data-cover="'+s+'" data-vid="'+vid+'" class="prism-player"/>';
        			n.parentNode.replaceChild(UE.uNode.createElement(html),n);
    			}else{
    				n.parentNode.removeChild(n,true);
    			}
    		}
    	});
    });
    //从编辑器出去的内容
    editor.addOutputRule(function(node){
    	utils.each(node.getNodesByTagName('img'),function(n){
    		if (/\b(prism-player)\b/.test(n.getAttr('class'))) {
    			var coverImg = n.getAttr('data-cover');
    			var vid = n.getAttr('data-vid');
    			var html = '<div class="prism-player cmt-video" data-cover="'+coverImg+'" data-vid="'+vid+'" style="background-image:url('+coverImg+')"></div>';
    			n.parentNode.replaceChild(UE.uNode.createElement(html),n);
    		}
    	});
    });
    return btn;
},14);