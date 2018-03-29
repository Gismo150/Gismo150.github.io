/*-----Rotating DNA example-----*/

// A list of all available objects can be seen in the menu under Resources/objects.
//specify what object to download
//this javascript object contains the 'nameItAsYouWant': "url path to file".
var obj = {
    'DNA': "src/object/dna.obj"
};

// A list of all available textures can be seen in the menu under Resources/textures.
//specify what texture to download
//object contains the 'nameItAsYouWant': "url path to file".
var tex = {
    'DNAtex': "src/texture/disturb.jpg"
};

// Enable depth testing, used for hidden surface removal
gl.enable(gl.DEPTH_TEST);
// Near things obscure far things
gl.depthFunc(gl.LEQUAL);
//Load shaders and initialize
var program = initShaders(gl);
gl.useProgram(program);

//start to download the texture specified in the javascript object tex
TEX.downloadTextures(tex, texCallback);
var DNAtex;

//texCallback will be called once the asynchronous download of our texture is done. We'll have to initialize our buffers in this function.
function texCallback(texture) {
    //the parameter texture is a javascript object containing all loaded textures. Access our texture by the name specified in the tex object at the beginning.
    DNAtex = texture.DNAtex;
    //using helper function which creates a textureBuffer and initializes the buffer with default values (see the documentation of texture loader for details)
    TEX.initTextureBuffer(gl, DNAtex);
}

//start to download the object specified in the javascript object obj
OBJ.downloadMeshes(obj, myCallback);
var meshFigure;

function myCallback(mesh) {
    meshFigure = mesh.DNA;
    // create and initialize the vertex, vertex normal, and texture coordinate buffers
    // and save on to the meshFigure variable
    OBJ.initMeshBuffers(gl, meshFigure);
    //OBJ.initMeshBuffers(gl, meshCar);

}

//get our attribute location of 'a_texCoord' specified in the vertex shader
var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
//turns the generic vertex attribute array on at the given index position texcoordLocation.
gl.enableVertexAttribArray(texcoordLocation);

//get our attribute location of 'a_vertex' specified in the vertex shader
var vertPos = gl.getAttribLocation(program, "a_vertex");
//turns the generic vertex attribute array on at the given index position vertPos.
gl.enableVertexAttribArray(vertPos);

//create a 4x4 identity matrix.
var viewMatrix = mat4.create();
//this helper function connects the user-interaction with the viewMatrix and manipulates it on render time
//see documentation for more details
lookAtArcballCamera(viewMatrix, vec3.fromValues(0, 8, 3), vec3.fromValues(2, -2, 0), vec3.fromValues(0, 1, 0));
//find the uniform location of the uniform 'view' in our vertex shader
var viewPostition = gl.getUniformLocation(program, "view");
//upload the viewMatrix to the vertex Shader at our position 'viewPosition'
gl.uniformMatrix4fv(viewPostition, false, viewMatrix);

//create a 4x4 identity matrix.
var projectionMatrix = mat4.create();
//create a perspective matrix and writes the values into the projectionMatrix
mat4.perspective(projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 1000);
//find the uniform location of the uniform 'projection' in our vertex shader
var projectionPosition = gl.getUniformLocation(program, "projection");
//upload the projectionMatrix to the vertex Shader at our position  'projectionPosition'
gl.uniformMatrix4fv(projectionPosition, false, projectionMatrix);

//create our (identity) model 4x4 matrices
var modelMatrix = mat4.create();
//find the uniform location of the uniform 'model' in our vertex shader
var modelPosition = gl.getUniformLocation(program, "model");

var x = 0;
function render() {
    //update the x value on each render call
    x = x + 0.01;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Since we connected our viewMatrix with the user-interaction we'll
    //have to send the viewMatrix on each frame in order to see the manipulation bei interaction.
    gl.uniformMatrix4fv(viewPostition, false, viewMatrix);
    //rotate the modelMatrix around the z axis for x degrees
    mat4.fromRotation(modelMatrix, x, vec3.fromValues(0, 0, 1));
    //after rotation we'll have to send the manipulated matrix to the vertex shader again.
    gl.uniformMatrix4fv(modelPosition, false, modelMatrix);

    //bind the texture buffer connected to our texture variable.
    gl.bindTexture(gl.TEXTURE_2D, DNAtex.textureBuffer);
    //following code until drawElements sets up the buffers which we want to use in this drawElements call
    gl.bindBuffer(gl.ARRAY_BUFFER, meshFigure.textureBuffer);
    gl.vertexAttribPointer(texcoordLocation, meshFigure.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, meshFigure.vertexBuffer);
    gl.vertexAttribPointer(vertPos, meshFigure.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshFigure.indexBuffer);

    gl.drawElements(gl.TRIANGLES, meshFigure.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

}

