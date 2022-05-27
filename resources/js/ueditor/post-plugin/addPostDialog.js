UE.registerUI('add-cmt-post',function(editor,uiName){
    var dialog = new UE.ui.Dialog({
    	iframeUrl:contextPath+"/media/iframe/select_more.do",
        editor:editor,
        name:uiName,
        title:"插入更多",
        cssRules:"width:550px;height:490px;",
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

    
    var iconUrl = editor.options.UEDITOR_HOME_URL + 'post-plugin/icon.png';
    
    var btn = new UE.ui.Button({
        name:'dialogbutton' + uiName,
        title:'插入更多',
        cssRules :'background: url("' + iconUrl + '") !important',
        onclick:function () {
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