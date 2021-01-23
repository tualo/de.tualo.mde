Ext.define('TualoMDE.store.ReportHeader', {
    extend: 'Ext.data.Store',
    alias: 'store.report_header',
    requires: [
        'Ext.data.proxy.SQL'
    ],
    model: 'TualoMDE.model.ReportHeader',
    storeId: 'Positionen',
    sorters: 'position',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    }
});
