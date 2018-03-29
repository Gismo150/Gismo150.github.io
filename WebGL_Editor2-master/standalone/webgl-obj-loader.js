/*
 MIT License

 Copyright (c) 2013 Aaron Boman and aaronboman.com

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
(/** @exports OBJ*/function (scope, undefined) {
    'use strict';
    var OBJ = {};


    if (typeof module !== 'undefined') {
        module.exports = OBJ;
    } else {
        scope.OBJ = OBJ;
    }


    /**
     * @description
     * The main Mesh class. The constructor will parse through the OBJ file data
     * and collect the vertex, vertex normal, texture, and face information. This
     * information can then be used later on when creating your VBOs. See
     * OBJ.initMeshBuffers for an example of how to use the newly created Mesh
     *
     * @memberOf module:OBJ
     * @constructor
     *
     * @param {String} objectData A string representation of an OBJ file with newlines preserved
     * @param name Name of the loaded OBJ file
     */
    OBJ.Mesh = function (objectData, name) {


        /*
         The OBJ file format does a sort of compression when saving a object in a
         program like Blender. There are at least 3 sections (4 including textures)
         within the file. Each line in a section begins with the same string:
         * 'v': indicates vertex section
         * 'vn': indicates vertex normal section
         * 'f': indicates the faces section
         * 'vt': indicates vertex texture section (if textures were used on the object)
         Each of the above sections (except for the faces section) is a list/set of
         unique vertices.

         Each line of the faces section contains a list of
         (vertex, [texture], normal) groups
         Some examples:
         // the texture index is optional, both formats are possible for models
         // without a texture applied
         f 1/25 18/46 12/31
         f 1//25 18//46 12//31

         // A 3 vertex face with texture indices
         f 16/92/11 14/101/22 1/69/1

         // A 4 vertex face
         f 16/92/11 40/109/40 38/114/38 14/101/22

         The first two lines are examples of a 3 vertex face without a texture applied.
         The second is an example of a 3 vertex face with a texture applied.
         The third is an example of a 4 vertex face. Note: a face can contain N
         number of vertices.

         Each number that appears in one of the groups is a 1-based index
         corresponding to an item from the other sections (meaning that indexing
         starts at one and *not* zero).

         For example:
         `f 16/92/11` is saying to
         - take the 16th element from the [v] vertex array
         - take the 92nd element from the [vt] texture array
         - take the 11th element from the [vn] normal array
         and together they make a unique vertex.
         Using all 3+ unique Vertices from the face line will produce a polygon.

         Now, you could just go through the OBJ file and create a new vertex for
         each face line and WebGL will draw what appears to be the same object.
         However, vertices will be overlapped and duplicated all over the place.

         Consider a cube in 3D space centered about the origin and each side is
         2 units long. The front face (with the positive Z-axis pointing towards
         you) would have a Top Right vertex (looking orthogonal to its normal)
         mapped at (1,1,1) The right face would have a Top Left vertex (looking
         orthogonal to its normal) at (1,1,1) and the top face would have a Bottom
         Right vertex (looking orthogonal to its normal) at (1,1,1). Each face
         has a vertex at the same coordinates, however, three distinct vertices
         will be drawn at the same spot.

         To solve the issue of duplicate Vertices (the `(vertex, [texture], normal)`
         groups), while iterating through the face lines, when a group is encountered
         the whole group string ('16/92/11') is checked to see if it exists in the
         packed.hashindices object, and if it doesn't, the indices it specifies
         are used to look up each attribute in the corresponding attribute arrays
         already created. The values are then copied to the corresponding unpacked
         array (flattened to play nice with WebGL's ELEMENT_ARRAY_BUFFER indexing),
         the group string is added to the hashindices set and the current unpacked
         index is used as this hashindices value so that the group of elements can
         be reused. The unpacked index is incremented. If the group string already
         exists in the hashindices object, its corresponding value is the index of
         that group and is appended to the unpacked indices array.
         */
        var verts = [], vertNormals = [], textures = [], unpacked = {};
        // unpacking stuff
        unpacked.verts = [];
        unpacked.norms = [];
        unpacked.textures = [];
        unpacked.hashindices = {};
        unpacked.indices = [];
        unpacked.index = 0;
        // array of lines separated by the newline
        var lines = objectData.split('\n');

        var VERTEX_RE = /^v\s/;
        var NORMAL_RE = /^vn\s/;
        var TEXTURE_RE = /^vt\s/;
        var FACE_RE = /^f\s/;
        var WHITESPACE_RE = /\s+/;

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            var elements = line.split(WHITESPACE_RE);
            elements.shift();

            if (VERTEX_RE.test(line)) {
                // if this is a vertex
                verts.push.apply(verts, elements);
                // writeLog("its a vertex");
            } else if (NORMAL_RE.test(line)) {
                // if this is a vertex normal
                vertNormals.push.apply(vertNormals, elements);
            } else if (TEXTURE_RE.test(line)) {
                // if this is a texture
                textures.push.apply(textures, elements);
            } else if (FACE_RE.test(line)) {
                // if this is a face
                /*
                 split this face into an array of vertex groups
                 for example:
                 f 16/92/11 14/101/22 1/69/1
                 becomes:
                 ['16/92/11', '14/101/22', '1/69/1'];
                 */
                var quad = false;
                for (var j = 0, eleLen = elements.length; j < eleLen; j++) {
                    // Triangulating quads
                    // quad: 'f v0/t0/vn0 v1/t1/vn1 v2/t2/vn2 v3/t3/vn3/'
                    // corresponding triangles:
                    //      'f v0/t0/vn0 v1/t1/vn1 v2/t2/vn2'
                    //      'f v2/t2/vn2 v3/t3/vn3 v0/t0/vn0'
                    if (j === 3 && !quad) {
                        // add v2/t2/vn2 in again before continuing to 3
                        j = 2;
                        quad = true;
                    }
                    if (elements[j] in unpacked.hashindices) {
                        unpacked.indices.push(unpacked.hashindices[elements[j]]);
                    }
                    else {
                        /*
                         Each element of the face line array is a vertex which has its
                         attributes delimited by a forward slash. This will separate
                         each attribute into another array:
                         '19/92/11'
                         becomes:
                         vertex = ['19', '92', '11'];
                         where
                         vertex[0] is the vertex index
                         vertex[1] is the texture index
                         vertex[2] is the normal index
                         Think of faces having Vertices which are comprised of the
                         attributes location (v), texture (vt), and normal (vn).
                         */
                        var vertex = elements[j].split('/');
                        /*
                         The verts, textures, and vertNormals arrays each contain a
                         flattend array of coordinates.

                         Because it gets confusing by referring to vertex and then
                         vertex (both are different in my descriptions) I will explain
                         what's going on using the vertexNormals array:

                         vertex[2] will contain the one-based index of the vertexNormals
                         section (vn). One is subtracted from this index number to play
                         nice with javascript's zero-based array indexing.

                         Because vertexNormal is a flattened array of x, y, z values,
                         simple pointer arithmetic is used to skip to the start of the
                         vertexNormal, then the offset is added to get the correct
                         component: +0 is x, +1 is y, +2 is z.

                         This same process is repeated for verts and textures.
                         */
                        // vertex position
                        unpacked.verts.push(+verts[(vertex[0] - 1) * 3 + 0]);
                        unpacked.verts.push(+verts[(vertex[0] - 1) * 3 + 1]);
                        unpacked.verts.push(+verts[(vertex[0] - 1) * 3 + 2]);
                        // vertex textures
                        if (textures.length) {
                            unpacked.textures.push(+textures[(vertex[1] - 1) * 2 + 0]);
                            unpacked.textures.push(+textures[(vertex[1] - 1) * 2 + 1]);
                        }
                        // vertex normals
                        unpacked.norms.push(+vertNormals[(vertex[2] - 1) * 3 + 0]);
                        unpacked.norms.push(+vertNormals[(vertex[2] - 1) * 3 + 1]);
                        unpacked.norms.push(+vertNormals[(vertex[2] - 1) * 3 + 2]);
                        // add the newly created vertex to the list of indices
                        unpacked.hashindices[elements[j]] = unpacked.index;
                        unpacked.indices.push(unpacked.index);
                        // increment the counter
                        unpacked.index += 1;
                    }
                    if (j === 3 && quad) {
                        // add v0/t0/vn0 onto the second triangle
                        unpacked.indices.push(unpacked.hashindices[elements[0]]);
                    }
                }
            }
        }
        /**
         * @description Array contains Vertex Position Coordinates (does not include w).
         * @type {Array}
         *
         */
        this.vertices = unpacked.verts;
        /**
         * @description Array contains the Vertex Normals.
         * @type {Array}
         *
         */
        this.vertexNormals = unpacked.norms;
        /**
         * @description Array contains the Texture Coordinates.
         * @type {Array}
         *
         */
        this.textures = unpacked.textures;
        /**
         * @description Array contains the indices of the faces.
         * @type {Array}
         *
         */
        this.indices = unpacked.indices;
        /**
         * @description  Name of the Mesh.
         * @type {String}
         *
         */
        this.name = name;
    };



    var loader = function () {
        var _this = this;
        this.request = new XMLHttpRequest();
        try {
            _this.request.responseType = 'text';
        } catch (e) {
        }

        this.get = function(url, callback) {
            _this.request.onreadystatechange = function () {
                if (_this.request.readyState === 4) {
                    callback(_this.request.responseText, _this.request.status);
                }
            };
            _this.request.open("GET", url, true);
            _this.request.send();
        }
    };


