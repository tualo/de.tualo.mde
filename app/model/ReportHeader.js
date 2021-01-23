Ext.define('TualoMDE.model.ReportHeader', {
    extend: 'TualoMDE.model.Base',

    fields: [

        {name: "id",                    type:"number",  critical: true, defaultValue: -1 },
        {name: "date",                  type:"date",    critical: true, dateFormat: 'Y-m-d', defaultValue: new Date() },
        {name: "bookingdate",           type:"date",    critical: true, dateFormat: 'Y-m-d', defaultValue: new Date() },
        {name: "service_period_start",  type:"date",    critical: true, dateFormat: 'Y-m-d', defaultValue: new Date() },
        {name: "service_period_stop",   type:"date",    critical: true, dateFormat: 'Y-m-d', defaultValue: new Date() },
        {name: "time",                  type:"date",    critical: true, dateFormat: 'H:i:s', defaultValue: new Date() },
        {name: "warehouse",             type:"number",  critical: false },
        {name: "reference",             type:"string",  critical: false },
        {name: "address",               type:"string",  critical: false },
        {name: "companycode",           type:"string",  critical: false },
        {name: "office",                type:"number",  critical: false },
        {name: "login",                 type:"string",  critical: false },
        {name: "kindofbill",            type:"string",  critical: true , default: "netto"},
        
        // {name: "positions"},
        {name: "payments"},
        {name: "reductions"},
        {name: "signum"},
        {name: "texts"},

        {
            name: "net", 
            type: "number", 
            calculate: function (data) {
                let s=0;
                data.positions().forEach((item)=> s+=item.get('net'));
                return s;
            }
        }
    ],

    hasMany: {model: 'ReportPosition', name: 'positions'},
    
});
