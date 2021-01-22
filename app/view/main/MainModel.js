/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('TualoMDE.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    data: {
        name: 'TualoMDE',
        fullname: '',
        currentClient: '',
        overview: 'Keine Daten vorhanden.',
        signumDown: false,
        signumXY: [-1,-1],
        signum: []
    },

    //TODO - add data, formulas and/or methods to support your view
});
