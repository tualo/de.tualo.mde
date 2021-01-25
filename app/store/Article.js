Ext.define('TualoMDE.store.Article', {
    extend: 'Ext.data.Store',

    alias: 'store.article',

    model: 'TualoMDE.model.Customer',
    storeId: 'Artikel',
    sorters: ['wgsort','pos'],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
