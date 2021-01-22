/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('TualoMDE.view.main.MainController', {
    extend: 'Ext.app.ViewController',

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
    },
    onOverview: function(){
        var card = this.lookup('maincard').getLayout();
        card.next();
    },
    onSave: function(){
        var card = this.lookup('maincard').getLayout();
        card.previous();
        card.previous();
    },


    onSignumMouseMove: function(e,canvas){
        let  model = this.getViewModel(),
            signum = model.get('signum');
        let viewXY = this.view.el.getXY(),
            pageXY = e.getXY(),
            canvasRect = canvas.getBoundingClientRect();
        let x = pageXY[0] - canvasRect.x;
        let y = pageXY[1] - canvasRect.y;
        if (model.get('signumDown')){
            model.set('signumXY',{x: x, y:y});
            signum.push({x: x, y:y});
            model.set('signum',signum);
            this.drawSignum(canvas);
        }
    },
    onSignumSceneResize: function (component, canvas, size) {
        var barCount = 10,
            barWidth = size.width / barCount,
            barHeight = size.height,
            context = canvas.getContext('2d'),
            colors = d3.scaleOrdinal(d3.schemeCategory20),
            i = 0;

        context.fillStyle = '#ddd';
        context.fillRect(0, 0, size.width,size.height);
        this.drawSignum(canvas);
    },
    drawSignum: function(canvas){
        let  model = this.getViewModel(),
        signum = model.get('signum');


        var ctx = canvas.getContext("2d");
        ctx.lineWidth = 4;
        var last = {x:-1,y:-1};
        ctx.strokeStyle = "#000";

        ctx.save();
        signum.forEach(function(item){

            if (last.x!=-1){
                if (item.x!=-1){
                    ctx.beginPath();
                    ctx.moveTo(last.x, last.y);
                    ctx.lineTo(item.x, item.y);
                    ctx.stroke();
                }
            }
            last = item;
            
        });
        ctx.restore();
    },
    onSignumMouseDown: function(e,canvas){
        let  model = this.getViewModel(),
        signum = model.get('signum');
        let viewXY = this.view.el.getXY(),
            pageXY = e.getXY(),
            canvasRect = canvas.getBoundingClientRect();
        let x = pageXY[0] - canvasRect.x;
        let y = pageXY[1] - canvasRect.y;


        model.set('signumDown',true);
        model.set('signumXY',{x: x, y:y});
        signum.push({x: -1, y:-1});
        signum.push({x: x, y:y});
        model.set('signum',signum);
    },
    onSignumMouseUp: function(e,canvas){
        let  model = this.getViewModel(),
        signum = model.get('signum');
        let viewXY = this.view.el.getXY(),
            pageXY = e.getXY(),
            canvasRect = canvas.getBoundingClientRect();
        let x = pageXY[0] - canvasRect.x;
        let y = pageXY[1] - canvasRect.y;

        model.set('signumDown',false);
        model.set('signumXY',{x: x, y:y});
        signum.push({x: x, y:y});
        signum.push({x: -1, y:-1});
        model.set('signum',signum);
    },
    onDestroy: function(){
        console.log('onDestroy',arguments);
    }
});
