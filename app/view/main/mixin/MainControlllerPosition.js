Ext.define('TualoMDE.view.main.mixin.MainControlllerPosition', {
    onPositionNote: function(dataview,item){
        Ext.Msg.prompt(
            'Bemerkung',
            'Geben Sie die Bemerkung ein',
            function(btn,val){
                if (btn=='ok') item.record.set('note',val);
            },
            this,
            true,
            item.record.get('note'),
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
    onPositionTab: function(list, index, target, record, e, eOpts){
        Ext.Msg.prompt(
            'Anzahl',
            'Geben Sie die Menge für "'+record.get('article')+'" ein',
            function(btn,val){
                if (btn=='ok') record.set('amount',val);
            },
            this,
            false,
            record.get('amount'),
            {
                xtype: 'numberfield',
                value: record.get('amount'),
                listeners: {
                    painted: function(me){
                        Ext.defer(me.focus,200,me,[true]);
                    }
                }
            }
        );
    }
});