/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('TualoMDE.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    data: {
        name: 'TualoMDE',
        fullname: '',
        tour: null,
        searchmode: false,
        customerrecord: false,
        currentClient: '',
        currentReport: -1,

        referenceNumber: 100000,
        
        currentDate: new Date(),
        overview: 'Keine Daten vorhanden.',
        signumDown: false,
        signumXY: [-1,-1],
        signum: []
    },
    stores: {
        report: {
            type: 'report'
        }

    } 
    //TODO - add data, formulas and/or methods to support your view
});
