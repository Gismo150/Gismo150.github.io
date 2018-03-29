// an attribute will receive data from a buffer
attribute vec4 vPosition;
attribute vec4 vColor;
//forward the color information to the Fragment Shader
varying vec4 fColor;

//our vertex shader uniforms
uniform mat4 view;
uniform mat4 projection;
uniform mat4 model;

//main entry point of the vertex shader program which will be executed
void main() {

    fColor = vColor;
    //set the Position of all vertices
    gl_Position = projection * view* model* vPosition;
}