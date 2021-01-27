Ext.define('TualoMDE.view.main.mixin.MainControlllerSearch', {
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
});