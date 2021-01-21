/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('TualoMDE.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'App.security.Authentication',
        'App.security.ClientStorage',
        'App.security.RemoteSetupStorage'
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
        'TualoMDE.store.Positionen'
    ],

    launch: function(){
        let me = this;
        App.security.Authentication.isLoggedIn().then(function(res) {
            if (res){
                me.getMainView().getViewModel().set('fullname',App.security.ClientStorage.retrieve().fullname);
                me.fillStores();
                me.getMainView().setActiveItem(2);
            }else{
                me.getMainView().setActiveItem(1);
            }
        });
    },

    fillStores: function(){
        let remoteData = App.security.RemoteSetupStorage.retrieve();
        if (remoteData){
            Ext.data.StoreManager.lookup('Touren').loadData(remoteData.tours);
            Ext.data.StoreManager.lookup('Kunden').loadData(remoteData.customers);
            Ext.data.StoreManager.lookup('Positionen').loadData(remoteData.carticles);
        }
    },

    sync: function(){
        Ext.Ajax.request({
            url: App.security.UrlStorage.retrieve()+'mdesync/sync',
            method: 'GET',
            params: {
                'oauth_client': App.security.ClientStorage.retrieve().client
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.success) {
                    App.security.RemoteSetupStorage.save(data);
                    console.log(data);
                    //deferred.resolve(data, response);
                } else {
                    //deferred.reject(data, response);
                }
            },

            failure: function (response) {
                var data = Ext.decode(response.responseText);
                App.security.TokenStorage.clear();
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
