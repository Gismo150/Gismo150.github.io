/**
 * @description Access to the WebGLRenderingContext interface.
 * @readonly
 * @type {WebGLRenderingContext}
 */
var gl;
/**
 * @description The HTMLCanvasElement.
 * @readonly
 * @type {HTMLCanvasElement}
 */
var canvas;
/**
 * @description Indicates if an object is currently loading or not. True when loading, otherwise false.
 * @readonly
 */
var _OBJisLoading = false;
/**
 * @description Indicates if an texture is currently loading or not. True when loading, otherwise false.
 * @readonly
 */
var _TEXisLoading = false;
/**
 * @instance controller
 * @description The main controller Object which handles mouse, keyboard and touch events.
 *
 * <pre>
 *     Mouse:
 *     Left-Mousebutton and drag    | Rotation
 *     Right-Mousebutton and drag   | Translation
 *     Mousewheel                   | Zoom/Object scaling
 *
 *     Keyboard:
 *     Arrow-Keys                   | Translation
 *     +/- Keys                     | Zoom/Object scaling
 *
 *     Touch-Gestures:
 *     Touch and drag               | Rotation
 *     Double-Tap and drag          | Translation
 *     Two-finger pinch             | Zoom/Object scaling
 *
 *     </pre>
 *
 * @type {Object}
 */
var controller;
/*---------------Further JsDoc for the used controller. All Variables can be accessed via controller.[variableName]*/
/**
 * @extends controller
 * @var controller:xRot
 * @description The overall amount of x-Rotation of all interactions.
 * @type {Number}
 *
 */
/**
 * @extends controller
 * @var controller:yRot
 * @description The overall amount of y-Rotation of all interactions.
 * @type {Number}
 *
 */
/**
 * @extends controller
 * @var controller:xTrans
 * @description The overall amount of x-Translation of all interactions.
 * @type {Number}
 *
 */
/**
 * @extends controller
 * @var controller:yTrans
 * @description The overall amount of y-Translation of all interactions.
 * @type {Number}
 *
 */
/**
 * @extends controller
 * @var controller:zTrans
 * @description The overall amount of z-Translation of all interactions.
 * @type {Number}
 *
 */
/**
 * @extends controller
 * @var controller:velocity
 * @description Sets the sensitivity of interactions. Typical values are 1/x, where x is a number.
 * @type {Number}
 *
 */
/**
 * @extends controller
 * @var controller:deltaXRot
 * @description The delta x-Rotation of the current interaction.
 * @type {Number}
 *
 */
/**
 * @extends controller
 * @var controller:deltaYRot
 * @description The delta y-Rotation of the current interaction.
 * @type {Number}
 *
 */
/**
 * @extends controller
 * @var controller:deltaXTrans
 * @description The delta x-Translation of the current interaction.
 * @type {Number}
 *
 */
/**
 * @extends controller
 * @var controller:deltaYTrans
 * @description The delta y-Translation of the current interaction.
 * @type {Number}
 *
 */
/**
 * @extends controller
 * @var controller:deltaZTrans
 * @description The delta z-Translation of the current interaction.
 * @type {Number}
 *
 */
/**
 * @extends controller
 * @var controller:objectScale
 * @description The scaling factor.
 * @type {Number}
 *
 */

