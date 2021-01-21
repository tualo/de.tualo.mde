Ext.define('TualoMDE.model.Customer', {
    extend: 'TualoMDE.model.Base',

    fields: [
        {name: "id",type: "string"},

        {name: "position",type: "number"},
        {name: "farbe",type: "string"},
        {name: "tour",type: "string"},

        {name: "mo",type: "number"},
        {name: "di",type: "number"},
        {name: "mi",type: "number"},
        {name: "do",type: "number"},
        {name: "fr",type: "number"},
        {name: "sa",type: "number"},
        {name: "so",type: "number"},

        {name: "position_mo",type: "number"},
        {name: "position_di",type: "number"},
        {name: "position_mi",type: "number"},
        {name: "position_do",type: "number"},
        {name: "position_fr",type: "number"},
        {name: "position_sa",type: "number"},
        {name: "position_so",type: "number"},

        {name: "kundennummer",type: "string"},
        {name: "kostenstelle",type: "string"},
        {name: "name",type: "string"},
        {name: "strasse",type: "string"},
        {name: "hausnr",type: "string"},
        {name: "plz",type: "string"},
        {name: "ort",type: "string"},

        {name: "notiz",type: "string"},

        {name: "preiskategorie",type: "number"}
    ]
});

