/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('TualoMDE.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',
    init: function() {
        /*
        var bbar = this.lookup('bbar'),
            card = this.lookup('maincard').getLayout(),

            // Lazily create the Indicator (wired to the card layout)
            indicator = card.getIndicator();

        // Render it into our bottom toolbar (bbar)
        bbar.insert(1, indicator);
        */
    },

    onPainted: function(){
        let me = this;
        /*
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
        */
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
            card = this.lookup('maincard').getLayout();
        model.set('customerrecord',customerrecord);
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
        this.getReportFromData();
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
    },
    onSearch: function(){
        let  model = this.getViewModel(),
        maincard = this.lookup('maincard'),
        card = maincard.getLayout();
        
        
            model.set('searchmode',!model.get('searchmode') );
        if( card.getIndicator().getActiveIndex() == 0 ){
            model.set('tour', null);
            Ext.data.StoreManager.lookup('Kunden').clearFilter();
            Ext.data.StoreManager.lookup('Kunden').filterBy(function(rec){
                if  ( (rec.get('tour')==model.get('tour')) || (model.get('tour')==null) ) {
                    return true;
                }else{
                    return false;
                }
            });
            card.next();
        }
    },
    doSearch: function(field){
        let  model = this.getViewModel(),
            value = field.getValue();
        
        Ext.data.StoreManager.lookup('Kunden').clearFilter();
        Ext.data.StoreManager.lookup('Kunden').filterBy(function(rec){
            if  ( (rec.get('tour')==model.get('tour')) || (model.get('tour')==null) ) {
                if (
                    rec.get('name').toLowerCase().indexOf(value)>=0
                ){
                    return true;
                }
            }else{
                return false;
            }
        });
        
    },
    getReportFromData: function(){
        let  model = this.getViewModel(),
            card = this.lookup('maincard').getLayout(),
            customer = model.get('customerrecord'),
            positionen  = Ext.data.StoreManager.lookup('Positionen').getRange(),
            o = {
                "id": -1,
                "date": Ext.util.Format.date(model.get('currentDate'),'Y-m-d'),
                "time": Ext.util.Format.date(model.get('currentDate'),'H:i:s'),
                "bookingdate": Ext.util.Format.date(model.get('currentDate'),'Y-m-d'),
                "service_period_start": Ext.util.Format.date(model.get('currentDate'),'Y-m-d'),
                "service_period_stop": Ext.util.Format.date(model.get('currentDate'),'Y-m-d'),

                "warehouse": 0,
                "reference": model.get('referenceNumber'),
                "address": [
                    customer.get('name'),
                    customer.get('strasse')+' '+customer.get('hausnr'),
                    customer.get('plz')+' '+customer.get('ort')
                ].join("\n"),
                "companycode": customer.get('companycode'),
                "office": customer.get('office'),
        
                "positions": [],
                "signum": []
            };
    
        console.log(o);
    }
});