var Ajax = function () {
    // this is just a helper class to ease ajax calls
    var _this = this;
    this.xmlhttp = new XMLHttpRequest();

    this.get = function (url, callback) {
        _this.xmlhttp.onreadystatechange = function () {
            if (_this.xmlhttp.readyState === 4) {
                callback(_this.xmlhttp.responseText, _this.xmlhttp.status);
            }
        };
        _this.xmlhttp.open('GET', url, true);
        _this.xmlhttp.send();
    }
};

/**

 * @description
 * Takes in an object of 'mesh_name': 'src/object/[objectName].obj' pairs and a callback
 * function. Each OBJ file will be ajaxed in and automatically converted to
 * an OBJ.Mesh. When all files have successfully downloaded the callback
 * function provided will be called and passed in an object containing
 * the newly created meshes.
 *
 * <pre>
 * Note: Cross Origin Resource Sharing (CORS) is NOT enabled for loading objects. You can not download obj files from other domains.
 *
 * Note: In order to use this function as a way to download objects, a webserver of some sort must be used.
 * </pre>
 *
 * The URL path for loading objects provided by the Editor always begins with: 'src/object/[objectName].obj'. A list of all available objects within
 * the editor can be seen in the menu under sources -> object.
 *
 * @memberOf module:OBJ
 * @param {Object} nameAndURLs an object where the key is the name of the mesh and the value is the url to that mesh's OBJ file
 *
 * @param {Function} completionCallback should contain a function that will take one parameter: an object array where the keys will be the unique object name and the value will be a Mesh object
 *
 * @param {Object} meshes In case other meshes are loaded separately or if a previously declared variable is desired to be used, pass in a (possibly empty) json object of the pattern: { '< mesh_name >': OBJ.Mesh }
 *
 */
