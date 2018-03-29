/*WebGL-Demo by (MIT) Copyright (c) 2015 Kevin Roast -- http://www.kevs3d.co.uk/dev/shaders/ */
writeLog("This demo might only run fluently with a decent GPU!");
var config = {
    camera: {
        x: 0.0, y: 2.0, z: 0.0
    },
    lookat: {
        x: -120.0, y: -50.0, z: -95.0
    },
    lightDir: {
        x: -1.0, y: 0.8, z: -1.0
    },
    lightColour: {
        r: 0.7, g: 0.8, b: 0.9
    },
    surface: {
        specular: 6.0,
        specularHardness: 512.0,
        diffuse: 0.1,
        attenDepth: -0.52,
        attenScale: 0.2
    },
    global: {
        fog: 0.02,
        reflections: true,
        postEffects: true,
        moveCamera: false,
        param: 0.2
    }
};


var firstTime = Date.now();

var program = initShaders(gl);
gl.useProgram(program);

var aspect = canvas.width / canvas.height;

// create vertices to fill the canvas with a single quad
var vertices = new Float32Array(
    [
        -1, 1 * aspect, 1, 1 * aspect, 1, -1 * aspect,
        -1, 1 * aspect, 1, -1 * aspect, -1, -1 * aspect
    ]);

var vbuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

var triCount = 2,
    numItems = vertices.length / triCount;

gl.useProgram(program);

var time = (Date.now() - firstTime) / 1000.0;
program.time = gl.getUniformLocation(program, "time");
gl.uniform1f(program.time, time);

program.resolution = gl.getUniformLocation(program, "resolution");
gl.uniform2f(program.resolution, canvas.width, canvas.height);

program.cameraPos = gl.getUniformLocation(program, "cameraPos");

program.cameraLookat = gl.getUniformLocation(program, "cameraLookat");
gl.uniform3f(program.cameraLookat, config.lookat.x, config.lookat.y, config.lookat.z);

program.lightDir = gl.getUniformLocation(program, "lightDir");
// pre normalise light dir
var x = config.lightDir.x, y = config.lightDir.y, z = config.lightDir.z;
var len = x * x + y * y + z * z;
len = 1.0 / Math.sqrt(len);
gl.uniform3f(program.lightDir, config.lightDir.x * len, config.lightDir.y * len, config.lightDir.z * len);

program.lightColour = gl.getUniformLocation(program, "lightColour");
gl.uniform3f(program.lightColour, config.lightColour.r, config.lightColour.g, config.lightColour.b);

program.specular = gl.getUniformLocation(program, "specular");
gl.uniform1f(program.specular, config.surface.specular);

program.specularHardness = gl.getUniformLocation(program, "specularHardness");
gl.uniform1f(program.specularHardness, config.surface.specularHardness);

program.diffuse = gl.getUniformLocation(program, "diffuse");
gl.uniform3f(program.diffuse, config.surface.diffuse, config.surface.diffuse, config.surface.diffuse);

program.moveCamera = gl.getUniformLocation(program, "moveCamera");
gl.uniform1f(program.moveCamera, config.global.moveCamera);

program.postEffects = gl.getUniformLocation(program, "postEffects");
gl.uniform1f(program.postEffects, config.global.postEffects);

program.reflections = gl.getUniformLocation(program, "reflections");
gl.uniform1f(program.reflections, config.global.reflections);

program.fog = gl.getUniformLocation(program, "fog");
gl.uniform1f(program.fog, config.global.fog);

program.attenDepth = gl.getUniformLocation(program, "attenDepth");
gl.uniform1f(program.attenDepth, config.surface.attenDepth);

program.attenScale = gl.getUniformLocation(program, "attenScale");
gl.uniform1f(program.attenScale, config.surface.attenScale);

program.param = gl.getUniformLocation(program, "param");
gl.uniform1f(program.param, config.global.param);

program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
gl.enableVertexAttribArray(program.aVertexPosition);
gl.vertexAttribPointer(program.aVertexPosition, triCount, gl.FLOAT, false, 0, 0);

//this is the main render function (you'll have to define this function 'render()') which will be automatically executed once for each frame!
function render() {
    config.camera.x += 0.01;
    config.camera.y = 2 + Math.sin(config.camera.x);

    gl.uniform3f(program.cameraPos, config.camera.x, config.camera.y, config.camera.z);

    var time = (Date.now() - firstTime) / 1000.0;

    gl.uniform1f(program.time, time);


    gl.drawArrays(gl.TRIANGLES, 0, numItems);
}
