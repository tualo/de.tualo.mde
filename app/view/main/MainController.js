/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('TualoMDE.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    requires: [
        'TualoMDE.view.main.mixin.MainControlllerSignum',
        'TualoMDE.view.main.mixin.MainControlllerSearch',
        'TualoMDE.view.main.mixin.MainControlllerPosition'
    ],
    mixins: [
        'TualoMDE.view.main.mixin.MainControlllerSignum',
        'TualoMDE.view.main.mixin.MainControlllerSearch',
        'TualoMDE.view.main.mixin.MainControlllerPosition'
    ],
    alias: 'controller.main',
    init: function() {
        var bbar = this.lookup('bbar'),
            card = this.lookup('maincard').getLayout(),

            // Lazily create the Indicator (wired to the card layout)
            indicator = card.getIndicator();

        // Render it into our bottom toolbar (bbar)
        bbar.insert(1, indicator);
    },

    onPainted: function(){
        let me = this;
        let clientMenu = this.lookup('clientMenu').getMenu();
        TualoMDE.security.Authentication.isLoggedIn().then(function(res) {
            let data = TualoMDE.security.ClientStorage.retrieve();
            me.getViewModel().set('currentClient',data.client);
            data.clients.forEach(function(item){
                clientMenu.add({
                    text: item.client,
                    handler: function(btn){
                        let data = TualoMDE.security.ClientStorage.retrieve();
                        data.client = btn.getText();
                        TualoMDE.security.ClientStorage.save(data);
                        me.getViewModel().set('currentClient',data.client);
                    }
                });
            })
        });

        this.refreshReports();
        /*
        Ext.data.StoreManager.lookup('Belege').load({
            callback: function(){
                Ext.data.StoreManager.lookup('Belege').getRange()[7].positions().load({
                    callback: function(){
                        console.log(Ext.data.StoreManager.lookup('Belege').getRange()[7].positions());
                    }
                });
            }
        });
        */
        


    },

    refreshReports: function(){
        Ext.data.StoreManager.lookup('Belege').load({
            scope: this,
            callback: function(){
                let  model = this.getViewModel(),
                    range = Ext.data.StoreManager.lookup('Belege').getRange(),
                    count = 0;
                range.forEach(function(item){
                    count+=( (item.get('__synced')==false) && (item.get('__saved')==true) )?1:0;
                });
                if (count==0){
                    model.set('unsynched','');
                }else{
                    model.set('unsynched',''+count);
                }
            }
        });
    },
    onKeyPressLast: function (me, e, o) {
        if (e.keyCode === 13) {
            this.onLoginClick();
        }
    },
    onLoginClick: function(){
        let values = this.lookup('loginform').getValues();
        TualoMDE.security.TokenStorage.clear();
        TualoMDE.security.UrlStorage.save(values.url);
        TualoMDE.security.Authentication.login(values.username,values.password).then(this.onLoginSuccess).catch(this.onLoginFailure);
    },
    onLoginSuccess: function(){
        Ext.toast('Anmeldung erfolgreich');
        try{
            TualoMDE.getApplication().getMainView().getViewModel().set('fullname',TualoMDE.security.ClientStorage.retrieve().fullname);
            TualoMDE.getApplication().getMainView().setActiveItem(2);
        }catch(e){
            console.log(e);
        }
    },
    onSyncClick: function(){
        TualoMDE.getApplication().sync();
    },
    onLoginFailure: function(data,respose){
        Ext.toast(data.msg||'Unbekannter Fehler');
        console.log( 'onLoginFailure', arguments );
    },


    onPrevious: function() {

        var card = this.lookup('maincard').getLayout();
        card.previous();
    },
    onTourTab: function(list, index, target, record, e, eOpts){
        let  model = this.getViewModel(),
            card = this.lookup('maincard').getLayout();

        model.set('tour',record.get('tour'));
        Ext.data.StoreManager.lookup('Kunden').clearFilter();
        Ext.data.StoreManager.lookup('Kunden').filterBy(function(rec){
            if (rec.get('tour')==model.get('tour')){
                return true;
            }else{
                return false;
            }
        });
        card.next();
    },
    onCustomerTab: function(list, index, target, customerrecord, e, eOpts){
        this.onNewReport('',customerrecord);
    },
    onNewReport: function(reporttype,customerrecord){
        let  model = this.getViewModel(),
            card = this.lookup('maincard').getLayout(),
            pos = [],
            range = [],
            position = 0,
            report = new TualoMDE.model.Report({
                referencenr: customerrecord.get('kundennummer'),
                costcenter: customerrecord.get('kostenstelle'),
                address:
                        customerrecord.get('name')+"\n"+
                        customerrecord.get('strasse')+' '+customerrecord.get('hausnr')+"\n"+
                        customerrecord.get('plz')+' '+customerrecord.get('ort')
            });

            report.save();
        model.set('customerrecord',customerrecord);
        Ext.data.StoreManager.lookup('Artikel').clearFilter();
        Ext.data.StoreManager.lookup('Artikel').filterBy(function(rec){
            if (customerrecord.get('preiskategorie')==rec.get('preiskategorie')){
                return true;
            }else{
                return false;
            }
        });
        range = Ext.data.StoreManager.lookup('Artikel').getRange();
        range.forEach(function(rec){
            pos.push(new TualoMDE.model.ReportPosition({
                position: position++,
                article: rec.get('gruppe'),
                account: '00000',
                singleprice: rec.get('preis'),
                amount: 0,
                net: 0,
                gross: 0,
                vat: 0,
                taxrate: rec.get('steuer')
            }));
        });
        console.log(report);
        report.positions().add(pos);

        model.set('report',report);
        card.next();
    },
    onOverview: function(){
        var card = this.lookup('maincard').getLayout(),
        model = this.getViewModel(),
        report = model.get('report');
        report.signum().removeAll();

        card.next();
        this.drawSignum(this.lookup('d3').getCanvas());
    },
    onSave: function(){
        let  model = this.getViewModel(),
            report = model.get('report');
        report.set('__saved',true);
        report.save({
            callback: function(){
                report.signum().sync({
                    callback: function(){
                        report.positions().sync();
                    }
                })
            }
        });
        this.lookup('maincard').setActiveItem(1);
        this.refreshReports();
    },


    onDestroy: function(){
        console.log('onDestroy',arguments);
    },

    
    onConfigClick: function(){
        TualoMDE.getApplication().getMainView().setActiveItem(3);
    },
    
    onReportClick: function(){
        TualoMDE.getApplication().getMainView().setActiveItem(4);
    },
    onLogoutClick: function(){
        TualoMDE.security.Authentication.logout(function(){});
        TualoMDE.security.ClientStorage.clear();
        TualoMDE.security.RemoteSetupStorage.clear();
        TualoMDE.getApplication().getMainView().setActiveItem(1);
    },
    onSetupPrevious: function(){
        TualoMDE.getApplication().getMainView().setActiveItem(2);
    },
    onReportDelete: function(dataview,item){
        //if(  (item.record.get('anzahl')!=0) ||  (item.record.get('bemerkung')!='') )
        Ext.Msg.confirm(
            'Löschen',
            'Möchten Sie den Beleg Nr. '+item.record.get('id')+' wirklich löschen?',
            function(btn,val){
                if (btn=='yes'){
                    Ext.data.StoreManager.lookup('Belege').remove(item.record);
                }
            },
            this
        );
    },
    onReportEdit: function(dataview,item){
        if(  (item.record.get('__synced')==false) )
        console.log('edit');
    }
});
