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
        'Ext.layout.VBox',
        'Ext.layout.Card',
        'Ext.form.Panel',
        'Ext.field.Text',
        'Ext.field.Display',
        'Ext.field.Search',
        'Ext.dataview.listswiper.ListSwiper',
        'Ext.dataview.Component',
        'TualoMDE.store.Tours',
        'TualoMDE.store.Navigation',
        'TualoMDE.store.Customers',
        'TualoMDE.store.CArticles',
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
        
        { // ################# 0
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
        { // ################# 1
            xtype: 'panel',
            title: 'Anmeldung',
            layout: {
                type: 'vbox',
                align: 'strech',
                pack: 'top'
            },
            items: [{
                xtype: 'panel',
                border: true,
                autoSize: true,
                items: [
                    {
                        xtype: 'formpanel',
                        reference: 'loginform',
                        autoSize: true,
                        bodyPadding: 20,
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
                                        me.setValue(TualoMDE.security.UrlStorage.retrieve());
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
        { // ################# 2
            xtype: 'panel',
            layout: 'card',
            title: 'Datenerfassung',
            tools: [{

                iconCls: 'x-fa fa-search',
                xtype: 'button',
                handler: 'onSearch'

            },{
                iconCls: 'x-fa fa-bars',
                arrow: false,
                bind: {
                    badgeText: '{unsynched}'
                },

                xtype: 'button',
                menu: [
                    {
                        xtype: 'component',
                        padding: '0 0 0 15',
                        bind: {
                            html: '{fullname}'
                        }
                    },{
                        xtype: 'menuseparator'
                    },
                    {
                        //xtype: 'button',
                        text: 'Synchronisieren',
                        iconCls: 'x-fa fa-sync',
                        /*
                        xtype: 'button',
                        bind: {
                            badgeText: '{unsynched}'
                        },
                        */
                        //padding: '0 15 0 0',
                        handler: 'onSyncClick'
                    },
                    {
                        //xtype: 'button',
                        text: 'Einstellungen',
                        iconCls: 'x-fa fa-cog',
                        //padding: '0 24 0 0',
                        handler: 'onConfigClick'
                    },
                    {
                        //xtype: 'button',
                        text: 'Belege',
                        iconCls: 'x-fa fa-list',
                        //padding: '0 24 0 0',
                        handler: 'onReportClick'
                    },{
                        xtype: 'menuseparator'
                    },
                    {
                        xtype: 'component',
                        padding: '0 0 0 15',
                        bind: {
                            html: '<span style="font-size: 0.8em">Version {version}</span>'
                        }
                    },
                ]
            }], 
            items: [
                
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
                            text: '&laquo; Zurück',
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
                            xtype: 'panel',
                            shadow: 'true',
                            layout: 'vbox',
                            items: [
                                {
                                    margin: 10,
                                    autoSize: true,
                                    layout: 'vbox',
                                    shadow: 'true',
            
                                    xtype: 'panel',
                                    
                                    bind: {
                                        hidden: '{!searchmode}'
                                    },
                                    items: [
                                        {
                                            xtype: 'searchfield',
                                            ui: 'raised solo',
                                            shaddow: true,
                                            placeholder: 'Suchen',
                                            listeners: {
                                                buffer: 1000,
                                                change: 'doSearch'
                                            }
                                        }
                                    ]
                                    
                                },
                                {
                                    xtype: 'componentdataview',
                                    iconCls: 'x-fa fa-users',
                                    reference: 'customers',
                                    padding: '12 12 12 12',
                                    flex: 1,
                                    //itemTpl: '<div><div style="background-color:{farbe};border-radius:20px;width:20px;height:20px;float:left;margin-right:12px;"></div> <b>{name}</b><br>{strasse} {hausnr}<br>{plz} {ort}</div>',
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
                                    },
                                    layout: {
                                        type: 'vbox',
    
                                    },
                                    
                                    itemConfig: {
                                        xtype: 'panel',
    
                                        margin: '0 0 10 0',
                                        minHeight: '60px',
                                        viewModel: true, // enable per-record binding
                                        layout: {
                                            type: 'hbox',
                                            align: 'strech'
                                        },
                                        items: [{
                                            xtype: 'component',
                                            width: '20px',
                                            margin: '0 10 0 0',
                                            bind: {
                                                style: 'background-color:{record.farbe};',
                                                
                                            }
                                        }, {
                                            xtype: 'component',
                                            flex: 1,
                                            bind: {
                                                html: '<b>{record.name}</b><br>{record.strasse} {record.hausnr}<br>{record.plz} {record.ort}'
                                            }
                                        }/*, {
                                            xtype: 'component',
                                            autoWidth: true,
                                            style: 'text-align: right; font-weight: bold;',
                                            bind: {
                                                html: '{record.amount}'
                                            }
                                        }*/]
                                    }
                                }
                            ]
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
                                        'K.Nr.: <b>{report.referencenr}/{report.costcenter}</b>',
                                        '<pre>{report.address}</pre>'
                                        // '{customers.selection.telefon}',
                                    ].join('<br/>')
                                }
                            }, {
                                flex: 2,
                                padding: '12 12 12 12',
                                xtype: 'componentdataview',
                                listeners: {
                                    //itemtaphold: 'onTourTab'
                                    itemtap: 'onPositionTab'
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
                                //store: 'Positionen',
                                bind:{
                                    store: '{report.positions}'
                                },
                                layout: {
                                    type: 'vbox',

                                },
                                scrollable: 'y',
                                itemConfig: {
                                    xtype: 'panel',

                                    margin: '0 0 10 0',
                                    minHeight: '60px',
                                    viewModel: true, // enable per-record binding
                                    layout: {
                                        type: 'hbox',
                                        align: 'strech'
                                    },
                                    items: [{
                                        xtype: 'component',
                                        width: '20px',
                                        margin: '0 10 0 0',
                                        bind: {
                                            style: 'background-color:{record.warengruppen_farbe};',
                                            
                                        }
                                    }, {
                                        xtype: 'component',
                                        flex: 1,
                                        bind: {
                                            html: '<b>{record.article}</b><br>{record.note}<br>'
                                        }
                                    }, {
                                        xtype: 'component',
                                        autoWidth: true,
                                        style: 'text-align: right; font-weight: bold;',
                                        bind: {
                                            html: '{record.amount}'
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
                                            'K.Nr.: <b>{report.referencenr}/{report.costcenter}</b>',
                                            '<pre>{report.address}</pre>'
                                            // '{customers.selection.telefon}',
                                        ].join('<br/>')
                                    }
                                }, 
                                {
                                    flex: 2,
                                    padding: '12 12 12 12',
                                    xtype: 'componentdataview',
                                    bind:{
                                        store: '{report.positions}'
                                    },
                                    layout: {
                                        type: 'vbox',
    
                                    },
                                    scrollable: 'y',
                                    itemConfig: {
                                        xtype: 'panel',
                                        bind: {
                                            hidden: '{record.amount==0}'
                                        },
                                        margin: '0 0 0 0',
                                        minHeight: '60px',
                                        viewModel: true, // enable per-record binding
                                        layout: {
                                            type: 'hbox',
                                            align: 'strech'
                                        },
                                        items: [{
                                            xtype: 'component',
                                            flex: 1,
                                            bind: {
                                                html: '{record.article}<br>{record.note}'
                                            }
                                        }, {
                                            xtype: 'component',
                                            autoWidth: true,
                                            style: 'text-align: right;',
                                            bind: {
                                                html: '{record.amount}'
                                            }
                                        }]
                                    }
                                }, 
                                {
                                    xtype: 'd3-canvas',
                                    reference: 'd3',
                                    border: true,
                                    shaddow: true,
                                    margin: '12 12 12 12',
                                    flex: 2,
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
                }
            ]
        },
        { // ################ 3
            xtype: 'panel',
            title: 'Einstellungen',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            tbar: {
                items: [{
                    text: '&laquo; Zurück',
                    handler: 'onSetupPrevious'
                }]
            },
            items: [{
                xtype: 'panel',
                width: '50%',
                bind: {
                    html: "Sie sind angemeldet als,<br> <b>{fullname}</b>"
                }
            },{
                margin: '25px 0 0 0',
                xtype: 'button',
                bind: {
                    text: '{currentClient}'
                },
                reference: 'clientMenu',
                width: '50%',
                iconCls: 'x-fa fa-bars',
                ui: 'raised',
                menu: {
                    layout: {
                        overflow: 'scroller'
                    },

                    items: []
                }
            },
            {
                margin: '25px 0 0 0',
                text: 'Abmelden',
                xtype: 'button',
                width: '50%',
                handler: 'onLogoutClick',
                iconCls: 'x-fa fa-door-open',
                ui: 'raised decline'
            }
            ]
        },



        { // ################# 4
            xtype: 'panel',
            layout: 'card',
            title: 'Belege',
            tbar: {
                items: [{
                    text: '&laquo; Zurück',
                    handler: 'onSetupPrevious'
                }]
            },
            items: [
               
                {
                    xtype: 'panel',
                    shadow: true,
                    reference: 'reportcard',

                    scrollable: 'y',
                    items: [
                        
                        {
                            xtype: 'componentdataview',
                            iconCls: 'x-fa fa-users',
                            reference: 'customers',
                            padding: '12 12 12 12',
                            flex: 1,
                            store: 'Belege',
                            plugins: {
                                listswiper: {
                                    defaults: {
                                        ui: 'action'
                                    },
                                    /*
                                    left: [{
                                        iconCls: 'x-fa fa-doc',
                                        text: 'letzter Beleg',
                                        commit: 'onReport'
                                    }],
                                    */
                                    right: [{
                                        iconCls: 'x-fa fa-trash',
                                        ui: 'alt decline',
                                        text: 'Löschen',
                                        commit: 'onReportDelete'
                                    }, {
                                        iconCls: 'x-fa fa-edit',
                                        ui: 'alt confirm',
                                        text: 'Bearbeiten',
                                        commit: 'onReportEdit'
                                    }]
                                }
                            },
                            listeners: {
                                //itemtaphold: 'onTourTab'
                                itemtap: 'onCustomerTab'
                            },
                            layout: {
                                type: 'vbox',

                            },
                            
                            itemConfig: {
                                xtype: 'panel',

                                margin: '0 0 10 0',
                                minHeight: '60px',
                                viewModel: true, // enable per-record binding
                                layout: {
                                    type: 'hbox',
                                    align: 'strech'
                                },
                                /*bind: {
                                    hidden: '{!record.__saved}'
                                },
                                */
                                items: [{
                                    xtype: 'component',
                                    width: '20px',
                                    margin: '0 10 0 0',
                                    bind: {
                                        style: 'background-color: grey;',
                                        hidden: '{!record.__saved && !record.__synced}'
                                        
                                    }
                                },{
                                    xtype: 'component',
                                    width: '20px',
                                    margin: '0 10 0 0',
                                    bind: {
                                        style: 'background-color: yellow;',
                                        hidden: '{record.__saved && !record.__synced}'
                                        
                                    }
                                },{
                                    xtype: 'component',
                                    width: '20px',
                                    margin: '0 10 0 0',
                                    bind: {
                                        style: 'background-color: green;',
                                        hidden: '{!record.__synced}'
                                        
                                    }
                                }, {
                                    xtype: 'component',
                                    flex: 1,
                                    bind: {
                                        html: '<b>{record.id}</b><br><pre>{record.address}</pre>'
                                    }
                                }, {
                                    xtype: 'component',
                                    autoWidth: true,
                                    style: 'text-align: right; font-weight: bold;',
                                    padding: '0 15 0 0',
                                    bind: {
                                        html: '{record.date:date("d.m.Y")}<br>{record.time:date("H:i")}'
                                    }
                                }]
                            }
                        }
                        
                    ]
                }
            ]
        }

    ]
});
