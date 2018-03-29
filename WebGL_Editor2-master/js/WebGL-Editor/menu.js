/*
 MIT License

 Copyright (c) 2017 Daniel Braun

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

$(document).ready(function () {

    $("#gl-canvas").click(function () {
        document.getElementById("gl-canvas").focus();
    });
    /*-----------------------------------------closed menu------------------------------------------------------------*/
    $("#toggle_menu").click(function () {
        if (!EDITOR._pause && EDITOR._run) {
            EDITOR._pausedByMenu = true;
            EDITOR.pauseRun();
        }
        $("#sidebar_mainmenu").removeClass("hide_menu");
        $("#toggle_menu").addClass("toggled_menu");
        $("#blur_background").removeClass("hide_blur_background");
        $("#blur_background").addClass("blur_background");
    });

    /*------------------------------------Code masks handling----------------------------------------------------*/
    $("#fullscreenBtn").click(function () {
        EDITOR.fullscreen();
    });

    $("#webGL").click(function () {
        if (EDITOR.selectedTab !== 0) {
            if (!EDITOR.isMobile)
                EDITOR.webglEditor.focus();
            $("#webGL").addClass("selectTab");
            $("#vs").removeClass("selectTab");
            $("#fs").removeClass("selectTab");
            EDITOR.selectedTab = 0;


            $("#editorWebGL").removeClass("hide_editor");
            $("#editorFS").addClass("hide_editor");
            $("#editorVS").addClass("hide_editor");

            EDITOR.webglEditor.resize();
        }
    });

    $("#vs").click(function () {
        if (EDITOR.selectedTab !== 1) {
            if (!EDITOR.isMobile)
                EDITOR.vsEditor.focus();
            $("#vs").addClass("selectTab");
            $("#webGL").removeClass("selectTab");
            $("#fs").removeClass("selectTab");
            EDITOR.selectedTab = 1;

            $("#editorVS").removeClass("hide_editor");
            $("#editorFS").addClass("hide_editor");
            $("#editorWebGL").addClass("hide_editor");

            EDITOR.vsEditor.resize();
        }
    });

    $("#fs").click(function () {
        if (EDITOR.selectedTab !== 2) {
            if (!EDITOR.isMobile)
                EDITOR.fsEditor.focus();
            $("#fs").addClass("selectTab");
            $("#vs").removeClass("selectTab");
            $("#webGL").removeClass("selectTab");
            EDITOR.selectedTab = 2;

            $("#editorFS").removeClass("hide_editor");
            $("#editorVS").addClass("hide_editor");
            $("#editorWebGL").addClass("hide_editor");

            EDITOR.fsEditor.resize();
        }
    });
    $("#blur_background").click(function () {
        if (EDITOR._pausedByMenu) {
            EDITOR._pausedByMenu = false;
            EDITOR.unPause();
        }

        $("#demo_sidebar").addClass("hide_menu");
        $("#src_sidebar").addClass("hide_menu");
        $("#docu_sidebar").addClass("hide_menu");
        $("#about_sidebar").addClass("hide_menu");
        $("#src_object_sidebar").addClass("hide_menu");
        $("#src_texture_sidebar").addClass("hide_menu");
        $("#sidebar_mainmenu").addClass("hide_menu");
        $("#toggle_menu").removeClass("toggled_menu");

        $("#blur_background").addClass("hide_blur_background");
        setTimeout(function () {
            $("#blur_background").removeClass("blur_background");

            $("#demo_sidebar").addClass("hide_menu");
            $("#src_sidebar").addClass("hide_menu");
            $("#docu_sidebar").addClass("hide_menu");
            $("#about_sidebar").addClass("hide_menu");
            $("#src_object_sidebar").addClass("hide_menu");
            $("#src_texture_sidebar").addClass("hide_menu");
            $("#sidebar_mainmenu").addClass("hide_menu");
            $("#toggle_menu").removeClass("toggled_menu");
        }, 400);
    });

    /* ------------------controlling start pause and run in menu ---------------------------*/

    $("#startRun").click(function () {
        $("#startRun").addClass("startRun");
        $("#pauseRun").removeClass("pauseRun");
        $("#cancelRun").removeClass("cancelRun");
        if (EDITOR._pause) {
            EDITOR.unPause();
            EDITOR.writeSystemMessage("Resumed rendering.");
        } else {
            EDITOR.compileRun();
        }
    });
    $("#pauseRun").click(function () {
        if (EDITOR._run && !EDITOR._pause) {
            $("#pauseRun").addClass("pauseRun");
            $("#startRun").removeClass("startRun");
            $("#cancelRun").removeClass("cancelRun");
            EDITOR.pauseRun();
            EDITOR.writeSystemMessage("Paused rendering.");
        } else if (!EDITOR._pause) {
            // cleanLog();
            EDITOR.writeSystemMessage("Application is not running.");
        } else {
            EDITOR.writeSystemMessage("Already paused.")
        }
    });
    $("#cancelRun").click(function () {
        if (EDITOR._run) {
            $("#cancelRun").addClass("cancelRun");
            $("#startRun").removeClass("startRun");
            $("#pauseRun").removeClass("pauseRun");
            EDITOR.cancelRun();
            //  EDITOR.cleanLog();
            EDITOR.writeSystemMessage("Canceled rendering.");
        } else {
            //EDITOR.cleanLog();
            EDITOR.writeSystemMessage("Application is not running.");
        }
    });

    /*--------------------------------download/upload program state ---------------------------------------*/
    $("#save_program").click(function () {
        document.getElementById("save_program").disabled = true;
        var zip = new JSZip();
        //Saving program state in separate files for vs-, fs- and WebGL-code
        zip.file("webgl.js", EDITOR.webglEditor.getValue());
        zip.file("vertexShader.vert", EDITOR.vsEditor.getValue());
        zip.file("fragmentShader.frag", EDITOR.fsEditor.getValue());

        //Saving everything for the standalone version
        var standaloneFolder = zip.folder("standalone");
        var libsFolder = standaloneFolder.folder("libs");
        var srcFolder = standaloneFolder.folder("src");
        var objectFolder = srcFolder.folder("object");
        var textureFolder = srcFolder.folder("texture");

        EDITOR.textFromFile('js/WebGL-Editor/controller.js', 'controller.js', libsFolder);
        EDITOR.textFromFile('js/WebGL-Editor/webgl-utils.js', 'webgl-utils.js', libsFolder);
        EDITOR.textFromFile('js/gl-matrix/gl-matrix.js', 'gl-matrix.js', libsFolder);
        EDITOR.textFromFile('js/orbit/orbit.js', 'orbit.js', libsFolder);
        EDITOR.textFromFile('js/Hammer/hammer-2.0.8-2016.04.23.min.js', 'hammer-2.0.8-2016.04.23.min.js', libsFolder);
        EDITOR.textFromFile('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js', 'jquery-3.2.1.min.js', libsFolder);

        standaloneFolder.file("README.txt", "To run the standalone version open the index.html file with your browser. NOTE: Because of security reasons Chrome blocks " +
            "the loading process of objects and textures which reads from your local directory! Firefox allow us to do so. When loading Objects or textures make sure to run index.html with Firefox.");
        EDITOR.textFromFile('standalone/webgl-debug.js', 'webgl-debug.js', libsFolder); //saving modified obj loader js file
        EDITOR.textFromFile('standalone/webgl-obj-loader.js', 'webgl-obj-loader.js', libsFolder); //saving modified obj loader js file
        EDITOR.textFromFile('standalone/webgl-texture-loader.js', 'webgl-texture-loader.js', libsFolder); //saving modified texture loader js file
        EDITOR.textFromFile('standalone/style.css', 'style.css', standaloneFolder);
        EDITOR.textFromFile('standalone/index.html', 'index.html', standaloneFolder);

        EDITOR.findUsedObjects();
        EDITOR.findUsedImages();

        if (EDITOR.img.length === 0 && EDITOR.obj.length === 0) {
            //saving without obj and images -> no obj or tex used
            EDITOR.save(zip);
        } else {
            EDITOR.saveSubroutine(objectFolder, textureFolder, zip);
        }


        EDITOR.textFromFileRestore('js/WebGL-Editor/webgl-texture-loader.js');
        EDITOR.textFromFileRestore('js/WebGL-Editor/webgl-obj-loader.js');
        EDITOR.textFromFileRestore('js/WebGL-Editor/webgl-debug.js');
        document.getElementById("save_program").disabled = false;

    });

    //uploading program state
    $("#upload_program").click(function () {
        $("input#file-input").unbind('change');
        $('#file-input').trigger('click');
        EDITOR.writeSystemMessage("You may upload the whole program state of a zip file (containing the WebGL-, Vertex- and Fragment Shader-Codes), or each file individually.");
        $("input#file-input").change(function () {
            if (!window.FileReader) {
                alert('Filereader is not supported. Please get the latest browser.');
                return;
            }
            var input = jQuery(this).get(0);
            var fileExtension = jQuery(this).val().substring(jQuery(this).val().lastIndexOf(".") + 1);
            var reader = new FileReader();
            if (input.files.length) {
                var data = input.files[0];
            }
            if (fileExtension === "zip") {
                JSZip.loadAsync(data).then(function (zip) {
                    var webgl = zip.files["webgl.js"];
                    var vs = zip.files["vertexShader.vert"];
                    var fs = zip.files["fragmentShader.frag"];

                    if (webgl !== undefined) {
                        zip.file(webgl.name).async("string").then(function success(content) {
                            EDITOR.webglEditor.setValue(content,-1);
                            EDITOR.writeCompletionMessage("webgl.js successfully uploaded.")
                        });
                    } else {
                        EDITOR.writeSystemMessage("webgl.js not found.")
                    }
                    if (vs !== undefined) {
                        zip.file(vs.name).async("string").then(function success(content) {
                            EDITOR.vsEditor.setValue(content,-1);
                            EDITOR.writeCompletionMessage("vertexShader.vert successfully uploaded.")
                        });
                    } else {
                        EDITOR.writeSystemMessage("vertexShader.vert not found.")
                    }
                    if (fs !== undefined) {
                        zip.file(fs.name).async("string").then(function success(content) {
                            EDITOR.fsEditor.setValue(content,-1);
                            EDITOR.writeCompletionMessage("fragmentShader.frag successfully uploaded.");
                        });
                    } else {
                        EDITOR.writeSystemMessage("fragmentShader.frag not found.");
                    }
                });
            } else if (fileExtension === "js") {
                if (input.files.length) {
                    reader.readAsText(data);
                    $(reader).on('load', EDITOR.processJs);
                    EDITOR.writeCompletionMessage("webgl.js successfully uploaded.")
                }
            } else if (fileExtension === "vert") {
                if (input.files.length) {
                    reader.readAsText(data);
                    $(reader).on('load', EDITOR.processVert);
                    EDITOR.writeCompletionMessage("vertexShader.vert successfully uploaded.")
                }
            } else if (fileExtension === "frag") {
                if (input.files.length) {
                    reader.readAsText(data);
                    $(reader).on('load', EDITOR.processFrag);
                    EDITOR.writeCompletionMessage("fragmentShader.frag successfully uploaded.");
                }
            } else {
                EDITOR.writeSystemMessage("Chosen file not Supported!");
                EDITOR.writeSystemMessage('Program state can only be uploaded like saved before as Zip-file or a single file with the corresponding file names "webgl.js", "vertexShader.vert" and "fragmentShader.frag".');
            }
            $('#file-input').val(''); // Reset file input to the initial state, so you can upload the same file again
        });
    });

    /*-----------------------------------handling menu tabs------------------------------------------------------*/

    $("#demo").click(function () {
        setTimeout(function () {
            $("#demo_sidebar").removeClass("hide_menu");
        }, 400);
        $("#sidebar_mainmenu").addClass("hide_menu");
    });

    $("#src").click(function () {
        setTimeout(function () {
            $("#src_sidebar").removeClass("hide_menu");
        }, 400);
        $("#sidebar_mainmenu").addClass("hide_menu");
    });

    $("#docu").click(function () {
        setTimeout(function () {
            $("#docu_sidebar").removeClass("hide_menu");
        }, 400);
        $("#sidebar_mainmenu").addClass("hide_menu");
    });
    $("#about").click(function () {
        setTimeout(function () {
            $("#about_sidebar").removeClass("hide_menu");
        }, 400);
        $("#sidebar_mainmenu").addClass("hide_menu");
    });

    $("#obj").click(function () {
        setTimeout(function () {
            $("#src_object_sidebar").removeClass("hide_menu");
        }, 400);
        $("#src_sidebar").addClass("hide_menu");
    });

    $("#tex").click(function () {
        setTimeout(function () {
            $("#src_texture_sidebar").removeClass("hide_menu");
        }, 400)
        $("#src_sidebar").addClass("hide_menu");
    });

    $("#return_from_demo").click(function () {
        EDITOR._openMenuTab = '#sidebar_mainmenu';
        $("#demo_sidebar").addClass("hide_menu");
        setTimeout(function () {
            $("#sidebar_mainmenu").removeClass("hide_menu");
        }, 400);
    });

    $("#return_from_src").click(function () {
        $("#src_sidebar").addClass("hide_menu");
        setTimeout(function () {
            $("#sidebar_mainmenu").removeClass("hide_menu");
        }, 400);
    });

    $("#return_from_docu").click(function () {
        $("#docu_sidebar").addClass("hide_menu");
        setTimeout(function () {
            $("#sidebar_mainmenu").removeClass("hide_menu");
        }, 400);
    });

    $("#return_from_about").click(function () {
        $("#about_sidebar").addClass("hide_menu");
        setTimeout(function () {
            $("#sidebar_mainmenu").removeClass("hide_menu");
        }, 400);
    });

    $("#return_from_src_object").click(function () {
        $("#src_object_sidebar").addClass("hide_menu");
        setTimeout(function () {
            $("#src_sidebar").removeClass("hide_menu");
        }, 400);
    });

    $("#return_from_src_texture").click(function () {
        $("#src_texture_sidebar").addClass("hide_menu");
        setTimeout(function () {
            $("#src_sidebar").removeClass("hide_menu");
        }, 400);
    });

    $("#demo1").click(function () {
        EDITOR.setEditorTextFromFile("./src/demo/ColorizedCube/vertexShader.vert", EDITOR.vsEditor);
        EDITOR.setEditorTextFromFile("./src/demo/ColorizedCube/fragmentShader.frag", EDITOR.fsEditor);
        EDITOR.setEditorTextFromFile("./src/demo/ColorizedCube/webgl.js", EDITOR.webglEditor);

        $('#blur_background').trigger('click');
    });
    $("#demo2").click(function () {
        EDITOR.setEditorTextFromFile("./src/demo/RotatingDNA/vertexShader.vert", EDITOR.vsEditor);
        EDITOR.setEditorTextFromFile("./src/demo/RotatingDNA/fragmentShader.frag", EDITOR.fsEditor);
        EDITOR.setEditorTextFromFile("./src/demo/RotatingDNA/webgl.js", EDITOR.webglEditor);

        $('#blur_background').trigger('click');
    });
    $("#demo3").click(function () {

        EDITOR.setEditorTextFromFile("./src/demo/ShadedCube/vertexShader.vert", EDITOR.vsEditor);
        EDITOR.setEditorTextFromFile("./src/demo/ShadedCube/fragmentShader.frag", EDITOR.fsEditor);
        EDITOR.setEditorTextFromFile("./src/demo/ShadedCube/webgl.js", EDITOR.webglEditor);

        $('#blur_background').trigger('click');
    });
    $("#demo4").click(function () {

        EDITOR.setEditorTextFromFile("./src/demo/Load_obj_tex/vertexShader.vert", EDITOR.vsEditor);
        EDITOR.setEditorTextFromFile("./src/demo/Load_obj_tex/fragmentShader.frag", EDITOR.fsEditor);
        EDITOR.setEditorTextFromFile("./src/demo/Load_obj_tex/webgl.js", EDITOR.webglEditor);

        $('#blur_background').trigger('click');
    });
    $("#demo5").click(function () {

        EDITOR.setEditorTextFromFile("./src/demo/Sea_Waves/vertexShader.vert", EDITOR.vsEditor);
        EDITOR.setEditorTextFromFile("./src/demo/Sea_Waves/fragmentShader.frag", EDITOR.fsEditor);
        EDITOR.setEditorTextFromFile("./src/demo/Sea_Waves/webgl.js", EDITOR.webglEditor);
        $('#blur_background').trigger('click');
    });

    $("#demo6").click(function () {

        EDITOR.setEditorTextFromFile("./src/demo/Empty_Project/vertexShader.vert", EDITOR.vsEditor);
        EDITOR.setEditorTextFromFile("./src/demo/Empty_Project/fragmentShader.frag", EDITOR.fsEditor);
        EDITOR.setEditorTextFromFile("./src/demo/Empty_Project/webgl.js", EDITOR.webglEditor);

        $('#blur_background').trigger('click');
    });
    $("#demo7").click(function () {

        EDITOR.setEditorTextFromFile("./src/demo/Aufgabe3.1/vertexShader.vert", EDITOR.vsEditor);
        EDITOR.setEditorTextFromFile("./src/demo/Aufgabe3.1/fragmentShader.frag", EDITOR.fsEditor);
        EDITOR.setEditorTextFromFile("./src/demo/Aufgabe3.1/webgl.js", EDITOR.webglEditor);
        EDITOR.writeSystemMessage("Laden Sie die Lösung bitte nur, wenn Sie Aufgabe 3.1 nicht selbst lösen können.");
        $('#blur_background').trigger('click');
    });

    $("#vertices").click(function () {
        $('#webGL').trigger('click');
    });
    $("#vertShad").click(function () {
        $('#vs').trigger('click');
    });
    $("#fragShad").click(function () {
        $('#fs').trigger('click');
    });
    $("#texture").click(function () {
        $('#webGL').trigger('click');
    });
});




