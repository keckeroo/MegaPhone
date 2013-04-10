Ext.define("Att.Provider",{requires:["Ext.JSON","Ext.Ajax","Ext.direct.Manager","Att.AuthorizationSheet","Ext.direct.RemotingProvider","Ext.direct.RemotingEvent"],config:{authScope:"TL,MOBO,MIM",apiBasePath:"att"},statics:{isValidPhoneNumber:function(a){return(/^(1?([ -]?\(?\d{3})\)?[ -]?)?(\d{3})([ -]?\d{4})$/).test(a)},isValidEmail:function(a){return(/^[a-zA-Z]\w+(.\w+)*@\w+(.[0-9a-zA-Z]+)*.[a-zA-Z]{2,4}$/i).test(a)},isValidShortCode:function(a){return(/^\d{3,8}$/).test(a)},isValidAddress:function(a){return Att.Provider.isValidPhoneNumber(a)||Att.Provider.isValidEmail(a)||Att.Provider.isValidShortCode(a)},normalizePhoneNumber:function(a){a=a.toString();return a.replace(/[^\d]/g,"")},normalizeAddress:function(a){a=a.toString();if(Att.Provider.isValidPhoneNumber(a)){a=Att.Provider.normalizePhoneNumber(a)}return a},getContentSrc:function(a,b){return"/att/content?messageId="+a+"&partNumber="+b}},constructor:function(a){this.initConfig(a);Ext.direct.Manager.addProvider({type:"remoting",enableBuffer:false,url:this.getApiBasePath()+"/direct_router",actions:{ServiceProvider:[{name:"oauthUrl",len:1},{name:"deviceInfo",len:1},{name:"deviceLocation",len:3},{name:"sendSms",len:2},{name:"smsStatus",len:1},{name:"receiveSms",len:1},{name:"sendMms",len:4},{name:"mmsStatus",len:1},{name:"wapPush",len:2},{name:"requestChargeAuth",len:2},{name:"transactionStatus",len:2},{name:"subscriptionStatus",len:2},{name:"refundTransaction",len:2},{name:"commitTransaction",len:2},{name:"subscriptionDetails",len:2},{name:"signPayload",len:1},{name:"sendMobo",len:5},{name:"getMessageHeaders",len:2},{name:"speechToText",len:2},{name:"tropoSession",len:2},{name:"getAd",len:2}]},namespace:"Att"})},isAuthorized:function(a){Ext.Ajax.request({url:this.getApiBasePath()+"/check?scope="+(a.authScope||this.getAuthScope()),method:"GET",success:function(b){var c=Ext.JSON.decode(b.responseText);if(c.authorized){if(a.success){a.success.call(a.scope||this)}}else{if(a.failure){a.failure.call(a.scope||this)}}},failure:function(){if(a.failure){a.failure.call(a.scope||this)}}})},authorizeApp:function(b){var e=this,a=b.success,f=b.failure,d=b.scope,c;c=Ext.create("Att.AuthorizationSheet",{listeners:{message:function(g){c.hide();var h=Ext.JSON.decode(g),i=h.success;if(i&&a){a.call(d||e,h)}else{if(!i&&f){f.call(d||e,h)}}}}});Ext.Viewport.add(c);c.show();e.getAuthorizationUrl({authScope:b.authScope,success:function(g){c.setSrc(g)}})},requestPaidSubscription:function(a){Ext.applyIf(a,{type:"SUBSCRIPTION"});this.requestPayment(a)},requestPayment:function(b){var e=this,a=b.success,f=b.failure,d=b.scope,c;Ext.applyIf(b,{type:"SINGLEPAY"});Ext.apply(b,{success:function(g){if(g.adviceOfChargeUrl){c.setSrc(g.adviceOfChargeUrl)}},failure:function(g){c.hide();if(f){f.call(d||e,g)}}});c=Ext.create("Att.AuthorizationSheet",{listeners:{message:function(g){c.hide();var h=Ext.JSON.decode(g),i=h.success;if(i&&a){a.call(d||e,h)}else{if(!i&&f){f.call(d||e,h)}}}}});Ext.Viewport.add(c);c.show();e.doApiCall("requestChargeAuth",[b.type,b.paymentOptions],b)},getSubscriptionStatus:function(a){this.doApiCall("subscriptionStatus",[a.codeType,a.transactionId],a)},getSubscriptionDetails:function(a){this.doApiCall("subscriptionDetails",[a.merchantSubscriptionId,a.consumerId],a)},getTransactionStatus:function(a){this.doApiCall("transactionStatus",[a.codeType,a.transactionId],a)},refundTransaction:function(a){a.refundOptions.TransactionOperationStatus="Refunded";this.doApiCall("refundTransaction",[a.transactionId,a.refundOptions],a)},commitTransaction:function(a){a.commitOptions.TransactionOperationStatus="Charged";this.doApiCall("commitTransaction",[a.transactionId,a.commitOptions],a)},signPayload:function(a){this.doApiCall("signPayload",[a.payload],a)},getAuthorizationUrl:function(a){this.doApiCall("oauthUrl",[a.authScope||this.getAuthScope()],a)},getDeviceLocation:function(a){Ext.applyIf(a,{requestedAccuracy:100,acceptableAccuracy:10000,tolerance:"DelayTolerant"});this.doApiCall("deviceLocation",[a.requestedAccuracy,a.acceptableAccuracy,a.tolerance],a)},sendSms:function(a){this.doApiCall("sendSms",[a.address,a.message],a)},getSmsStatus:function(a){this.doApiCall("smsStatus",[a.smsId],a)},receiveSms:function(a){this.doApiCall("receiveSms",[a.registrationId],a)},sendMms:function(a){Ext.applyIf(a,{priority:"Normal"});this.doApiCall("sendMms",[a.address,a.fileId,a.message,a.priority],a)},getMmsStatus:function(a){this.doApiCall("mmsStatus",[a.mmsId],a)},wapPush:function(a){this.doApiCall("wapPush",[a.address,a.message],a)},getMessageHeaders:function(a){this.doApiCall("getMessageHeaders",[a.headerCount,a.indexCursor],a)},sendMobo:function(a){this.doApiCall("sendMobo",[a.address,a.message,a.subject,a.group,a.files],a)},speechToText:function(a){this.doApiCall("speechToText",[a.fileName,a.streamed],a)},tropoSession:function(a){this.doApiCall("tropoSession",[a.parameters],a)},getAd:function(a){this.doApiCall("getAd",[a.udid,a.parameters],a)},doApiCall:function(g,c,b){var e=this,a=b.success,f=b.failure,d=b.scope;if(!Att.ServiceProvider[g]){console.warn("Calling a non existing API on Att.Provider")}else{Att.ServiceProvider[g].apply(Att.ServiceProvider,c.concat([function(h,k){if(k.getStatus()===true){if(a){a.call(d||e,h)}}else{if(f){var j=k.getError(),l=k.getXhr(),i={xhrError:{status:"500",statusText:"Internal Server Error"}};if(j){f.call(d||e,j)}else{if(l){i={xhrError:{status:l.status,statusText:l.statusText}}}f.call(d||e,i)}}}}]))}}});