Ext.define('TualoMDE.model.Report', {
    extend: 'TualoMDE.model.Base',
    requires: [
        'TualoMDE.model.ReportPosition',
        'TualoMDE.model.ReportSignum'
    ],

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
        
        {name: "referencenr",           type:"string",  critical: true },
        {name: "costcenter",            type:"number",  critical: true },
        
        {name: "__reporttype",           type:"string",  critical: true },
        {name: "__reportclient",           type:"string",  critical: true },

        {name: "__saved",            type:"boolean",  critical: false, default:false },
        {name: "__synced",            type:"boolean",  critical: false, default:false },

        // {name: "positions"},
//        {name: "payments"},
//        {name: "reductions"},
//        {name: "texts"},

        {
            name: "net", 
            type: "number", 
            calculate: function (data) {
                let s=0;
                //data.positions().forEach((item)=> s+=item.get('net'));
                return s;
            }
        }
    ],

    hasMany: [
        {model: 'ReportPosition', name: 'positions'},
        {model: 'ReportSignum', name: 'signum'}
    ],
    proxy: {
        type: 'sql'
        
    }
    
});