//******************Creating an EDITOR module, it maintains a private internal state using the closure of the anonymous function***********************//
(function (scope) {
    'use strict';
    var EDITOR = {};
    scope.EDITOR = EDITOR;
    EDITOR._run = false;
    EDITOR.gl_requestId = 0;
    EDITOR._error = false;
    EDITOR._shaderError = false;
    EDITOR._pause = false;
    EDITOR.selectedTab = 0;
    EDITOR._pausedByMenu = false;

    EDITOR.initEditor = function () {
        canvas = document.getElementById("gl-canvas");
        $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', onFullScreenChange);
        //INITIALIZE Render-Monitor
        EDITOR.stats = new Stats();
        EDITOR.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.getElementById("canvasBody").appendChild(EDITOR.stats.dom);
        //initialize the controller object
        controller = new Controller(canvas);
        //initialize the Spinner object to animate a pending download of objects and textures
        EDITOR._spinner = new Spinner({
            lines: 13 // The number of lines to draw
            , length: 28 // The length of each line
            , width: 10 // The line thickness
            , radius: 42 // The radius of the inner circle
            , scale: 1 // Scales overall size of the spinner
            , corners: 1 // Corner roundness (0..1)
            , color: '#999' // #rgb or #rrggbb or array of colors
            , opacity: 0.25 // Opacity of the lines
            , rotate: 23 // The rotation offset
            , direction: 1 // 1: clockwise, -1: counterclockwise
            , speed: 1.7 // Rounds per second
            , trail: 60 // Afterglow percentage
            , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
            , zIndex: 2e9 // The z-index (defaults to 2000000000)
            , className: 'spinner' // The CSS class to assign to the spinner
            , top: '49%' // Top position relative to parent
            , left: '50%' // Left position relative to parent
            , shadow: true // Whether to render a shadow
            , hwaccel: false // Whether to use hardware acceleration
            , position: 'absolute' // Element positioning
        });
        initCtx();
    };

    function initCtx() {
        //gl is the rendering context
        var ctx = WebGLUtils.setupWebGL(canvas, {preserveDrawingBuffer: true});
        gl = WebGLDebugUtils.makeDebugContext(ctx);
        gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError, validateNoneOfTheArgsAreUndefined);
        if (!gl) {
            EDITOR.writeError("WebGL context isn't available");
        } else {
            EDITOR.writeCompletionMessage("WebGL context initialized successfully");
            // resizeCanvas();
            EDITOR.isMobile = false;
            // device detection
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) EDITOR.isMobile = true;

            if (!EDITOR.isMobile) {
                EDITOR.writeSystemMessage("CURRENT DEVICE: Desktop-PC");
                //allowing keyboard input onto canvas only for desktop devices
                canvas.contentEditable = true;
            } else {
                EDITOR.writeSystemMessage("CURRENT DEVICE: MOBILE");
            }
            EDITOR.writeSystemMessage("VENDOR: " + gl.getParameter(gl.VENDOR));
            EDITOR.writeSystemMessage("VERSION: " + gl.getParameter(gl.VERSION));
        }
        //configure WebGL
        gl.clearColor(0.3, 0.3, 0.3, 1);
        //set the viewport
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        initAce();
    }

    function initAce() {
        EDITOR.webglEditor = ace.edit("editorWebGL");
        initEditor(EDITOR.webglEditor, 1);
        EDITOR.vsEditor = ace.edit("editorVS");
        initEditor(EDITOR.vsEditor, 0);
        EDITOR.fsEditor = ace.edit("editorFS");
        initEditor(EDITOR.fsEditor, 0);

        if (localStorage.getItem("webgl") !== null && localStorage.getItem("vs") !== null && localStorage.getItem("fs") !== null) {
            EDITOR.writeSystemMessage("Restoring your last known program state. Please keep in mind that the program state is lost once you clean your browsers cache!");
            EDITOR.webglEditor.setValue(localStorage.getItem("webgl"), -1);
            EDITOR.vsEditor.setValue(localStorage.getItem("vs"), -1);
            EDITOR.fsEditor.setValue(localStorage.getItem("fs"), -1);
        } else {
            EDITOR.setEditorTextFromFile("./src/demo/ColorizedCube/vertexShader.vert", EDITOR.vsEditor);
            EDITOR.setEditorTextFromFile("./src/demo/ColorizedCube/fragmentShader.frag", EDITOR.fsEditor);
            EDITOR.setEditorTextFromFile("./src/demo/ColorizedCube/webgl.js", EDITOR.webglEditor);
        }
    }

    function initEditor(editor, type) {
        editor.setTheme("ace/theme/chaos");
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showPrintMargin: false
        });
        editor.resize();
        if (type === 0) {
            editor.getSession().setMode("ace/mode/glsl");
        } else {
            editor.getSession().setMode("ace/mode/javascript");
        }
        editor.commands.addCommand({
            name: 'commentLineCommand',
            bindKey: {win: 'Ctrl-M', mac: 'Command-M'},
            exec: function (e) {
                e.toggleCommentLines();
            },
            readOnly: false
        });
    }

    EDITOR.processJs = function (e) {
        var file = e.target.result, results;
        results = file.split("\n");
        var res = "";
        for (var i = 1; i < results.length; i++) {
            res += results[i];
        }
        EDITOR.webglEditor.setValue(res,-1);
    };

    EDITOR.processVert = function (e) {
        var file = e.target.result, results;
        results = file.split("\n");
        var res = "";
        for (var i = 1; i < results.length; i++) {
            res += results[i];
        }
        EDITOR.vsEditor.setValue(res,-1);
    };

    EDITOR.processFrag = function (e) {
        var file = e.target.result, results;
        results = file.split("\n");
        var res = "";
        for (var i = 1; i < results.length; i++) {
            res += results[i];
        }
        EDITOR.fsEditor.setValue(res,-1);
    };

    /**
     * Requests file contents and writes them into editor.
     *
     * @param      {String}  fileName  The source file
     * @param      {(EDITOR.webglEditor|EDITOR.vsEditor|EDITOR.fsEditor)}  editor The target editor
     */
    EDITOR.setEditorTextFromFile = function (fileName, editor) {
        var request = new XMLHttpRequest();
        try {
            request.responseType = 'text';
        } catch (e) {
        }
        request.open("GET", fileName, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                editor.setValue(request.responseText, -1);
            }
        };
        request.send();
    };

    EDITOR.fullscreen = function () {
        // go fullscreen, depending on Browser-Vendor
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        } else if (canvas.mozRequestFullScreen) {
            canvas.mozRequestFullScreen();
        } else if (canvas.msRequestFullscreen) {
            canvas.msRequestFullscreen();
        }
    };

    function onFullScreenChange() {
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
        // if in fullscreen mode fullscreenElement won't be null
        if (fullscreenElement !== undefined && fullscreenElement !== null) {
            var deviceWidth = $(window).width();
            var deviceHeight = $(window).height();
            gl.canvas.width = deviceWidth;
            gl.canvas.height = deviceHeight;
            gl.viewport(0, 0, deviceWidth, deviceHeight);
            if (EDITOR._run && !EDITOR._pause)
                EDITOR.compileRun();
        }
        else {
            EDITOR.resizeCanvas();
            if (EDITOR._run && !EDITOR._pause)
                EDITOR.compileRun();
        }
    }

    EDITOR.resizeCanvas = function () {
        // Lookup the size the browser is displaying the canvas.
        var rect = canvas.getBoundingClientRect();
        var displayWidth = rect.width;
        var displayHeight = rect.height;
        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
        $('connection').connections('update');
    };

    //-------------------------------------------------------ERROR HANDLING-----------------------------------------------------------//
     window.onerror = function (msg, url, line, col, error) {
        // Note that col & error are new to the HTML 5 spec and may not be
        // supported in every browser.  It worked for me in Chrome.
        var extra = !col ? '' : '\ncolumn: ' + col;
        extra += !error ? '' : '\nerror: ' + error;
        EDITOR.writeError(msg);
         if (msg.indexOf("render") === -1)
            EDITOR.writeError("Line: " + line + " " + extra);
        //Report this error in order to keep track of what pages have JS issues
        if (url !== '' && msg.indexOf("render") === -1)
            EDITOR.writeError("URL: " + url);
        var suppressErrorAlert = true;
        // If you return true, then error alerts (like in older versions of
        // Internet Explorer) will be suppressed.
        return suppressErrorAlert;
    };

    function validateNoneOfTheArgsAreUndefined(functionName, args) {
        for (var ii = 0; ii < args.length; ++ii) {
            if (args[ii] === undefined) {
                EDITOR.writeError("Undefined argument passed to gl." + functionName + "(" +
                    WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
            }
        }
    }

    function throwOnGLError(err, funcName, args) {
        var errorMsg;
        var error = WebGLDebugUtils.glEnumToString(err);
        switch (error) {
            case "gl.INVALID_OPERATION":
                errorMsg = "INVALID_OPERATION: The specified command is not allowed for the current state";
                break;
            case "gl.INVALID_ENUM":
                errorMsg = "INVALID_ENUM: An unacceptable value has been specified for an enumerated argument";
                break;
            case "gl.INVALID_VALUE":
                errorMsg = "INVALID_VALUE: A numeric argument is out of range";
                break;
            case "gl.INVALID_FRAMEBUFFER_OPERATION":
                errorMsg = "INVALID_FRAMEBUFFER_OPERATION: The currently bound framebuffer is not framebuffer complete when trying to render to or to read from it";
                break;
            case "gl.OUT_OF_MEMORY":
                errorMsg = "OUT_OF_MEMORY: Not enough memory is left to execute the command";
                break;
            case "gl.CONTEXT_LOST_WEBGL":
                errorMsg = "CONTEXT_LOST_WEBGL: WebGL context is lost";
                break;
        }
        EDITOR.writeError(errorMsg);
    }
//---------------------------------------------------------------------------------------------------------------------------//
    EDITOR.compileRun = function () {
        EDITOR.cleanLog();
        EDITOR.cancelRun();
        var webGLCode = EDITOR.webglEditor.getValue();
        //preprocessing the webgl.js code to prevent further errors.
        if (webGLCode.indexOf("EDITOR") !== -1) {
            EDITOR.writeError("Accessing the 'EDITOR'-Module is not allowed. Execution terminated.");
            EDITOR._run = true;
            return;
        } /*else if (webGLCode.indexOf("render") === -1) {
            EDITOR.writeError("Function 'render(){...}' not defined. This function will be executed once for each frame! Execution terminated.");
            EDITOR._run = true;
            return;
        } */else if (webGLCode.indexOf("lookAtArcballCamera") !== -1 && webGLCode.indexOf("modelInteraction") !== -1) {
            EDITOR.writeError("The usage of both functions 'lookAtArcballCamera' and 'modelInteraction' at one time is not allowed. Execution terminated.");
            EDITOR._run = true;
            return;
        }
        EDITOR._run = true;
        // canvas.focus();
        var script = document.createElement("script");
        script.setAttribute("id", "webGLCode");
        var container = document.getElementById("body");
        var text = document.createTextNode(webGLCode);
        script.appendChild(text);
        container.appendChild(script);
        if (!EDITOR._pause && !EDITOR._error && !EDITOR._shaderError) {
            EDITOR.gl_requestId = requestAnimationFrame(EDITOR.renderLoop);
        }
    };

    EDITOR.cancelRun = function () {
        if (EDITOR._run) {
            cancelAnimationFrame(EDITOR.gl_requestId);
            EDITOR.gl_requestId = 0;
            EDITOR._spinner.stop();
            EDITOR._error = false;
            EDITOR._shaderError = false;
            _OBJisLoading = false;
            _TEXisLoading = false;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            resetControllerState();
            var x = document.getElementById("body");
            var y = document.getElementById("webGLCode");
            if( y !== null){
                x.removeChild(y);
            }
            EDITOR._run = false;
            WebGLDebugUtils.resetToInitialState(gl);
            EDITOR._pause = false;
        }
    };

    EDITOR.pauseRun = function () {
        cancelAnimationFrame(EDITOR.gl_requestId);
        EDITOR.gl_requestId = 0;
        EDITOR._pause = true;
    };

    EDITOR.unPause = function () {
        EDITOR._pause = false;
        EDITOR.gl_requestId = requestAnimationFrame(EDITOR.renderLoop);
    };

    //You should let your WebGL-rendering callback be a requestAnimationFrame callback: if you do so,
    // the browser will take care of the complex details of animation scheduling for you.
    EDITOR.renderLoop = function () {
        if (!_TEXisLoading && !_OBJisLoading) {
            EDITOR.stats.begin();
            render();
            EDITOR.stats.end();
        }
        if (!EDITOR._error && !EDITOR._shaderError) {
            EDITOR.gl_requestId = requestAnimationFrame(EDITOR.renderLoop);
        }
    };

    EDITOR.scrollLoggerToBottom = function () {
        $('#errorLogContainer').stop().animate({
            scrollTop: $('#errorLogContainer')[0].scrollHeight
        }, 800);
    };

    EDITOR.styleShaderError = function (errorMsg) {
        var pos = errorMsg.lastIndexOf("ERROR");
        if (pos !== -1) {
            var restMsg = cut(errorMsg, pos);
            EDITOR.styleShaderError(restMsg);
        }
    };

    function cut(str, cutStart) {
        var tmp = str.substring(cutStart, str.length);
        tmp = tmp.replace("ERROR", "LINE");
        EDITOR.writeError(tmp);
        return str.substring(0, cutStart);
    }

    //red
    EDITOR.writeError = function (message) {
        var container = document.getElementById("errorLogContainer");
        var newP = document.createElement("p");
        newP.style.color = "red";
        cancelAnimationFrame(EDITOR.gl_requestId);
        EDITOR.gl_requestId = 0;
        EDITOR._error = true;
        EDITOR._spinner.stop();
        //falls ein shadererror entsteht, entstehen folgefehler in der WebGL applikation daher müssen diese nicht gezeigt werden.
        if (!EDITOR._shaderError) {
            var newBr = document.createElement("br");
            var time = new Date().toLocaleTimeString();
            var text = document.createTextNode(time + ":  " + message);
            newP.appendChild(text);
            newP.appendChild(newBr);
            container.appendChild(newP, container.lastChild);
            EDITOR.scrollLoggerToBottom();
        }
    };
    //yellow
    EDITOR.writeSystemMessage = function (message) {
        var container = document.getElementById("errorLogContainer");
        var newP = document.createElement("p");
        newP.style.color = "yellow";
        var newBr = document.createElement("br");
        var time = new Date().toLocaleTimeString();
        var text = document.createTextNode(time + ":  " + message);
        newP.appendChild(text);
        newP.appendChild(newBr);
        container.appendChild(newP, container.lastChild);
        EDITOR.scrollLoggerToBottom();
    };
    //green
    EDITOR.writeCompletionMessage = function (message) {
        var container = document.getElementById("errorLogContainer");
        var newP = document.createElement("p");
        newP.style.color = "green";
        var newBr = document.createElement("br");
        var time = new Date().toLocaleTimeString();
        var text = document.createTextNode(time + ":  " + message);
        newP.appendChild(text);
        newP.appendChild(newBr);
        container.appendChild(newP, container.lastChild);
        EDITOR.scrollLoggerToBottom();
    };

    EDITOR.cleanLog = function () {
        var container = document.getElementById("errorLogContainer");
        while (container.hasChildNodes()) {
            container.removeChild(container.childNodes[0]);
        }
    };

    window.onbeforeunload = function () {
        if (typeof(Storage) !== "undefined") {
            if (localStorage.getItem("webgl") !== null || localStorage.getItem("vs") !== null || localStorage.getItem("fs") !== null) {
                localStorage.removeItem("webgl");
                localStorage.removeItem("vs");
                localStorage.removeItem("fs");
            }
            //else add it
            localStorage.setItem("webgl", EDITOR.webglEditor.getValue());
            localStorage.setItem("vs", EDITOR.vsEditor.getValue());
            localStorage.setItem("fs", EDITOR.fsEditor.getValue());
            // Code for localStorage/sessionStorage.
        } else {
            EDITOR.writeSystemMessage("Your browser does not support local web storage! Changes will not be saved!");
            return "Do you want to leave this site?"; //Prevent Ctrl+W/leaving without saving
            // Sorry! No Web Storage support..
        }
    };

    document.onkeyup = function (e) {
        var e = e || window.event; // for IE to cover IEs window event-object
        e.preventDefault();
        if (e.altKey && e.which === 49) {
            $("#webGL").click();
        } else if (e.altKey && e.which === 50) {
            $("#vs").click();
        } else if (e.altKey && e.which === 51) {
            $("#fs").click();
        } else if (e.altKey && e.which === 82) {
            EDITOR.compileRun();
        }
    };

    document.onkeydown = function (e) {
        var e = e || window.event;
        if (e.ctrlKey) {
            var c = e.which || e.keyCode;//Get key code
            switch (c) {
                case 83://Block Ctrl+S
                case 9://Block Ctrl+W --Does not work in Chrome
                    e.preventDefault();
                    e.stopPropagation();
                    break;
            }
        }
    };

    //reads files as string and saves it in the zip folder
    EDITOR.textFromFile = function (url, fileName, folder) {
        $.ajax({
            url: url,
            type: 'get',
            async: false,
            success: function (data) {
                if (fileName === 'index.html') {
                    data = data.replace("//VSPLACEHOLDER", EDITOR.vsEditor.getValue());
                    data = data.replace("//FSPLACEHOLDER", EDITOR.fsEditor.getValue());
                    data = data.replace("//WEBGLPLACEHOLDER", EDITOR.webglEditor.getValue());
                }
                folder.file(fileName, data); //store the string
            }
        });
    };
    EDITOR.textFromFileRestore = function (url) {
        $.ajax({
            url: url,
            type: 'get',
            async: false,
            success: function (data) {
            }
        });
    };

    EDITOR.imageFromFile = function (folder, zip) {
        var count = EDITOR.img.length;
        EDITOR.img.forEach(function (fileName) {
            JSZipUtils.getBinaryContent('src/texture/' + fileName, function (err, data) {
                if (err) {
                    writeLog("Problem happened while loading image: " + url);
                } else {
                    folder.file(fileName, data, {binary: true});
                    count--;
                    if (count === 0) {
                        //saving with images
                        EDITOR.save(zip);
                        //deferred.resolve(zip);
                    }
                }
            });
        });
    };


    EDITOR.img = [];
    EDITOR.availableImages = ["amiga.jpg", "brick_bump.jpg", "brick_diffuse.jpg", "brick_rough.jpg",
        "bump.jpg", "cerberus.jpg", "circle-tex.jpg", "cloud.png", "crate.gif", "disturb.jpg", "earth.jpg",
        "lavatile.jpg", "metal.png", "perlin.png", "transition1.png", "transition2.png", "transition3.png", "transition4.png", "transition5.png",
        "transition6.png", "UV_Grid_Sm.jpg", "water.jpg", "water_normals.jpg", "vive.png"];
    EDITOR.findUsedImages = function () {
        var code = EDITOR.webglEditor.getValue();
        for (var i = 0; i < EDITOR.availableImages.length; i++) {
            if (code.indexOf(EDITOR.availableImages[i]) !== -1) {
                EDITOR.img.push(EDITOR.availableImages[i]);
            }
        }
    };

    EDITOR.obj = [];
    EDITOR.availableObjects = ["car.obj", "cerberus.obj", "character.obj", "cube.obj", "deer.obj", "dna.obj", "globe.obj", "male-Body.obj", "mill.obj",
        "n64.obj", "skeleton.obj", "teapot.obj", "tuna.obj", "webgl-logo.obj", "zeppelin.obj", "bunny.obj", "vive.obj"];
    EDITOR.findUsedObjects = function () {
        var code = EDITOR.webglEditor.getValue();
        for (var i = 0; i < EDITOR.availableObjects.length; i++) {
            if (code.indexOf(EDITOR.availableObjects[i]) !== -1) {
                EDITOR.obj.push(EDITOR.availableObjects[i]);
            }
        }
    };

    EDITOR.saveSubroutine = function (objFolder, textureFolder, zip) {
        EDITOR.obj.forEach(function (fileName) {
            var url = 'src/object/' + fileName;
            EDITOR.textFromFile(url, fileName, objFolder);
        });
        if (EDITOR.img.length > 0) {
            EDITOR.imageFromFile(textureFolder, zip);
        } else {
            //saving without images
            EDITOR.save(zip);
        }
    };

    EDITOR.save = function (zip) {
        if (EDITOR._run) {
            //saving the drawn canvas
            canvas.toBlobHD(function (blob) {
                zip.file("canvas.png", blob);
                writeLog("Creating zip file...");
                zip.generateAsync({type: "blob"}).then(function (content) {
                    // see FileSaver.js
                    EDITOR.writeCompletionMessage("Initializing download...");
                    EDITOR.writeSystemMessage("File saved to the default path defined in your browser settings.");
                    //Not possible to define the saving path with javascript, You need to change your own browser settings.
                    // This would enter the realm of privileged code, of which website content code cannot touch.
                    saveAs(content, "WebGL-Editor.zip");
                    document.getElementById("save_program").disabled = false;
                });
            }, "image/png");
        } else {
            writeLog("Creating zip file...");
            // see FileSaver.js
            zip.generateAsync({type: "blob"}).then(function (content) {
                EDITOR.writeCompletionMessage("Initializing download...");
                EDITOR.writeSystemMessage("File saved to the default path defined in your browser settings.");
                //Not possible to define the saving path with javascript, You need to change your own browser settings.
                // This would enter the realm of privileged code, of which website content code cannot touch.
                saveAs(content, "WebGL-Editor.zip");
                document.getElementById("save_program").disabled = false;
            });
        }
        EDITOR.obj = [];
        EDITOR.img = [];
    };

    function resetControllerState() {
        controller.onchange = null;
        controller.xRot = 0;
        controller.yRot = 0;
        controller.curX = 0;
        controller.curY = 0;
        controller.xTrans = 0;
        controller.yTrans = 0;
        controller.zTrans = 0;
        controller.velocity = 1 / 100;
        controller.deltaXRot = 0.0;
        controller.deltaYRot = 0.0;
        controller.deltaXTrans = 0.0;
        controller.deltaYTrans = 0.0;
        controller.deltaZTrans = 0.0;
        controller.objectScale = 1;
    }
})(this); //End of Anonymous Closure//


