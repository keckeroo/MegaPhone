Ext.define("Att.ApiResults",{extend:"Ext.ActionSheet",xtype:"apiresults",config:{responseTpl:'<div class="header <tpl if="success == true">success<tpl else>failed</tpl>">Success: {success}</div><div>Server Response:<br/><span>{[JSON.stringify(values.response, null, "  ")]}<span></div>'},initialize:function(){this.resultPanel=Ext.create("Ext.Container",{tpl:this.getResponseTpl(),styleHtmlContent:true,style:"background: #fff",scrollable:"both",height:150});this.add([this.resultPanel,{xtype:"toolbar",docked:"top",title:"Response",items:[{xtype:"spacer"},{text:"Done",action:"close"}]}])},setData:function(b){var a,c;if(b&&b.results&&Ext.isObject(b.results)){a=b.results}else{a=JSON.parse(b.results)}c=(!b.success||!a||a.error||a.IsSuccess=="false"||a.requestError||a.RequestError||a.apiError)?false:true;this.resultPanel.setData({success:c,response:a});this.resultPanel.getScrollable().getScroller().scrollTo(0,0)}});