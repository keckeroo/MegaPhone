cordova.define("cordova/plugin/twitter",function(c,b,e){var a=c("cordova/exec");var d=function(){};d.prototype.isTwitterAvailable=function(h,g){if(typeof g!="function"){console.log("Twitter.scan failure: failure parameter not a function");return}if(typeof h!="function"){console.log("Twitter.scan failure: success callback parameter must be a function");return}cordova.exec(h,g,"Twitter","isTwitterAvailable",[])};d.prototype.composeTweet=function(j,h,i,g){if(typeof h!="function"){console.log("Twitter.scan failure: failure parameter not a function");return}if(typeof j!="function"){console.log("Twitter.scan failure: success callback parameter must be a function");return}cordova.exec(j,h,"Twitter","composeTweet",[i])};var f=new d();e.exports=f});if(!window.plugins){window.plugins={}}if(!window.plugins.twitter){window.plugins.twitter=cordova.require("cordova/plugin/twitter")};