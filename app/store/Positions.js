Ext.define('TualoMDE.store.ReportPositions', {
    extend: 'Ext.data.Store',
    storeId: 'Belege',
    requires: [
        'Ext.data.proxy.Sql',
        'TualoMDE.model.Report'
    ],


    model: 'TualoMDE.model.ReportPosition',
    storeId: 'ReportPositions',
    sorters: 'pos',
    
    proxy: {
        type: 'sql'
        
    }
});