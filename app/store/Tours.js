Ext.define('TualoMDE.store.Tours', {
    extend: 'Ext.data.Store',

    alias: 'store.tours',

    model: 'TualoMDE.model.Tour',
    storeId: 'Touren',
    sorters: 'position',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    }
});