OBJ.downloadMeshes = function (nameAndURLs, completionCallback, meshes) {
    _OBJisLoading = true;
    // the total number of meshes. this is used to implement "blocking"
    var semaphore = Object.keys(nameAndURLs).length;
    // if error is true, an alert will given
    var error = false;
    // this is used to check if all meshes have been downloaded
    // if meshes is supplied, then it will be populated, otherwise
    // a new object is created. this will be passed into the completionCallback
    if (meshes === undefined) meshes = {};
    // loop over the mesh_name,url key,value pairs
    for (var mesh_name in nameAndURLs) {
        if (nameAndURLs.hasOwnProperty(mesh_name)) {
            new Ajax().get(nameAndURLs[mesh_name], (function (name) {
                console.log("Loading mesh: " + name + ".");
                return function (data, status) {
                    if (status === 200) {
                        meshes[name] = new OBJ.Mesh(data, name);
                    }
                    else {
                        error = true;
                        console.error('An error has occurred and the mesh "' +
                            name + '" could not be downloaded.');
                    }
                    // the request has finished, decrement the counter
                    semaphore--;
                    if (semaphore === 0) {
                        if (error) {
                            // if an error has occurred, the user is notified here and the callback is not called
                            console.error("The provided URL path may be wrong.");
                            console.log("----------------------------------------------------------");
                            console.error("The URL path for loading objects provided by the editor always begins with: './src/object/[objectName].obj'.");
                            console.error("A list of all available objects within the editor can be seen in the menu.");
                            console.log("----------------------------------------------------------");
                            console.warn("Note: Cross Origin Resource Sharing (CORS) is NOT enabled.");
                            throw '';
                        }

                        // checking for _OBJisLoading because if you smash the run button or going to quickly into fullscreen and back would cause a multiple requestAnimationFrame
                        //FOLLOWING CODE WAS ADDED FOR THE WEBGL-EDITOR
                        if (_OBJisLoading) {
                            console.log("Finished loading meshes.");

                            for (var mesh_name in meshes) {
                                console.log("------------------------------------------------");
                                console.log("Mesh: " + meshes[mesh_name].name);
                                console.log("Vertices:" + meshes[mesh_name].vertices.length / 3);
                                console.log("Vertex normals:" + meshes[mesh_name].vertexNormals.length / 3);
                                console.log("Texture coordinates:" + meshes[mesh_name].textures.length / 2);
                                console.log("Indices:" + meshes[mesh_name].indices.length);
                            }
                            // there haven't been any errors in retrieving the meshes
                            // call the callback
                            completionCallback(meshes);
                            _OBJisLoading = false;
                        }
                    }
                }
            })(mesh_name));
        }
    }


};


