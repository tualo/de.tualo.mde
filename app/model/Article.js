Ext.define('TualoMDE.model.Article', {
    extend: 'TualoMDE.model.Base',

    fields: [
        {name: "id",type: "number"},
        {name: "artikelnummer",type: "number"},
        {name: "farbe",type: "number"},
        {name: "gruppe",type: "number"},
        {name: "pos",type: "number"},
        {name: "preis",type: "number"},
        {name: "preiskategorie",type: "number"},
        {name: "steuer",type: "number"},
        {name: "warengruppe",type: "number"},
        {name: "wgsort",type: "number"}

    ]
});
