/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 */
Ext.define('TualoMDE.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.MessageBox',
        'Ext.layout.Fit',
        'TualoMDE.store.Tours',
        'Ext.Toast',
        'Ext.d3.canvas.Canvas',
        'Ext.BreadcrumbBar'
    ],

    controller: 'main',
    viewModel: 'main',
    layout: {
        type: 'card'
    },
    listeners: {
        painted: 'onPainted'
    },
    items: [
        {
            xtype: 'panel',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [{
                xtype: 'panel',
                html: "Einen Moment bitte ..."
            }]
        },
        {
            xtype: 'panel',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [{
                xtype: 'panel',
                title: 'Anmeldung',
                border: true,
                autoSize: true,
                items: [
                    {
                        xtype: 'formpanel',
                        reference: 'loginform',
                        autoSize: true,
                        bodyPadding: 20,
                        width: 320,
                        defaults: {
                            anchor: '100%'
                        },
                        items: [

                            {
                                xtype: 'displayfield',
                                value: 'Geben Sie hier Ihre Zugangsdaten ein'
                            },
                            {
                                xtype: 'textfield',
                                name: 'url',
                                anchor: '100%',
                                label: 'URL',
                                value: '',

                                listeners: {
                                    painted: function (me) {
                                        me.setValue(App.security.UrlStorage.retrieve());
                                    },
                                    keypress: function (me, e, o) {
                                        if (e.keyCode === 13) {
                                            me.up('panel').items.getAt(2).focus();
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'textfield',
                                name: 'username',
                                anchor: '100%',
                                label: 'Login',
                                value: '',
                                listeners: {
                                    keypress: function (me, e, o) {
                                        if (e.keyCode === 13) {
                                            me.up('panel').items.getAt(3).focus();
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'textfield',
                                name: 'password',
                                label: 'Passort',
                                inputType: 'password',
                                value: '',
                                listeners: {
                                    keypress: 'onKeyPressLast'
                                }
                            }
                        ],
                        buttons: [
                            {
                                text: 'Anmelden',
                                handler: 'onLoginClick'
                            }
                        ]
                    }
                ]
            }]
        },
        {
            xtype: 'panel',
            layout: 'card',
            title: 'Datenerfassung',
            tools: [{

                iconCls: 'x-fa fa-search',
            }, {
                xtype: 'button',
                cls: 'whitebtntext',
                bind: {
                    text: '{currentClient}'
                },
                reference: 'clientMenu',
                iconCls: 'x-fa fa-bars',
                menu: {
                    layout: {
                        overflow: 'scroller'
                    },

                    items: []
                }
            }, {
                iconCls: 'x-fa fa-sync',
                handler: 'onSyncClick'
            }],
            items: [
                /*
                {
                    xtype: 'breadcrumbbar',
                    docked: 'top',
                    showIcons: true,
                    store: 'Navigation',
                    menu: {
                       "layout": {
                          "overflow": "scroller"
                       },
                       "maxHeight": 500
                    },
                    items: []
                },
                */
                /*{
                    xtype: 'toolbar',
                    docked: 'top',
                    layout: {
                        overflow: 'scroller'
                    },
                    items: [{
                        bind:{
                            text: '{currentClient}'
                        },
                        reference: 'clientMenu',
                        iconCls: 'x-fa fa-bars',
                        menu: {
                            layout: {
                                overflow: 'scroller'
                            },
                            
                            items: [ ]
                        }
                    },{
                        iconCls: 'x-fa fa-search',
                    },{
                        iconCls: 'x-fa fa-sync',
                        handler: 'onSyncClick'
                    }]
                },*/

                {
                    xtype: 'panel',
                    shadow: true,
                    reference: 'maincard',
                    layout: {
                        type: 'card',
                        // The controller inserts this indicator in our bbar
                        // and we publish the active index and card count
                        // so we can easily disable Next/Prev buttons.
                        indicator: {
                            reference: 'indicator',
                            tapMode: 'direction',
                            publishes: [
                                'activeIndex',
                                'count'
                            ]
                        },
                        animation: {
                            type: 'slide'
                        }
                    },
                    bbar: {
                        reference: 'bbar',
                        items: [{
                            text: '&laquo; Previous',
                            handler: 'onPrevious',
                            bind: {
                                disabled: '{!indicator.activeIndex}'
                            }
                        },{
                            text: 'Übersicht',
                            handler: 'onOverview',
                            bind: {
                                hidden: '{indicator.activeIndex != 2}'
                            }
                        },{
                            text: 'Speichern',
                            handler: 'onSave',
                            ui: 'confirm',
                            bind: {
                                hidden: '{indicator.activeIndex != 3}'
                            }
                        }]
                    },
                    items: [
                        {
                            xtype: 'list',
                            iconCls: 'x-fa fa-list',
                            itemTpl: '<div><div style="background-color:{farbe};border-radius:20px;width:20px;height:20px;float:left;margin-right:12px;"></div>{tour}</div>',
                            store: 'Touren',
                            listeners: {
                                //itemtaphold: 'onTourTab'
                                itemtap: 'onTourTab'
                            }
                        },
                        {
                            xtype: 'list',
                            iconCls: 'x-fa fa-users',
                            reference: 'customers',
                            itemTpl: '<div><div style="background-color:{farbe};border-radius:20px;width:20px;height:20px;float:left;margin-right:12px;"></div> <b>{name}</b><br>{strasse} {hausnr}<br>{plz} {ort}</div>',
                            store: 'Kunden',
                            plugins: {
                                listswiper: {
                                    defaults: {
                                        ui: 'action'
                                    },
                                    
                                    left: [{
                                        iconCls: 'x-fa fa-doc',
                                        text: 'letzter Beleg',
                                        commit: 'onReport'
                                    }],
                                    
                                    right: [{
                                        iconCls: 'x-fa fa-envelope',
                                        ui: 'alt confirm',
                                        text: 'Message',
                                        commit: 'onMessage'
                                    }, {
                                        iconCls: 'x-fa fa-cog',
                                        text: 'Gear',
                                        commit: 'onGear'
                                    }]
                                }
                            },
                            listeners: {
                                //itemtaphold: 'onTourTab'
                                itemtap: 'onCustomerTab'
                            }
                        },
                        {
                            xtype: 'panel',
                            layout: {
                                type: 'vbox'
                            },
                            items: [{
                                autoHeight: true,
                                margin: '0 0 10 0',
                                padding: '12 12 12 12',
                                bind: {
                                    html: [
                                        'K.Nr.: {customers.selection.kundennummer}/{customers.selection.kostenstelle}',
                                        '{customers.selection.name}',
                                        '{customers.selection.strasse} {customers.selection.hausnr}',
                                        '{customers.selection.plz} {customers.selection.ort}',
                                        // '{customers.selection.telefon}',
                                    ].join('<br/>')
                                }
                            }, {
                                flex: 2,
                                padding: '12 12 12 12',
                                xtype: 'componentdataview',
                                listeners: {
                                    //itemtaphold: 'onTourTab'
                                    itemtap: function(list, index, target, record, e, eOpts){
                                        Ext.Msg.prompt(
                                            'Anzahl',
                                            'Geben Sie die Menge ein',
                                            function(btn,val){
                                                if (btn=='ok') record.set('anzahl',val);
                                            },
                                            this,
                                            false,
                                            record.get('anzahl'),
                                            {
                                                xtype: 'numberfield'
                                            }
                                        );
                                    }
                                },
                                plugins: {
                                    listswiper: {
                                        defaults: {
                                            ui: 'action'
                                        },
                                        dismissOnTap: false,
                                        dismissOnScroll: false,
                                        
                                        
                                        left: [{
                                            iconCls: 'x-fa fa-remove',
                                            text: 'Leeren',
                                            ui: 'decline',
                                            commit: 'onPositionClear'
                                        }],
                                        
                                        right: [{
                                            iconCls: 'x-fa fa-envelope',
                                            ui: 'alt confirm',
                                            text: 'Bemerkung',
                                            commit: 'onPositionNote'
                                        }]
                                    }
                                },
                                store: 'Positionen',
                                layout: {
                                    type: 'vbox',

                                },
                                scrollable: 'y',
                                itemConfig: {
                                    xtype: 'panel',

                                    viewModel: true, // enable per-record binding
                                    layout: {
                                        type: 'hbox',
                                        align: 'strech'
                                    },
                                    items: [{
                                        xtype: 'component',
                                        autoWidth: true,
                                        margin: '0 10 0 0',
                                        padding: '15 0 0 0',
                                        bind: {
                                            html: '<div style="background-color:{record.farbe};border-radius:20px;width:20px;height:20px;"></div>'
                                        }
                                    }, {
                                        xtype: 'component',
                                        flex: 1,
                                        bind: {
                                            html: '<b>{record.artikel}</b><br>{record.bemerkung}<br> {record.epreis_formated} &euro;'
                                        }
                                    }, {
                                        xtype: 'component',
                                        autoWidth: true,
                                        style: 'text-align: right; font-weight: bold;',
                                        bind: {
                                            html: '{record.anzahl_formated}'
                                        }
                                    }]
                                }
                            }]
                        },
                        {
                            xtype: 'panel',
                            layout: {
                                type: 'vbox'
                            },
                            items: [
                                {
                                    autoHeight: true,
                                    margin: '0 0 10 0',
                                    padding: '12 12 12 12',
                                    bind: {
                                        html: [
                                            'K.Nr.: <b>{customers.selection.kundennummer}/{customers.selection.kostenstelle}</b>',
                                            '{customers.selection.name}',
                                            '{customers.selection.strasse} {customers.selection.hausnr}',
                                            '{customers.selection.plz} {customers.selection.ort}',
                                            // '{customers.selection.telefon}',
                                        ].join('<br/>')
                                    }
                                }, 
                                {
                                    xtype: 'panel',
                                    padding: '12 12 12 12',
                                    bind: {
                                        html: '{overview}'
                                    },
                                    flex: 1
                                }, 
                                {
                                    xtype: 'd3-canvas',
                                    border: true,
                                    shaddow: true,
                                    margin: '12 12 12 12',
                                    flex: 1,
                                    listeners: {
                                        sceneresize: 'onSignumSceneResize',
                                        mousemove: {
                                            fn: 'onSignumMouseMove',
                                            element: 'element',
                                            scope: 'controller'
                                        },
                                        mousedown: {
                                            fn: 'onSignumMouseDown',
                                            element: 'element',
                                            scope: 'controller'
                                        },
                                        mouseup: {
                                            fn: 'onSignumMouseUp',
                                            element: 'element',
                                            scope: 'controller'
                                        },
                                        destroy: 'onDestroy'
                            
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: [{
                        xtype: 'panel',
                        bind: {
                            html: "Hallo {fullname}"
                        }
                    }]
                }
            ]
        }

    ]
});