//---------------------------------GLOBAL Helper functions the user can use!--------------------------------//

/**
 * Takes in the WebGLRenderingContext and starts to compile, attach and link the Vertex- and Fragment Shader.
 * @param {WebGLRenderingContext} gl is the WebGLRenderingContext instance
 * @return {WebGLProgram} A WebGLProgram object that is a combination of two compiled WebGLShaders consisting of a vertex shader and
 * a fragment shader (both written in GLSL). These are then linked into a usable program.
 */
function initShaders(gl) {
    var failed = 0;
    var vertShdr = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShdr, EDITOR.vsEditor.getValue());
    gl.compileShader(vertShdr);
    if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
        EDITOR._spinner.stop();
        EDITOR.writeError("Vertex shader failed to compile:");
        EDITOR.styleShaderError(gl.getShaderInfoLog(vertShdr));
        failed = -1;
        EDITOR._shaderError = true;
    }
    var fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShdr, EDITOR.fsEditor.getValue());
    gl.compileShader(fragShdr);
    if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
        EDITOR._spinner.stop();
        EDITOR.writeError("Fragment shader failed to compile:");
        EDITOR.styleShaderError(gl.getShaderInfoLog(fragShdr));
        failed = -1;
        EDITOR._shaderError = true;
    }
    if (failed !== -1) {
        var program = gl.createProgram();
        gl.attachShader(program, vertShdr);
        gl.attachShader(program, fragShdr);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            EDITOR.writeError("Shader program failed to link. ");
            EDITOR._shaderError = true;
            EDITOR._spinner.stop();
            EDITOR.writeError(gl.getProgramInfoLog(program));
            return -1;
        }
        EDITOR.writeCompletionMessage("Shaders compiled successfully");
    }
    return program;
}

