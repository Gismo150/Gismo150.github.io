/*
 MIT License

 Copyright (c) 2017 Daniel Braun

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

(/** @exports TEX*/function (scope, undefined) {
    'use strict';

    var TEX = {};


    if (typeof module !== 'undefined') {
        module.exports = TEX;
    } else {
        scope.TEX = TEX;
    }


    /**
     * @description
     * The main Tex class. The constructor collects the HTMLImageElement and its name. This
     * information can then be used later on when creating your texture buffer. See
     * TEX.initBuffer for an example of how to use the newly created texture.
     *
     * @memberOf module:TEX
     * @constructor
     * @param {Object} imageData HTMLImageElement representation of an image file
     * @param {String} name Name of the HTMLImageElement
     */
    TEX.Texture = function (imageData, name) {
        /**
         * @description Stores the HTMLImageElement
         * @type {HTMLImageElement}
         *
         */
        this.image = imageData;
        /**
         * @description Stores the name of the image
         * @type {String}
         */
        this.name = name;
    };

    var Ajax = function () {
        this.get = function (url, callback) {
            var image = new Image();
            // if ((new URL(url)).origin !== window.location.origin) {
            image.crossOrigin = "";
            // }
            image.onload = function () {

                //If the width and height are both zero, the image is considered invalid.
                if ('naturalHeight' in this) {
                    if (this.naturalHeight + this.naturalWidth === 0) {
                        this.onerror();
                        return;
                    }
                } else if (this.width + this.height === 0) {
                    this.onerror();
                    return;
                }
                // there haven't been any errors in retrieving the images
                // call the callback
                callback(image);
            };
            image.onerror = function () {
                //display error
                console.error("Error loading image: " + this.src);
                console.error("The provided URL path may be wrong.");
                console.log("----------------------------------------------------------");
                console.error("The URL path for loading images provided by the editor always begins with: 'src/texture/[imageName].(jpg|png|gif|bmp)'.");
                console.error("A list of all available images within the editor can be seen in the menu.");
                console.log("----------------------------------------------------------");
                console.warn("Note: Cross Origin Resource Sharing (CORS) is enabled. You may request images from other domains, iff the requested domain allows CORS.");
                console.warn("That is up to the server. Github pages gives permission, flickr.com gives permission, imgur.com gives permssion, but most websites do not.");
            };
            image.src = url;
        }
    };

    /**
     * @description
     * Takes in an Javascript object of ['texture_name': '/url/to/TEX/file'] pairs and a callback
     * function. Each image file will be ajaxed in and automatically converted to
     * an TEX.Texture Object. When all images have been successfully downloaded the callback
     * function provided will be called and passed in an Javascript object containing
     * the newly created TEX.texture Objects of ['texture_name': TEX.Texture] pairs.
     * <pre>
     *  Note: Cross Origin Resource Sharing (CORS) is enabled. You may request images from other domains, iff the requested domain allows CORS.
     *  That is up to the server. Github pages give permission, flickr.com gives permission, imgur.com gives permssion, but most websites do not.
     *
     *  Note: In order to use this function as a way to download textures, a webserver of some sort must be used.
     * </pre>
     *
     * The URL path for loading images provided by the Editor always begins with: 'src/texture/[imageName].(jpg|png|gif|bmp)'. A list of all available images within
     * the editor can be seen in the menu under sources -> texture.
     *
     * @memberOf module:TEX
     * @param {Object} nameAndURLs An object where the key is the name of the texture and the value is the url to that image file
     *
     * @param {Function} completionCallback Should contain a function that will take one parameter: an object array where the keys will be the unique object name and the value will be a Texture object
     *
     * @param {Object} textures In case other textures are loaded separately or if a previously declared variable is desired to be used, pass in a (possibly empty) json object of the pattern: { '< tex_name >': TEX.Texture }
     *
     */
    TEX.downloadTextures = function (nameAndURLs, completionCallback, textures) {
        _TEXisLoading = true;
        if (textures === undefined) textures = {};
        // the total number of meshes. this is used to implement "blocking"
        var semaphore = Object.keys(nameAndURLs).length;
        // loop over the tex_name,url key,value pairs
        for (var tex_name in nameAndURLs) {
            if (nameAndURLs.hasOwnProperty(tex_name)) {
                new Ajax().get(nameAndURLs[tex_name], (function (name) {
                    console.log("Loading Texture: " + name + ".");
                    return function (data) {
                        textures[name] = new TEX.Texture(data, name);
                        semaphore--;
                        if (semaphore === 0) {
                            // avoiding multiple requestAnimationFrame calls
                            if (_TEXisLoading) {
                                console.log("Finished loading textures.");
                                for (tex_name in textures) {
                                    console.log("------------------------------------------------");
                                    console.log("Texture: " + textures[tex_name].name);
                                    console.log("Size: [" + textures[tex_name].image.width + "x" + textures[tex_name].image.height + "]");
                                }
                                // there haven't been any errors in retrieving the textures
                                // call the callback
                                completionCallback(textures);
                                _TEXisLoading = false;
                            }
                        }
                    }
                })(tex_name));
            }
        }


    };

    function isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }

    var _buildBuffer = function (gl, imageData) {
        var texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);

        //For TEXTURE_MAG_FILTER only NEAREST and LINEAR are valid settings.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        if (isPowerOf2(imageData.width) && isPowerOf2(imageData.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        //gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    };

    /**
     * @description
     * Takes in the WebGL context and a TEX Object, then creates and appends the texture buffer
     * to the texture object as a attribute.
     *
     * The newly created texture attribute is:
     * <pre>
     * Attribute    | Description
     * textureBuffer| A WebGLTexture object to which the image is bound to.
     * </pre>
     *
     * Access the WebGLTexture object via texture.textureBuffer
     *
     * @memberOf module:TEX
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext
     * @param {Texture} texture A single 'TEX.Texture' instance
     */
    TEX.initTextureBuffer = function (gl, texture) {
        if (texture === undefined) {
            console.log("Initalization of texture buffers failed.");
            console.log("TEX.initTextureBuffer(gl, undefined)");
        } else {
            texture.textureBuffer = _buildBuffer(gl, texture.image);
        }
    };

    /**
     * @description
     * Takes in the WebGL context and a Texture. Deletes the texture buffer,
     * which you would do when deleting an object from a scene so that you don't leak video memory.
     *
     * The deleted texture attribute is:
     * <pre>
     * Attribute    | Description
     * textureBuffer| A WebGLTexture object to which the image is bound to.
     * </pre>
     *
     * Note: You are able to use TEX.initTextureBuffer again in order recreate a texture buffer
     * Excessive buffer creation and deletion leads to video memory fragmentation. Beware.
     *
     * @memberOf module:TEX
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext
     * @param {Texture} texture A single 'TEX.Texture' instance
     *
     */
    TEX.deleteTextureBuffer = function (gl, texture) {
        if (texture === undefined) {
            console.log("Deletion of texture buffer failed.");
            console.log("TEX.deleteTexBuffer(gl, undefined)");

        } else {
            gl.deleteBuffer(texture.textureBuffer);
        }
    };
})(this);