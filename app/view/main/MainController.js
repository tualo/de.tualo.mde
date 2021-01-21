/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('TualoMDE.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',
    onPainted: function(){
        let me = this;
        let clientMenu = this.lookup('clientMenu').getMenu();
        App.security.Authentication.isLoggedIn().then(function(res) {
            let data = App.security.ClientStorage.retrieve();
            me.getViewModel().set('currentClient',data.client);
            data.clients.forEach(function(item){
                clientMenu.add({
                    text: item.client,
                    handler: function(btn){
                        let data = App.security.ClientStorage.retrieve();
                        data.client = btn.getText();
                        App.security.ClientStorage.save(data);
                        me.getViewModel().set('currentClient',data.client);
                    }
                });
            })
        });
    },
    onKeyPressLast: function (me, e, o) {
        if (e.keyCode === 13) {
            this.onLoginClick();
        }
    },
    onLoginClick: function(){
        let values = this.lookup('loginform').getValues();
        App.security.TokenStorage.clear();
        App.security.UrlStorage.save(values.url);
        App.security.Authentication.login(values.username,values.password).then(this.onLoginSuccess).catch(this.onLoginFailure);
    },
    onLoginSuccess: function(){
        Ext.toast('Anmeldung erfolgreich');
        try{
            TualoMDE.getApplication().getMainView().getViewModel().set('fullname',App.security.ClientStorage.retrieve().fullname);
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
        var card = this.lookup('maincard').getLayout();
        Ext.data.StoreManager.lookup('Kunden').filterBy(function(rec){
            if (rec.get('tour')==record.get('tour')){
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
        var card = this.lookup('maincard').getLayout();
        
        card.next();
    },
    onPositionNote: function(dataview,item){
        Ext.Msg.prompt(
            'Bemerkung',
            'Geben Sie die Bermerkung ein',
            function(btn,val){
                if (btn=='ok') item.record.set('bemerkung',val);
            },
            this,
            true,
            item.record.get('bemerkung'),
            {
                xtype: 'textareafield'
            }
        );
    },
    onPositionClear: function(dataview,item){
        if(  (item.record.get('anzahl')!=0) ||  (item.record.get('bemerkung')!='') )
        Ext.Msg.confirm(
            'Leeren',
            'Möchten Sie diesen Eintrag leeren?',
            function(btn,val){
                if (btn=='yes'){
                    item.record.set('bemerkung','');
                    item.record.set('anzahl',0);
                }
            },
            this
        );
    }
});
