/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('my.application.Ext.data.proxy.Sql',{
    override: 'Ext.data.proxy.Sql', 
    createTable: function(transaction) {
        var me = this;

        if (!transaction) {
            me.executeTransaction(function(transaction) {
                me.createTable(transaction);
            });

            return;
        }

        me.executeStatement(transaction, 'CREATE TABLE IF NOT EXISTS "' + me.getTable() + '" (' + me.getSchemaString() + ')',[], function() {
            me.tableExists = true;
        });
    }
});


Ext.define('TualoMDE.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'TualoMDE.security.Authentication',
        'TualoMDE.security.ClientStorage',
        'TualoMDE.security.UrlStorage',
        'TualoMDE.security.RemoteSetupStorage',
        'Ext.Ajax'
    ],
    name: 'TualoMDE',

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },
    stores: [
        'TualoMDE.store.Tours',
        'TualoMDE.store.Customers',
        'TualoMDE.store.Navigation',
        'TualoMDE.store.CArticles',
        'TualoMDE.store.Article',

        'TualoMDE.store.ReportPositions',
        'TualoMDE.store.Report'
    ],

    launch: function(){
        let me = this;
        // console.log( 'Ext.device.Connection.isOnline()',Ext.device.Connection.isOnline());
        /*
        Ext.device.Notification.show({
            title: 'Verification',
            message: 'Is your email address: test@sencha.com',
            buttons: Ext.MessageBox.OKCANCEL,
            callback: function(button) {
                if (button === "ok") {
                    console.log('Verified');
                } else {
                    console.log('Nope');
                }
            }
        });
        */
        /*
       Ext.device.Camera.capture({
            success: function(image) {
                //imageView.setSrc(image);
                console.log(image);
            },
            quality: 75,
            width: 200,
            height: 200,
            destination: 'data'
        });
        */
    
        TualoMDE.security.Authentication.isLoggedIn().then(function(res) {
            if (res){
                me.getMainView().getViewModel().set('fullname',TualoMDE.security.ClientStorage.retrieve().fullname);
                me.fillStores();
                me.getMainView().setActiveItem(2);
            }else{
                me.getMainView().setActiveItem(1);
            }
        });
    },

    fillStores: function(){
        let remoteData = TualoMDE.security.RemoteSetupStorage.retrieve();
        if (remoteData){
            Ext.data.StoreManager.lookup('Touren').loadData(remoteData.tours);
            Ext.data.StoreManager.lookup('Kunden').loadData(remoteData.customers);
            Ext.data.StoreManager.lookup('CArticles').loadData(remoteData.carticles);
            Ext.data.StoreManager.lookup('Artikel').loadData(remoteData.articles);
        }
    },

    sync: function(){
        Ext.Ajax.request({
            url: TualoMDE.security.UrlStorage.retrieve()+'mdesync/sync',
            method: 'GET',
            params: {
                'oauth_client': TualoMDE.security.ClientStorage.retrieve().client
            },
            scope: this,
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.success) {
                    TualoMDE.security.RemoteSetupStorage.save(data);
                    this.fillStores();
                    //deferred.resolve(data, response);
                } else {
                    //deferred.reject(data, response);
                }
            },

            failure: function (response) {
                var data = Ext.decode(response.responseText);
                TualoMDE.security.TokenStorage.clear();
                deferred.reject(data, response);
            }
        });
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
