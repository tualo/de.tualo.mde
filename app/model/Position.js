Ext.define('TualoMDE.model.Position', {
    extend: 'TualoMDE.model.Base',

    fields: [
        {name: "id",type: "number"},
        {name: "position",type: "number"},
        {name: "kundennummer",type: "string"},
        {name: "kostenstelle",type: "string"},
        {name: "farbe",type: "string"},
        {name: "epreis",type: "number"},
        {name: "bemerkung",type: "string"},
        {name: "artikel",type: "string"},
        {name: "anzahl",type: "number"},
        {name: "belegart",type: "number"},
        
        {
            name: 'anzahl_formated',
            calculate: function (data) {
                return Ext.util.Format.number(data.anzahl,'0,000/i');// + ' ' + data.lastName;
            }
        },
        {
            name: 'epreis_formated',
            calculate: function (data) {
                return Ext.util.Format.number(data.epreis,'0,000.00/i');// + ' ' + data.lastName;
            }
        }
    ]
});
