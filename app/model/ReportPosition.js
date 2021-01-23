Ext.define('TualoMDE.model.ReportPosition', {
    extend: 'TualoMDE.model.Base',

    fields: [

        {name: "id",                    type:"number",  critical: true},
        {name: "report",                type:"number",  critical: true,     reference: "ReportHeader"},
        {name: "date",                  type:"date",    critical: false,    dateFormat: 'Y-m-d', defaultValue: new Date() },
        {name: "article",               type:"string",  critical: true},
        {name: "additionatext",         type:"string",  critical: false},
        {name: "note",                  type:"string",  critical: false},
        {name: "reference",             type:"string",  critical: false},
        {name: "account",               type:"string",  critical: true},
        {name: "singleprice",           type:"number",  critical: true},
        {name: "amount",                type:"number",  critical: true},
        {name: "net",                   type:"number",  critical: true},
        {name: "gross",                 type:"number",  critical: true},
        {name: "taxrate",               type:"number",  critical: true},
        {name: "vat",                   type:"number",  critical: true},
        
        
    ],
});