var _buildBuffer = function (gl, type, data, itemSize) {
    var buffer = gl.createBuffer();
    var arrayView = type === gl.ARRAY_BUFFER ? Float32Array : Uint16Array;
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, new arrayView(data), gl.STATIC_DRAW);
    buffer.itemSize = itemSize;
    buffer.numItems = data.length / itemSize;
    return buffer;
};

/**
 * @description
 * Takes in the WebGL context and a Mesh, then creates and appends the buffers
 * to the mesh object as attributes.
 *
 * The newly created mesh attributes are:
 *<pre>
 * Attribute              | Description
 * normalBuffer           | contains the Vertex Normals
 * normalBuffer.itemSize  | set to 3 items
 * normalBuffer.numItems  | the total number of vertex normals
 * ___________________________________________________________________________________________________
 * textureBuffer          | contains the Texture Coordinates
 * textureBuffer.itemSize | set to 2 items
 * textureBuffer.numItems | the number of texture coordinates
 * ___________________________________________________________________________________________________
 * vertexBuffer           | contains the Vertex Position Coordinates (does not include w)
 * vertexBuffer.itemSize  | set to 3 items
 * vertexBuffer.numItems  | the total number of vertices
 * ___________________________________________________________________________________________________
 * indexBuffer            | contains the indices of the faces
 * indexBuffer.itemSize   | is set to 1
 * indexBuffer.numItems   | the total number of indices
 *</pre>
 * @memberOf module:OBJ
 * @param {WebGLRenderingContext} gl the 'canvas.getContext('webgl')' context instance
 * @param {Mesh} mesh a single 'OBJ.Mesh' instance
 */
OBJ.initMeshBuffers = function (gl, mesh) {
    //FOLLOWING ERROR HANDLING WAS ADDED FOR THE WEBGL-EDITOR
    if (mesh === undefined) {
        console.error("Initalization of mesh buffers failed.");
        console.error("OBJ.initMeshBuffers(gl, undefined)");

    } else {
        mesh.normalBuffer = _buildBuffer(gl, gl.ARRAY_BUFFER, mesh.vertexNormals, 3);
        mesh.textureBuffer = _buildBuffer(gl, gl.ARRAY_BUFFER, mesh.textures, 2);
        mesh.vertexBuffer = _buildBuffer(gl, gl.ARRAY_BUFFER, mesh.vertices, 3);
        mesh.indexBuffer = _buildBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, mesh.indices, 1);
    }
};


/**
 * Takes in the WebGL context and a Mesh. Deletes the mesh's buffers,
 * which you would do when deleting an object from a scene so that you don't leak video memory.
 * Excessive buffer creation and deletion leads to video memory fragmentation. Beware.
 *
 * The deleted texture attributes are:
 *<pre>
 * Attribute              | Description
 * normalBuffer           | contains the Vertex Normals
 * normalBuffer.itemSize  | set to 3 items
 * normalBuffer.numItems  | the total number of vertex normals
 * ___________________________________________________________________________________________________
 * textureBuffer          | contains the Texture Coordinates
 * textureBuffer.itemSize | set to 2 items
 * textureBuffer.numItems | the number of texture coordinates
 * ___________________________________________________________________________________________________
 * vertexBuffer           | contains the  Vertex Position Coordinates (does not include w)
 * vertexBuffer.itemSize  | set to 3 items
 * vertexBuffer.numItems  | the total number of vertices
 * ___________________________________________________________________________________________________
 * indexBuffer            | contains the indices of the faces
 * indexBuffer.itemSize   | is set to 1
 * indexBuffer.numItems   | the total number of indices
 * </pre>
 *
 * @memberOf module:OBJ
 * @param {WebGLRenderingContext} gl the 'canvas.getContext('webgl')' context instance
 * @param {Mesh} mesh a single 'OBJ.Mesh' instance
 **/
OBJ.deleteMeshBuffers = function (gl, mesh) {
    //FOLLOWING ERROR HANDLING WAS ADDED FOR THE WEBGL-EDITOR
    if (mesh === undefined) {
        console.error("Deletion of mesh buffers failed.");
        console.error("OBJ.deleteMeshBuffers(gl, undefined)");
    } else {
        gl.deleteBuffer(mesh.normalBuffer);
        gl.deleteBuffer(mesh.textureBuffer);
        gl.deleteBuffer(mesh.vertexBuffer);
        gl.deleteBuffer(mesh.indexBuffer);
    }
};
})
(this);