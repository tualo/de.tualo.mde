Ext.define('TualoMDE.store.Report', {
    extend: 'Ext.data.Store',
    alias: 'store.report',
    requires: [
        'Ext.data.proxy.Sql',
        'TualoMDE.model.Report'
    ],
    model: 'TualoMDE.model.Report',
    proxy: {
        type: 'sql',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
