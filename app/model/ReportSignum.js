Ext.define('TualoMDE.model.ReportSignum', {
    extend: 'TualoMDE.model.Base',

    idPropery: 'pos',
    fields: [
        {name: "id",             type:"number",  critical: true, reference: "ReportHeader"},
        {name: "pos",            type:"number",  critical: true},
        {name: "x",              type:"number",  critical: true},
        {name: "y",              type:"number",  critical: true},
    ],
    proxy: {
        type: 'sql'
        
    }
});