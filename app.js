/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'TualoMDE.Application',

    name: 'TualoMDE',

    requires: [
        // This will automatically load all classes in the TualoMDE namespace
        // so that application classes do not need to require each other.
        'TualoMDE.*'
    ],

    // The name of the initial view to create.
    mainView: 'TualoMDE.view.main.Main'
});
