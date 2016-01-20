/*globals define*/
/*jshint node:true, browser:true*/

/**
 * Upload a new group of images to the project
 */

define([
    'plugin/PluginConfig',
    'plugin/PluginBase',
    'jszip',
    'image-size',
    'buffer'
], function (
    PluginConfig,
    PluginBase,
    JsZip,
    sizeOf,
    NodeBuffer
) {
    'use strict';

    var Buffer = NodeBuffer;
    /**
     * Initializes a new instance of UploadData.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin UploadData.
     * @constructor
     */
    var UploadData = function () {
        // Call base class' constructor.
        PluginBase.call(this);
    };
    UploadData.prototype.Buffer = Buffer;

    // Prototypal inheritance from PluginBase.
    UploadData.prototype = Object.create(PluginBase.prototype);
    UploadData.prototype.constructor = UploadData;

    /**
     * Gets the name of the UploadData.
     * @returns {string} The name of the plugin.
     * @public
     */
    UploadData.prototype.getName = function () {
        return 'UploadData';
    };

    /**
     * Gets the semantic version (semver.org) of the UploadData.
     * @returns {string} The version of the plugin.
     * @public
     */
    UploadData.prototype.getVersion = function () {
        return '0.1.0';
    };

    /**
     * Gets the configuration structure for the UploadData.
     * The ConfigurationStructure defines the configuration for the plugin
     * and will be used to populate the GUI when invoking the plugin from webGME.
     * @returns {object} The version of the plugin.
     * @public
     */
    UploadData.prototype.getConfigStructure = function () {
        return [
            {
                name: 'name',
                displayName: 'Name of Image Set',
                regex: '^[a-zA-Z]+$',
                regexMessage: 'Name can only contain English characters!',
                description: 'Name of the new set of images',
                value: '',
                valueType: 'string',
                readOnly: false
            },
            {
                name: 'images',
                displayName: 'Images',
                description: 'Select a zip file of images',
                value: '',
                valueType: 'asset',
                readOnly: false
            }
        ];
    };


    /**
     * Main function for the plugin to execute. This will perform the execution.
     * Notes:
     * - Always log with the provided logger.[error,warning,info,debug].
     * - Do NOT put any user interaction logic UI, etc. inside this method.
     * - callback always has to be called even if error happened.
     *
     * @param {function(string, plugin.PluginResult)} callback - the result callback
     */
    UploadData.prototype.main = function (callback) {
        var self = this,
            config = this.getCurrentConfig(),
            dataName = config.name,
            dataNode,
            nodeObject,
            imageHash = config.images,
            imageZip = new JsZip(),
            content;


        // Create a new data node
        this.dataNode = self.core.createNode({
            parent: self.activeNode,
            base: self.META.DataGroup
        });
        this.blobClient.getMetadata(imageHash, (err, mdata) => {
            var name = mdata.name.replace(/\.zip$/, '');
            if (err) {
                return callback(err);
            }
            this.core.setAttribute(this.dataNode, 'name', name);

            // If performance is too bad, we may want to run this on the server
            // or in an executor TODO
            this.blobClient.getObject(imageHash, (err, content) => {
                // Unzip the images file
                var files = imageZip.load(content).files,
                    names = Object.keys(files),
                    len = names.length,
                    onComplete = () => {
                        if (--len === 0) {
                            this.onFinished(callback);
                        }
                    };

                // Add each zipped image
                names.forEach(name => this.uploadImage(name, files[name], onComplete));

                // Remove the zip file from the blob
                // TODO
            });
        });
    };

    UploadData.prototype.uploadImage = function(name, zipObject, callback) {
        console.log('about to upload ' + name);
        // Create the image node in this.dataNode
        var buffer = zipObject.asArrayBuffer(),
            size,
            image = this.core.createNode({
                parent: this.dataNode,
                base: this.META.Image
            });

        // get the dimensions
        buffer = new Buffer(buffer);
        size = sizeOf(buffer);

        // upload to the blob
        this.blobClient.putFile(name, buffer, (err, hash) => {
            this.core.setAttribute(image, 'name', name);
            this.core.setAttribute(image, 'hash', hash);
            this.core.setAttribute(image, 'width', size.width);
            this.core.setAttribute(image, 'height', size.height);
            callback(err);
        });
    };

    UploadData.prototype.onFinished = function(callback) {
        // Set the name and data hash
        this.save('UploadData created new dataset', (err) => {
            if (err) {
                callback(err, this.result);
                return;
            }
            this.result.setSuccess(true);
            callback(null, this.result);
        });
    };

    return UploadData;
});
