Ext.define('TualoMDE.store.Report', {
    extend: 'Ext.data.Store',
    alias: 'store.report',
    storeId: 'Belege',
    sorters: [
        {
            direction: 'desc',
            property: 'id'
        }
    ],
    requires: [
        'Ext.data.proxy.Sql',
        'TualoMDE.model.Report'
    ],
    model: 'TualoMDE.model.Report',
    pageSize: 10000
});
