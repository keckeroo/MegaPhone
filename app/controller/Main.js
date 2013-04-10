Ext.define('AttSpeech.controller.Main', {
    extend : 'Ext.app.Controller',

    requires : [
        'Att.Phonegap',
        'Att.ApiResults',
        'Ext.MessageBox'
    ],

    config : {
        phonegap: undefined,
        facebook: undefined,
        fileSystem: undefined,
        capturing: false,
        recInterval: undefined,

        refs : {
            view : 'speech-view',
            responseView: {
                xtype: 'apiresults',
                selector: 'apiresults',
                hidden: true,
                autoCreate: true
            },
            speechButton: 'button[action=capturespeech]',
            statusText: 'textareafield[name=statustext]'
        },

        control : {
            'button[action=capturespeech]' : {
                'tap': 'onCaptureSpeech'
            },
            'button[action=speechtotext]' : {
                'tap': 'onSendSpeech'
            },
            'actionsheet button[action=close]': {
                'tap': 'onCloseResponseView'
            }
        }
    },

    init: function() {
        var me = this;
        var x = Ext.bind(this.initFacebook, me);

        document.addEventListener('deviceready', x);
    },

    initFacebook: function() {
        var me = this;
        var fbAppId = "509652205759255";

        console.log("DEVICE READY --- TRYING TO INIT FACEBOOK");
            try {
                FB.init({
                    appId: fbAppId,
                    nativeInterface: CDV.FB,
                    useCachedDialogs: false
//            status: true,
//            cookie: true,
//            xfbml: true
                });
                me.faceBookLogin();
            }
            catch (e) {
                alert(e);
            }

    },

    faceBookLogin: function() {
        console.log("TRYING TO LOG INTO FACEBOOK......");
        FB.login(
            function(response) {
                if (response.session) {
                    alert('LOGGED IN ');
                }
                else {
                    alert('not logged in');
                    console.log(">>>>> NOT LOGGED IN ");
                    console.log(response);
                }
            },
            { scope: "email" }
        );
    },

    /**
     * Gets called internally when phonegap property is set during config initialization.
     * We'll initialize here our Att.Phonegap instance to perform the API calls. 
     * @param provider the value we set in config option for this property.
     * @returns
     */

    applyPhonegap: function(phonegap) {
        if (!phonegap) {
            phonegap = Ext.create('Att.Phonegap', {
                accessKey: '8ea20f95c64658934a9b70254c524a31',
                secretKey: '986815dcd86e5aab',
                shortcode: '',
                scopeForAccessToken: 'SMS,MMS,SPEECH,WAP',
                scopeForOauthToken: 'TL,IMMN,MIM,DC'
            });
        }

        return phonegap;
    },

    applyFileSystem: function(fileSystem) {
        var me = this,
            setFS = Ext.bind(me.setFS, this),
            failFS = Ext.bind(me.failFileSystem, this);

        if(!fileSystem) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, setFS, failFS);
        }
    },

    setFS: function(fileSystem) {
        this.fileSystem = fileSystem;
        console.log(fileSystem.root.name);
    },

    fileFileSystem: function() {
        console.log("<><> FAIL TO SET FILE SYSTEM <><>");
    },

    showResponseView: function(success, response){
        var responseView =  this.getResponseView();

        Ext.Viewport.add(responseView);

        responseView.setData({
            success: success,
            results: JSON.stringify(response, null, '\t')
        });

        responseView.show();
    },

    onCloseResponseView: function(){
        var me = this,
            view = me.getView();

        this.getResponseView().hide();
    },

    onCaptureSpeech: function() {
        var me = this;
        var src = "/mnt/sdcard/recordedAudio.amr";
        var sb = this.getSpeechButton(),
            recInterval,
            recTime = 0, maxRecordingTime = 10;

        if (this.getCapturing()) {
            this.setCapturing(false);
            clearInterval(this.getRecInterval());

            me.stopRecording({
                success: function() {
                    this.getSpeechButton().setText("Processing...");
                    this.sendAudio(src);
                },
                failure: me.onCaptureFailure
            });
        }
        else {
            this.startRecording({
                params: {
                    filePath: src,
                    audioChannels: 1,
                    samplingRate: 8000,
                    encodingBitRate: 1222
                },
                success: function() {
                    this.setCapturing(true);
                },
                failure: function() {
                    console.log("NADA NADA NADA - no audio being captured.");
                },
                scope: me
            });

            // Stop recording after 10 sec
            this.setRecInterval(setInterval(function() {
                recTime = recTime + 1;
                me.setAudioPosition(recTime + " sec");
            }, 1000));
        }
    },

    startRecording: function(obj) {
        var me = this,
            params = Ext.apply(obj.params || {}, {
                filePath: "/mnt/sdcard/recordedAudio.amr",
                audioChannels: 1,
                samplingRate: 8000,
                encodingBitRate: 1200
            }),
            successCallback = obj.success ? Ext.bind(obj.success, obj.scope || me) : function() { console.log("DEFAULT SUCCESS START"); },
            failureCallback = obj.failure ? Ext.bind(obj.failure, obj.scope || me) : function() { console.log("DEFAULT FAILURE START"); };

        Cordova.exec(successCallback, failureCallback, "Recorder", "start", [ params ] );
    },

    stopRecording: function(obj) {
        var me = this,
            successCallback = obj.success ? Ext.bind(obj.success, obj.scope || me) : null,
            failureCallback = obj.failure ? Ext.bind(obj.failure, obj.scope || me) : null;

        Cordova.exec(successCallback, failureCallback, "Recorder", "stop", [ { } ] );
    },

    setAudioPosition: function(pos) {
        var sb = this.getSpeechButton();

        sb.setText(pos);
    },

    onCaptureFailure: function() {
        console.log("ON CAPTURE FAILURE");
    },

    onCaptureError: function(error) {
        var msg = 'An error occurred during capture: '; // + CAPTURE_INTERNAL_ERR;
        navigator.notification.alert(msg, null, 'Uh oh!');
    },

    sendAudio: function(src) {
        var me = this,
            view = me.getView(),
            phonegap = me.getPhonegap(),
            startTime = new Date().getTime();

        view.setMasked(true);

        phonegap.speechToText({
            filePath: src,
            fileContentType: 'audio/amr',
            context: "Generic",
            xarg: {
                ClientSdk: 'sencha-att-sdk'
            },
            chunked: false,
            success: function(response) {
                var xtime = new Date().getTime() - startTime,
                    jsonResponse = Ext.JSON.decode(response);

                console.log('TIME WAS ' + xtime + 'ms');
                me.getStatusText().setValue(jsonResponse.Recognition.NBest[0].Hypothesis);
                response.RoundTrip = xtime;
                view.setMasked(false);
                me.getSpeechButton().setText("Start Recording");
            },
            failure: function(response) {
                // Failure communicating with server.
                me.showResponseView(false, response);
                view.setMasked(false);
                me.getSpeechButton().setText("Start Recording");
            }
        });
    }
});