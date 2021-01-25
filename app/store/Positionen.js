Ext.define('TualoMDE.store.Positionen', {
    extend: 'Ext.data.Store',

    alias: 'store.tours',

    model: 'TualoMDE.model.Position',
    storeId: 'Positionen',
    sorters: 'position',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