/**
 * @description
 * Returns the vertex shader code in String representation provided in the VS form.
 *
 * @return {String} String representation of the vertex shader code.
 */
function getVertexShaderSource() {
    return EDITOR.vsEditor.getValue();
}

/**
 * @description
 * Returns the fragment shader code in String representation provided in the FS form.
 *
 * @return {String} String representation of the fragment shader code.
 */
function getFragmentShaderSource() {
    return EDITOR.fsEditor.getValue();
}

/**
 * @description
 * Takes in a javascript array and copies it into a Float32Array.
 *
 * @param {Array} m An array in javascript representation
 * @return {Float32Array} The newly created Float32Array
 */
function flatten(m) {
    var result = new Float32Array(m[0].length * m.length);
    var i, j;
    for (i = 0; i < m.length; i++) {
        for (j = 0; j < m[0].length; j++) {
            result[m[0].length * i + j] = m[i][j];
        }
    }
    return result;
}

/**
 * @description
 * Logging function which prints the value of any given Type to the status-window.
 *
 * @param {*} message The message to be displayed
 */
function writeLog(message) {
    var container = document.getElementById("errorLogContainer");
    var newP = document.createElement("p");
    var newBr = document.createElement("br");
    var time = new Date().toLocaleTimeString();
    var text = document.createTextNode(time + ":  " + message);
    newP.appendChild(text);
    newP.appendChild(newBr);
    container.appendChild(newP, container.lastChild);
    EDITOR.scrollLoggerToBottom();
}

