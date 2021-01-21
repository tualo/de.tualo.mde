Ext.define('TualoMDE.model.Tour', {
    extend: 'TualoMDE.model.Base',

    fields: [
        {name: "id",type: "number"},
        {name: "position",type: "number"},
        {name: "geschaeftsstelle",type: "string"},
        {name: "tour",type: "string"},
        {name: "farbe",type: "string"}
    ]
});
