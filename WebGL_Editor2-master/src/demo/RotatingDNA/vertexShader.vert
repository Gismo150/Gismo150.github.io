attribute vec3 a_vertex;
attribute vec2 a_texCoord;
//attribute vec3 a_normal;

uniform mat4 view;
uniform mat4 projection;
uniform mat4 model;

varying vec2 v_texcoord;
//varying vec4 fColor;

void main() {
    // Pass the texcoord to the fragment shader.
     v_texcoord = a_texCoord;
    gl_Position = projection * view* model* vec4(a_vertex.xyz, 1.0);
}