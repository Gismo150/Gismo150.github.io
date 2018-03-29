// fragment shaders don't have a default precision so we need
// to pick one; mediump is a good default
precision mediump float;
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
void main() {

    gl_FragColor = texture2D(u_texture, v_texcoord);
}