/**
 * @description
 * Generates a mat4 viewing matrix and connects it with the control of an arcball camera, by using the Object literals of the controller Object.
 *
 *  <pre>
 * Note: In order to see the changes when interacting with the canvas, the provided matrix has to be send to the vertex shader (e.g. as an uniform)
 * in the render-loop.
 * </pre>
 *
 * @param {mat4} matrix Placeholder matrix in which the viewing matrix will be stored
 * @param {vec3} eye The starting camera position
 * @param {vec3} at The starting focus point
 * @param {vec3} up The starting roll of the camera
 */
function lookAtArcballCamera(matrix, eye, at, up) {
    var camera = createArcballCamera(eye, at, up);
    camera.view(matrix);
    controller.onchange = function () {
        if (!EDITOR._pause) {
            camera.pan([-controller.deltaXTrans / 5, -controller.deltaYTrans / 5]);
            camera.zoom(controller.deltaZTrans * 10);
            camera.rotate([-controller.deltaXRot / 2, -controller.deltaYRot / 2], [0, 0]);
            camera.view(matrix);
        }
    };
}

/**
 * @description
 * Takes in a mat4 model matrix and manipulates it by using the Object literals of the controller Object.
 *
 * <pre>
 * Note: In order to see the changes when interacting with the canvas, the provided matrix has to be send to the vertex shader (e.g. as an uniform)
 * in the render-loop.
 * </pre>

 *
 * @param {mat4} matrix Placeholder matrix in which the model matrix will be stored
 */
function modelInteraction(matrix) {
    var xRotMatrix = mat4.create();
    var yRotMatrix = mat4.create();
    var translationMatrix = mat4.create();
    var scaleMatrix = mat4.create();

    controller.onchange = function () {
        if (!EDITOR._pause) {
            //Clamp the x-Rotation (do not flip the model)
            /* if (controller.xRot >= Math.PI / 2) {
             controller.xRot = Math.PI / 2
             } else if (controller.xRot <= -Math.PI / 2) {
             controller.xRot = -Math.PI / 2;
             }*/
            //ROTATE
            mat4.fromYRotation(yRotMatrix, -controller.yRot);
            mat4.fromXRotation(xRotMatrix, -controller.xRot);
            mat4.multiply(matrix, xRotMatrix, yRotMatrix);

            //TRANSLATE
            mat4.fromTranslation(translationMatrix, vec3.fromValues(-controller.xTrans, controller.yTrans, 0));
            mat4.multiply(matrix, translationMatrix, matrix);

            //SCALE
            mat4.fromScaling(scaleMatrix, vec3.fromValues(controller.objectScale, controller.objectScale, controller.objectScale));
            mat4.multiply(matrix, scaleMatrix, matrix);
        }
    };
}