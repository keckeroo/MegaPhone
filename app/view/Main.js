/**
 * The Speech view exercises the speechToText API Call.
 */
Ext.define('AttSpeech.view.Main', {
    extend : 'Ext.Container',
    xtype  : 'speech-view',

    requires : [
        'Ext.form.Panel',
        'Ext.Toolbar',
        'Ext.form.FieldSet',
        'Ext.field.Select'
    ],

    config : {
        layout: {
            type: 'vbox'
        },
        items : [{
            /**
             * Toolbar to display a nice title
             */
                xtype  : 'toolbar',
                title  : 'MegaPhone',
                docked : 'top'
            },
            /**
             * The form panel we use to get the user selected file.
             */
            {
                flex: 1,
                layout: {
                    type: 'vbox',
                    pack: 'center',
                    align: 'strech'
                },
                defaults: {
                    layout: {
                        type: 'hbox',
                        pack: 'center',
                        align: 'stretch'
                    }
                },
                items: [{
                    defaults: {
                        style: 'margin: 15px;',
                        xtype: 'segmentedbutton',
                        allowToggle: true,
                        allowDepress: true,
                        flex: 1
                    },
                    items: [{
                        items: [{
                            width: 125,
                            height: 100,
                            action: 'sendFacebook',
                            text: 'Facebook'
                        }]
                    }, {
                        items: [{
                            width: 125,
                            height: 100,
                            action: 'sendTwitter',
                            text: 'Twitter'
                        }]
                    }]
                }, {
                    items: [{
                        xtype: 'button',
                        width: 200,
                        action: 'capturespeech',
                        text: 'Start Recording'
                    }]
                }, {
                    defaults: {
                        style: 'margin: 15px;',
                        xtype: 'segmentedbutton',
                        allowToggle: true,
                        allowDepress: true,
                        flex: 1
                    },
                    items: [{
                        items: [{
                            width: 125,
                            height: 100,
                            action: 'sendLinkedIn',
                            text: 'LinkedIn'
                        }]
                    }, {
                        items: [{
                            width: 125,
                            height: 100,
                            action: 'sendInstagram',
                            text: 'Instagram'
                        }]
                    }]
                }]
            }, {
                xtype  : 'formpanel',
                scrollable : false,
                items  : [{
                    style: 'margin: 5px; border: solid 2px #000000;',
                    xtype: 'textareafield',
                    name: 'statustext',
                    height: 75
                }]
            }, {
                xtype: 'toolbar',
                docked: 'bottom',
                ui: 'light',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                items: [{
                    text: 'Post Status'
                }]
            }
        ]
    }
});