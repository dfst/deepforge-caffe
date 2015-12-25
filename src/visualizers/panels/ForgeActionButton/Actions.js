/*globals WebGMEGlobal*/
// These are actions defined for specific meta types. They are evaluated from
// the context of the ForgeActionButton
define([], function() {
    var ROOT_ID = '';

    var openArchFolder = function() {
        // TODO: The territory needs to be updated before this can be 
        // used. Otherwise, the 'architectures' dir may not have been loaded
        // by the browser
        var archDirNode = this.client.getNode(ROOT_ID)
            .getChildrenIds()
            .map(id => this.client.getNode(id))
            .find(node => node.getAttribute('name') === 'architectures');

         WebGMEGlobal.State.registerActiveObject(archDirNode.getId());
    };

    var createNewArchitecture = function() {
        // Create CNN node in the current dir
        // Get CNN node type
        var parentId = this._currentNodeId,
            baseId = this.client.getAllMetaNodes()
                .find(node => node.getAttribute('name') === 'CNN')
                .getId();

        this.client.createChild({parentId, baseId});
    };

    return {
        ModelFolder: [
            //{
                //name: 'Create new model',
                //icon: 'playlist_add',
                //action: openArchFolder
            //}
        ],

        Folder: [
            {
                name: 'Create new architecture',
                icon: 'queue',
                action: createNewArchitecture
            }
        ]
    };
});
