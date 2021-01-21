Ext.define('TualoMDE.store.Customers', {
    extend: 'Ext.data.Store',

    alias: 'store.customers',

    model: 'TualoMDE.model.Customer',
    storeId: 'Kunden',
    sorters: 'position',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    }
});
