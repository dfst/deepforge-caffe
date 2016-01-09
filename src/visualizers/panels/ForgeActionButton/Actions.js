/*globals WebGMEGlobal*/
// These are actions defined for specific meta types. They are evaluated from
// the context of the ForgeActionButton
define([], function() {
    var ROOT_ID = '',
        CREATE_MODEL_TXT = 'Create new model';

    var openArchFolder = function() {
        var archDirNode = this.client.getNode(ROOT_ID)
            .getChildrenIds()
            .map(id => this.client.getNode(id))
            .filter(node => !!node)
            .find(node => node.getAttribute('name') === 'architectures');

        if (!archDirNode) {
           console.error('Could not find the architectures node. Is the ' +
               'territory configured correctly?');
           return;
        }

        WebGMEGlobal.State.registerActiveObject(archDirNode.getId());

        // Unfortunately, the change results in the button changing before the
        // tooltip is removed. This leaves the tooltip for creating the model
        // always on so we must manually remove it.
        var labels = document.getElementsByClassName('material-tooltip');
        for (var i = labels.length; i--;) {
            if(labels[i].innerText === CREATE_MODEL_TXT) {
                labels[i].remove();
            }
        }
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
            {
                name: CREATE_MODEL_TXT,
                icon: 'playlist_add',
                action: openArchFolder
            }
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
