/*globals define*/
/*jshint node:true, browser:true*/

/**
 * Generated by PluginGenerator 0.14.0 from webgme on Sat Jan 09 2016 08:24:15 GMT-0600 (CST).
 */

define([
    'plugin/CaffeClassifier/CaffeClassifier/CaffeClassifier',
    '../common/DataPlugin',
    'TemplateCreator/templates/Constants'
], function (
    PluginBase,
    DataUtils,
    Constants
) {
    'use strict';

    /**
     * Initializes a new instance of CaffeTester.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin CaffeTester.
     * @constructor
     */
    var CaffeTester = function () {
        // Call base class' constructor.
        PluginBase.call(this);
        this._images = {};
    };

    // Prototypal inheritance from PluginBase.
    CaffeTester.prototype = Object.create(PluginBase.prototype);
    CaffeTester.prototype.constructor = CaffeTester;
    _.extend(CaffeTester.prototype, DataUtils.prototype);

    /**
     * Gets the name of the CaffeTester.
     * @returns {string} The name of the plugin.
     * @public
     */
    CaffeTester.prototype.getName = function () {
        return 'CaffeTester';
    };

    /**
     * Gets the semantic version (semver.org) of the CaffeTester.
     * @returns {string} The version of the plugin.
     * @public
     */
    CaffeTester.prototype.getVersion = function () {
        return '0.1.0';
    };

    CaffeTester.prototype.getConfigStructure = function(){
        return [
            // TODO: Test on arbitrary data
            {
                name: 'batch_size',
                displayName: 'Batch Size',
                description: 'Number of images to test at a time',
                value: 100,
                valueType: 'number',
                minValue: 0,
                readOnly: false
            },
            {
                name: 'testIter',
                displayName: 'Test Iterations',
                description: 'Number of forward passes',
                value: 100,
                valueType: 'number',
                minValue: 0,
                readOnly: false
            }
        ];
    };

    CaffeTester.prototype.main = function(callback){
        // Set the dataNode value from activeNode's pointer
        this.config = this.getCurrentConfig();
        this._images = {};

        var dataId = this.core.getPointerPath(this.activeNode, 'testData');
        if (!dataId) {
            this.result.setSuccess(false);
            return callback('No data node set. What data should we be testing on?', this.result);
        }

        this.core.loadByPath(this.rootNode, dataId, (err, node) => {
            if (err || !node) {
                this.result.setSuccess(false);
                return callback(err, this.result);
            }
            this.dataNode = node;
            PluginBase.prototype.main.call(this, callback);
        });
    };

    // By default, the model file is available (as this.MODEL_NAME) and the executor
    // config is also added. In this next method, we will prepare the other required
    // files:
    //   + network prototxt (created from the template)
    //   + images (as in CaffeTrainer)
    CaffeTester.prototype.addExecutionFiles = function (files, callback) {
        var templateHash = this.core.getAttribute(this.activeNode, 'template'),
            content;

        this.blobClient.getObject(templateHash, (err, arrayBuffer) => {
            var dataLayer,
                template;

            if (err) {
                return callback(err);
            }

            // Creating the network prototxt
            try {
                content = JSON.parse(
                    String.fromCharCode.apply(null, new Uint8Array(arrayBuffer))
                );
            } catch (e) {
                var name = this.core.getAttribute(this.dataNode, 'name')
                return callback('Could not parse template from ' + name);
            }

            this.logger.debug('Retrieved the network protoxt');

            // Add the data layer to the template
            dataLayer = this.createDataLayer(content);

            // Get the template name
            this.PROTO_NAME = Object.keys(content)
                .find(name => ['dataName', 'labelName'].indexOf(name) === -1);

            template = _.template(content[this.PROTO_NAME]);
            files[this.PROTO_NAME] = template({dataLayer});

            // Adding the images
            this.prepareLabeledData(this.dataNode, (err, images) => {
                // Add it to the "files" object by name
                var images;
                if (err) {
                    return callback(err);
                }

                // Record the file hashes and add the txt file
                files[DataUtils.DataName] = images[DataUtils.DataName];
                Object.keys(images)
                    .filter(name => name !== DataUtils.DataName)  // remove txt file
                    .forEach(name => this._images[name] = images[name]);

                return callback(null);
            });
        });
    };

    CaffeTester.prototype.beforeArtifactSave = function (artifact, callback) {
        // Add the image hashes
        artifact.addObjectHashes(this._images, callback);
    };

    CaffeTester.prototype.createDataLayer = function (content) {
        var template = _.template(DataUtils.dataTemplate),
            data = {
            name: content.dataName,
            source: DataUtils.DataName
        };

        data[Constants.PREV] = [];
        data[Constants.NEXT] = [
            {name: content.dataName},
            {name: content.labelName}
        ];

        data.new_height = this.core.getAttribute(this.dataNode, 'height');
        data.new_width = this.core.getAttribute(this.dataNode, 'width');
        data.batch_size = this.config.batch_size;
        return template(data);
    };

    CaffeTester.prototype.getExecutorConfig = function () {
        // The prototxt should be more generic so we can add whatever data
        // type we want TODO
        var cmd = 'caffe test -model ' + this.PROTO_NAME + ' -weights ' +
                this.MODEL_NAME + ' -iterations ' + this.config.testIter;

        // Images? TODO
        // Images are specified in the model/architecture file

        cmd = cmd.split(' ');
        return {
            cmd: cmd.shift(),
            args: cmd,
            resultArtifacts: [
                // Most feedback will be provided realtime - not from collected files
                {
                    name: 'all',
                    resultPatterns: []
                }
            ]
        }
    };

    CaffeTester.prototype.onJobSuccess = function (jInfo, callback) {
        this.result.addArtifact(jInfo.resultHashes.all);
        this.createMessage(null, 'Overall loss: ');  // TODO
        this.result.setSuccess(true);
        return callback(null, this.result);
    };

    return CaffeTester;
});
