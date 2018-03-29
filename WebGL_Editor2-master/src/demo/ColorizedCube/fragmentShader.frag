// fragment shaders don't have a default precision so we need
// to pick one; mediump is a good default
precision mediump float;

//retrives the interpolated values forwarded by the vertex shader
varying vec4 fColor;

//main entry point of the fragment shader program which will be executed
void main() {
    //set the color for each fragment
    gl_FragColor = fColor;
}