Ext.define('TualoMDE.store.Navigation', {
    extend: 'Ext.data.TreeStore',
    storeId: 'Navigation',
    rootData: {
        text: 'Touren',
        expanded: true,
        children: [
            /*
            {
                text: 'app',
                children: [
                    { leaf: true, text: 'Application.js', className: 'Ext.app.Applicaton' },
                    { leaf: true, text: 'Controller.js', className: 'Ext.app.Controller' },
                    { leaf: true, text: 'ViewController.js', className: 'Ext.app.ViewController' },
                    { leaf: true, text: 'ViewModel.js', className: 'Ext.app.ViewModel' }
                ]
            },
            {
                text: 'grid',
                expanded: true,
                children: [
                    { leaf: true, text: 'Grid.js', className: 'Ext.grid.Grid' },
                    { leaf: true, text: 'PagingToolbar.js', className: 'Ext.grid.PagingToolbar' },
                    { leaf: true, text: 'Tree.js', className: 'Ext.grid.Tree' }
                ]
            }*/
        ]
    },
    constructor: function(config) {
        // Since records claim the data object given to them, clone the data
        // for each instance.
        config = Ext.apply({
            root: Ext.clone(this.rootData)
        }, config);

        this.callParent([config]);
    }
});