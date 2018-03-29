// an attribute will receive data from a buffer
attribute vec4 vPosition;
attribute vec3 vNormal;


//our vertex shader uniforms
uniform mat4 view;
uniform mat4 projection;
uniform mat4 model;
uniform vec4 ambientProduct, diffuseProduct, specularProduct;
uniform vec4 lightPosition;
uniform float shininess;

//forward the color information to the Fragment Shader
varying vec4 fColor;

//main entry point of the vertex shader program which will be executed
void main() {

    mat4 modelViewMatrix = view*model;
    vec3 pos = -(modelViewMatrix * vPosition).xyz;
    vec3 light = lightPosition.xyz;
    vec3 L = normalize( light - pos );


    vec3 E = normalize( -pos );
    vec3 H = normalize( L + E );

    vec4 NN = vec4(vNormal,0);

    // Transform vertex normal into eye coordinates

    vec3 N = normalize( (modelViewMatrix*NN).xyz);

    // Compute terms in the illumination equation
    vec4 ambient = ambientProduct;

    float Kd = max( dot(L, N), 0.0 );

    vec4  diffuse = Kd*diffuseProduct;

    float Ks = pow( max(dot(N, H), 0.0), shininess );
    vec4  specular = Ks * specularProduct;

    if( dot(L, N) < 0.0 ) {
	specular = vec4(0.0, 0.0, 0.0, 1.0);
    }
    //set the Position of all vertices
    gl_Position = projection * view* model* vPosition;
    fColor = ambient + diffuse +specular;

    fColor.a = 1.0;
}




