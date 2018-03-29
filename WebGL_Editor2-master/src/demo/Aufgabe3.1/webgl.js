/*------Aufgabe 3.1 Musterlösung------*/
var pointsArray = [];
var normalsArray = [];
var numVertices = 36;

var lightPosition = vec4.fromValues(0, 0, 7, 1.0 );
var lightAmbient = vec4.fromValues(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4.fromValues( 1.0, 0.0, 1.0, 1.0 );

var materialAmbient = vec4.fromValues( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4.fromValues( 1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4.fromValues( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 100.0;


var theta = 0;



var vertices = [
    vec4.fromValues( -0.5, -0.5,  0.5, 1.0 ),
    vec4.fromValues( -0.5,  0.5,  0.5, 1.0 ),
    vec4.fromValues( 0.5,  0.5,  0.5, 1.0 ),
    vec4.fromValues( 0.5, -0.5,  0.5, 1.0 ),
    vec4.fromValues( -0.5, -0.5, -0.5, 1.0 ),
    vec4.fromValues( -0.5,  0.5, -0.5, 1.0 ),
    vec4.fromValues( 0.5,  0.5, -0.5, 1.0 ),
    vec4.fromValues( 0.5, -0.5, -0.5, 1.0 )
];

function quad(a, b, c, d)
{
    var t1 = vec3.create();
    vec3.subtract(t1, vertices[b], vertices[a]);
    var t2 = vec3.create();
    vec3.subtract(t2, vertices[c], vertices[b]);
    var normal = vec3.create();
    vec3.cross(normal, t1, t2);
    vec3.normalize(normal, normal);

    for (i = 0; i < 6; i++) {
        normalsArray.push(normal);
    }

    pointsArray.push(vertices[a]);
    pointsArray.push(vertices[c]);
    pointsArray.push(vertices[d]);

    pointsArray.push(vertices[a]);
    pointsArray.push(vertices[b]);
    pointsArray.push(vertices[c]);
}

//constructs quads from two triangles
function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

colorCube();

// Enable depth testing, used for hidden surface removal
gl.enable(gl.DEPTH_TEST);
// Near things obscure far things
gl.depthFunc(gl.LEQUAL);
//Load shaders
var program = initShaders(gl);
//after gl.useprogram all Uniforms will be set for that program
//additionally tells WebGL which shader program-pair to use.
gl.useProgram(program);

//creates an empty buffer
var nBuffer = gl.createBuffer();

//binds the nBuffer in order to tell WebGl which buffer we want to modify
gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );

//store the normalsArray Array in our nBuffer
//Flatten is a helper function which converts the Javascript array 'normalsArray' into a Float32Array
//reason is that WebGL buffers can only store strongly typed float arrays.
gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

//get the location of the attribute 'vNormal' from our Vertex Shader
var vNormal = gl.getAttribLocation( program, "vNormal" );

//tell WebGL how to retrive the stored data out of our cBuffer
//in this case 3 values of the buffer for each vertex
gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
//turns the generic vertex attribute array on at the given index position vNormal.
gl.enableVertexAttribArray( vNormal );

//creates an empty buffer
var vBuffer = gl.createBuffer();
//binds the nBuffer in order to tell WebGl which buffer we want to modify
gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
//store the pointsArray Array in our nBuffer
//Flatten is a helper function which converts the Javascript array 'normalsArray' into a Float32Array
//reason is that WebGL buffers can only store strongly typed float arrays.
gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

//get the location of the attribute 'vPosition' from our Vertex Shader
var vPosition = gl.getAttribLocation( program, "vPosition" );
//tell WebGL how to retrive the stored data out of our vBuffer
//in this case 4 values of the buffer for each vertex
gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );

//turns the generic vertex attribute array on at the given index position vPosition.
gl.enableVertexAttribArray( vPosition );

//find the uniform location of the uniform 'theta' in our vertex shader
var thetaLoc = gl.getUniformLocation(program, "theta");

//create our (identity) projection 4x4 matrix
var projectionMatrix = mat4.create();
var aspect = canvas.clientWidth / canvas.clientHeight;

//create a perspective matrix and writes the values into the projectionMatrix
mat4.perspective(projectionMatrix, 45 , aspect, 1, 100);

//find the uniform location of the uniform 'projection' in our vertex shader
var projectionPosition = gl.getUniformLocation(program, "projection");

//upload the projectionMatrix to the vertex Shader at our position  'projectionPosition'
gl.uniformMatrix4fv(projectionPosition, false, projectionMatrix);

//create our (identity) view 4x4 matrices
var viewMatrix = mat4.create();

//creates a viewMatrix and writes the values into the viewMatrix
mat4.lookAt(viewMatrix, vec3.fromValues(0,0,3), vec3.fromValues(0,0,0), vec3.fromValues(0,1,0));

//find the uniform location of the uniform 'view' in our vertex shader
var viewPosition = gl.getUniformLocation(program, "view");

//upload the viewMatrix to the vertex Shader at our position 'viewPosition'
gl.uniformMatrix4fv(viewPosition, false,viewMatrix);

//create our (identity) model 4x4 matrices
var modelMatrix = mat4.create();
//find the uniform location of the uniform 'model' in our vertex shader
var modelPosition = gl.getUniformLocation(program, "model");
gl.uniformMatrix4fv(modelPosition, false, modelMatrix);



var ambientProduct = vec4.create();
var diffuseProduct = vec4.create();
var specularProduct = vec4.create();

//calculate the product
vec4.multiply(ambientProduct, lightAmbient, materialAmbient);
vec4.multiply(diffuseProduct, lightDiffuse, materialDiffuse);
vec4.multiply(specularProduct,lightSpecular, materialSpecular);

//find the uniform location of the uniform 'ambientProduct' in our vertex shader and send the ambientProduct to the GPU
gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), new Float32Array(ambientProduct));
//find the uniform location of the uniform 'diffuseProduct' in our vertex shader and send the diffuseProduct to the GPU
gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), new Float32Array(diffuseProduct));
//find the uniform location of the uniform 'specularProduct' in our vertex shader and send the specularProduct to the GPU
gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), new Float32Array(specularProduct));
//find the uniform location of the uniform 'lightPosition' in our vertex shader and send the lightPosition to the GPU
gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), new Float32Array(lightPosition));
//find the uniform location of the uniform 'shininess' in our vertex shader and send the materialShininess to the GPU
gl.uniform1f(gl.getUniformLocation(program,"shininess"),materialShininess);


//this is the main render function (you'll have to define this function 'render()') which will be automatically executed once for each frame!
function render(){
    // Clears the color and depth buffers
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



    //start drawing Triangle primitives (the primitive tells WebGL how many vertices to use in order to construct a surface)
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}
