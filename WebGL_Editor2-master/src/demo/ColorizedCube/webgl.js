/*------Render CUBE Example------*/
var points = [];
var colors = [];
var numVertices = 36;


function quad(a, b, c, d)
{
    var vertices = [
        vec4.fromValues( -0.5, -0.5,  0.5, 1.0 ),
        vec4.fromValues( -0.5,  0.5,  0.5, 1.0 ),
        vec4.fromValues(  0.5,  0.5,  0.5, 1.0 ),
        vec4.fromValues(  0.5, -0.5,  0.5, 1.0 ),
        vec4.fromValues( -0.5, -0.5, -0.5, 1.0 ),
        vec4.fromValues( -0.5,  0.5, -0.5, 1.0 ),
        vec4.fromValues(  0.5,  0.5, -0.5, 1.0 ),
        vec4.fromValues(  0.5, -0.5, -0.5, 1.0 )
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        //colors.push(vertexColors[a]);

    }
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
//Load shaders and initialize attribute buffers
var program = initShaders(gl);
//after gl.useprogram all Uniforms will be set for that program
//additionally tells WebGL which shader program-pair to use.
gl.useProgram(program);


//creates an empty buffer
var cBuffer = gl.createBuffer();

//binds the cBuffer in order to tell WebGl in which buffer we want to modify
gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );

//store the colors Array in our cBuffer
//Flatten is a helper function which converts the Javascript array 'colors' into a Float32Array
//reason is that WebGL buffers can only store strongly typed float arrays.
gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

//get the location of the attribute 'vColor' from our Vertex Shader
var vColor = gl.getAttribLocation( program, "vColor" );

//tell WebGL how to retrive the stored data out of our cBuffer
//in this case 4 values of the buffer for each vertex
gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
//turns the generic vertex attribute array on at the given index position vColor.
gl.enableVertexAttribArray( vColor );

var vBuffer = gl.createBuffer();
gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

//get the location of the attribute 'vPosition' from our Vertex Shader
var vPosition = gl.getAttribLocation( program, "vPosition" );
//tell WebGL how to retrive the stored data out of our vBuffer
//in this case 4 values of the buffer for each vertex
gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );

//turns the generic vertex attribute array on at the given index position vPosition.
gl.enableVertexAttribArray( vPosition );

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

//this helper function connects the user-interaction with the viewMatrix and manipulates it on render time
lookAtArcballCamera(viewMatrix, vec3.fromValues(0,0,5), vec3.fromValues(0,0,0), vec3.fromValues(0,1,0));

//find the uniform location of the uniform 'view' in our vertex shader
var viewPosition = gl.getUniformLocation(program, "view");

//upload the viewMatrix to the vertex Shader at our position 'viewPosition'
gl.uniformMatrix4fv(viewPosition, false,viewMatrix);

//create our (identity) model 4x4 matrices
var modelMatrix = mat4.create();
//find the uniform location of the uniform 'model' in our vertex shader
var modelPosition = gl.getUniformLocation(program, "model");

//upload the modelMatrix to the vertex Shader at our position 'modelPosition'
gl.uniformMatrix4fv(modelPosition, false,modelMatrix);


//this is the main render function (you'll have to define this function 'render()') which will be automatically executed once for each frame!
function render(){
    // Clears the color and depth buffers
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //update the manipulation on the viewMatrix (send the new viewMatrix to the Vertex Shader)
    gl.uniformMatrix4fv(viewPosition, false,viewMatrix);

    //start drawing Triangle primitives (the primitive tells WebGL how many vertices to use in order to construct a surface)
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}
