Ext.define('TualoMDE.model.ReportPosition', {
    extend: 'TualoMDE.model.Base',
    idPropery: 'position',
    fields: [

        {name: "id",                    type:"number",  critical: true},
        {name: "position",              type:"number",  critical: true},
        {name: "reportnr",              type:"number",  critical: true,     reference: "ReportHeader"},
        {name: "date",                  type:"date",    critical: false,    dateFormat: 'Y-m-d', defaultValue: new Date() },
        {name: "article",               type:"string",  critical: true},
        {name: "additionaltext",         type:"string",  critical: false},
        {name: "note",                  type:"string",  critical: false},
        {name: "reference",             type:"string",  critical: false},
        {name: "account",               type:"string",  critical: true},
        {name: "singleprice",           type:"number",  critical: true},
        {name: "amount",                type:"number",  critical: true},
        {name: "net",                   type:"number",  critical: true},
        {name: "gross",                 type:"number",  critical: true},
        {name: "taxrate",               type:"number",  critical: true},
        {name: "vat",                   type:"number",  critical: true},

        {
            name: "warengruppen_farbe", 
            type: "string", 
            calculate: function (data) {
                let store = Ext.data.StoreManager.lookup('Artikel'),
                    rec = store.findRecord('gruppe',data.article,0,false,true,true );
                if(rec){
                    return rec.get('farbe');
                }
                return "";
            }
        }
        
    ],
    proxy: {
        type: 'sql'
        
    }
});