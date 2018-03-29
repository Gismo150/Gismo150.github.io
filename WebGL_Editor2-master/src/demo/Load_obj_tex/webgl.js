var obj = {
    'cerberusObj': "./src/object/cerberus.obj"
};

var tex = {
    'cerberusTex': "./src/texture/cerberus.jpg"
};

OBJ.downloadMeshes(obj, myCallback);
// Enable depth testing, used for hidden surface removal
gl.enable(gl.DEPTH_TEST);
// Near things obscure far things
gl.depthFunc(gl.LEQUAL);
//Load shaders and initialize
var program = initShaders(gl);
gl.useProgram(program);

TEX.downloadTextures(tex, texCallback);
var myCerberusTex;

function texCallback(texture) {
    myCerberusTex = texture.cerberusTex;

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    TEX.initTextureBuffer(gl, myCerberusTex);
}

var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
gl.enableVertexAttribArray(texcoordLocation);

var vertPos = gl.getAttribLocation(program, "a_vertex");
gl.enableVertexAttribArray(vertPos);

var mycerberusObj;
function myCallback(mesh) {
    mycerberusObj = mesh.cerberusObj;
    // create and initialize the vertex, vertex normal, and texture coordinate buffers
    // and save on to the mesh object
    OBJ.initMeshBuffers(gl, mycerberusObj);
}

var viewPostition;
var viewMatrix;
viewMatrix = mat4.create();
lookAtArcballCamera(viewMatrix, vec3.fromValues(0, 0, 1), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
var projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 1000);

viewPostition = gl.getUniformLocation(program, "view");

gl.uniformMatrix4fv(viewPostition, false, viewMatrix);
var projectionPosition = gl.getUniformLocation(program, "projection");
gl.uniformMatrix4fv(projectionPosition, false, projectionMatrix);

var modelPosition = gl.getUniformLocation(program, "model");
var modelMatrix = mat4.create();
gl.uniformMatrix4fv(modelPosition, false, modelMatrix);



function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(viewPostition, false, viewMatrix);


    gl.uniformMatrix4fv(modelPosition, false, modelMatrix);

    gl.bindTexture(gl.TEXTURE_2D, myCerberusTex.textureBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, mycerberusObj.textureBuffer);
    gl.vertexAttribPointer(texcoordLocation, mycerberusObj.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, mycerberusObj.vertexBuffer);
    gl.vertexAttribPointer(vertPos, mycerberusObj.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mycerberusObj.indexBuffer);
    gl.drawElements(gl.TRIANGLES, mycerberusObj.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

}

