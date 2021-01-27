Ext.define('TualoMDE.store.CArticles', {
    extend: 'Ext.data.Store',

    alias: 'store.carticles',

    model: 'TualoMDE.model.CArticle',
    storeId: 'CArticles',
    sorters: 'position',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
