ace.define("ace/mode/doc_comment_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var DocCommentHighlightRules = function() {
    this.$rules = {
        "start" : [ {
            token : "comment.doc.tag",
            regex : "@[\\w\\d_]+" // TODO: fix email addresses
        }, 
        DocCommentHighlightRules.getTagRule(),
        {
            defaultToken : "comment.doc",
            caseInsensitive: true
        }]
    };
};

oop.inherits(DocCommentHighlightRules, TextHighlightRules);

DocCommentHighlightRules.getTagRule = function(start) {
    return {
        token : "comment.doc.tag.storage.type",
        regex : "\\b(?:TODO|FIXME|XXX|HACK)\\b"
    };
}

DocCommentHighlightRules.getStartRule = function(start) {
    return {
        token : "comment.doc", // doc comment
        regex : "\\/\\*(?=\\*)",
        next  : start
    };
};

DocCommentHighlightRules.getEndRule = function (start) {
    return {
        token : "comment.doc", // closing comment
        regex : "\\*\\/",
        next  : start
    };
};


exports.DocCommentHighlightRules = DocCommentHighlightRules;

});

ace.define("ace/mode/javascript_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/doc_comment_highlight_rules","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var identifierRe = "[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*";

var JavaScriptHighlightRules = function(options) {
    var keywordMapper = this.createKeywordMapper({
        "variable.language":
            "controller|OBJ|gl|TEX|canvas|glMatrix|mat2|mat2d|mat3|mat4|quat|vec2|vec3|vec4|" + //TODO: Webgl-Editor variables, die sachen von glMatrix mit rein! api gucken
            "Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|"  + // Constructors
            "Namespace|QName|XML|XMLList|"                                             + // E4X
            "ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|"   +
            "Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|"                    +
            "Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|"   + // Errors
            "SyntaxError|TypeError|URIError|"                                          +
            "decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|" + // Non-constructor functions
            "isNaN|parseFloat|parseInt|"                                                +
            "JSON|Math|"                                                               + // Other
            "this|arguments|prototype|window|document"                                 , // Pseudo
        "keyword":
            "EPSILON|ARRAY_TYPE|RANDOM|ENABLE_SIMD|"+ //TODO: glmatrix constants
            "xRot|yRot|xTrans|yTrans|zTrans|velocity|deltaXRot|deltaYRot|deltaXTrans|deltaYTrans|deltaZTrans|interactionType|objectScale|DEPTH_BUFFER_BIT|STENCIL_BUFFER_BIT|COLOR_BUFFER_BIT|POINTS|LINES|LINE_LOOP|LINE_STRIP|TRIANGLES|TRIANGLE_STRIP|TRIANGLE_FAN|NEVER|LESS|EQUAL|LEQUAL|GREATER|NOTEQUAL|GEQUAL|ALWAYS|ZERO|ONE|SRC_COLOR|ONE_MINUS_SRC_COLOR|SRC_ALPHA|ONE_MINUS_SRC_ALPHA|DST_ALPHA|ONE_MINUS_DST_ALPHA|DST_COLOR|ONE_MINUS_DST_COLOR|SRC_ALPHA_SATURATE|FUNC_ADD|BLEND_EQUATION|BLEND_EQUATION_RGB|BLEND_EQUATION_ALPHA|FUNC_SUBTRACT|FUNC_REVERSE_SUBTRACT|BLEND_DST_RGB|BLEND_SRC_RGB|BLEND_DST_ALPHA|BLEND_SRC_ALPHA|CONSTANT_COLOR|ONE_MINUS_CONSTANT_COLOR|CONSTANT_ALPHA|ONE_MINUS_CONSTANT_ALPHA|BLEND_COLOR|ARRAY_BUFFER|ARRAY_BUFFER_BINDING|ELEMENT_ARRAY_BUFFER_BINDING|ELEMENT_ARRAY_BUFFER|STREAM_DRAW|STATIC_DRAW|DYNAMIC_DRAW|BUFFER_SIZE|BUFFER_USAGE|CURRENT_VERTEX_ATTRIB|FRONT|BACK|FRONT_AND_BACK|CULL_FACE|BLEND|DITHER|STENCIL_TEST|DEPTH_TEST|SCISSOR_TEST|POLYGON_OFFSET_FILL|SAMPLE_ALPHA_TO_COVERAGE|SAMPLE_COVERAGE|NO_ERROR|INVALID_ENUM|INVALID_VALUE|INVALID_OPERATION|OUT_OF_MEMORY|CW|CCW|LINE_WIDTH|ALIASED_POINT_SIZE_RANGE|ALIASED_LINE_WIDTH_RANGE|CULL_FACE_MODE|FRONT_FACE|DEPTH_RANGE|DEPTH_WRITEMASK|DEPTH_CLEAR_VALUE|DEPTH_FUNC|STENCIL_CLEAR_VALUE|STENCIL_FUNC|STENCIL_FAIL|STENCIL_PASS_DEPTH_FAIL|STENCIL_PASS_DEPTH_PASS|STENCIL_REF|STENCIL_VALUE_MASK|STENCIL_WRITEMASK|STENCIL_BACK_FUNC|STENCIL_BACK_FAIL|STENCIL_BACK_PASS_DEPTH_FAIL|STENCIL_BACK_PASS_DEPTH_PASS|STENCIL_BACK_REF|STENCIL_BACK_VALUE_MASK|STENCIL_BACK_WRITEMASK|VIEWPORT|SCISSOR_BOX|COLOR_CLEAR_VALUE|COLOR_WRITEMASK|UNPACK_ALIGNMENT|PACK_ALIGNMENT|MAX_TEXTURE_SIZE|MAX_VIEWPORT_DIMS|SUBPIXEL_BITS|RED_BITS|GREEN_BITS|BLUE_BITS|ALPHA_BITS|DEPTH_BITS|STENCIL_BITS|POLYGON_OFFSET_UNITS|POLYGON_OFFSET_FACTOR|TEXTURE_BINDING_2D|SAMPLE_BUFFERS|SAMPLES|SAMPLE_COVERAGE_VALUE|SAMPLE_COVERAGE_INVERT|COMPRESSED_TEXTURE_FORMATS|DONT_CARE|FASTEST|NICEST|GENERATE_MIPMAP_HINT|BYTE|UNSIGNED_BYTE|SHORT|UNSIGNED_SHORT|INT|UNSIGNED_INT|FLOAT|DEPTH_COMPONENT|ALPHA|RGB|RGBA|LUMINANCE|LUMINANCE_ALPHA|UNSIGNED_SHORT_4_4_4_4|UNSIGNED_SHORT_5_5_5_1|UNSIGNED_SHORT_5_6_5|FRAGMENT_SHADER|VERTEX_SHADER|MAX_VERTEX_ATTRIBS|MAX_VERTEX_UNIFORM_VECTORS|MAX_VARYING_VECTORS|MAX_COMBINED_TEXTURE_IMAGE_UNITS|MAX_VERTEX_TEXTURE_IMAGE_UNITS|MAX_TEXTURE_IMAGE_UNITS|MAX_FRAGMENT_UNIFORM_VECTORS|SHADER_TYPE|DELETE_STATUS|LINK_STATUS|VALIDATE_STATUS|ATTACHED_SHADERS|ACTIVE_UNIFORMS|ACTIVE_ATTRIBUTES|SHADING_LANGUAGE_VERSION|CURRENT_PROGRAM|KEEP|REPLACE|INCR|DECR|INVERT|INCR_WRAP|DECR_WRAP|VENDOR|RENDERER|VERSION|NEAREST|LINEAR|NEAREST_MIPMAP_NEAREST|LINEAR_MIPMAP_NEAREST|NEAREST_MIPMAP_LINEAR|LINEAR_MIPMAP_LINEAR|TEXTURE_MAG_FILTER|TEXTURE_MIN_FILTER|TEXTURE_WRAP_S|TEXTURE_WRAP_T|TEXTURE_2D|TEXTURE|TEXTURE_CUBE_MAP|TEXTURE_BINDING_CUBE_MAP|TEXTURE_CUBE_MAP_POSITIVE_X|TEXTURE_CUBE_MAP_NEGATIVE_X|TEXTURE_CUBE_MAP_POSITIVE_Y|TEXTURE_CUBE_MAP_NEGATIVE_Y|TEXTURE_CUBE_MAP_POSITIVE_Z|TEXTURE_CUBE_MAP_NEGATIVE_Z|MAX_CUBE_MAP_TEXTURE_SIZE|TEXTURE0|TEXTURE1|TEXTURE2|TEXTURE3|TEXTURE5|TEXTURE6|TEXTURE7|TEXTURE8TEXTURE9|TEXTURE10|TEXTURE11|TEXTURE12|TEXTURE13|TEXTURE14|TEXTURE15|TEXTURE16|TEXTURE17|TEXTURE18|TEXTURE19|TEXTURE20|TEXTURE21|TEXTURE22|TEXTURE23|TEXTURE24|TEXTURE25|TEXTURE26|TEXTURE27|TEXTURE28|TEXTURE29|TEXTURE30|TEXTURE31|ACTIVE_TEXTURE|REPEAT|CLAMP_TO_EDGE|MIRRORED_REPEAT|FLOAT_VEC2|FLOAT_VEC3|FLOAT_VEC4|INT_VEC2|INT_VEC3|INT_VEC4|BOOL|BOOL_VEC2|BOOL_VEC3|BOOL_VEC4|FLOAT_MAT2|FLOAT_MAT3|FLOAT_MAT4|SAMPLER_2D|SAMPLER_CUBE|VERTEX_ATTRIB_ARRAY_ENABLED|VERTEX_ATTRIB_ARRAY_SIZE|VERTEX_ATTRIB_ARRAY_STRIDE|VERTEX_ATTRIB_ARRAY_TYPE|VERTEX_ATTRIB_ARRAY_NORMALIZED|VERTEX_ATTRIB_ARRAY_POINTER|VERTEX_ATTRIB_ARRAY_BUFFER_BINDING|IMPLEMENTATION_COLOR_READ_TYPE|IMPLEMENTATION_COLOR_READ_FORMAT|COMPILE_STATUS|LOW_FLOAT|MEDIUM_FLOAT|HIGH_FLOAT|LOW_INT|MEDIUM_INT|HIGH_INT|FRAMEBUFFER|RENDERBUFFER|RGBA4|RGB5_A1|RGB565|DEPTH_COMPONENT16|STENCIL_INDEX8|DEPTH_STENCIL|RENDERBUFFER_WIDTH|RENDERBUFFER_HEIGHT|RENDERBUFFER_INTERNAL_FORMAT|RENDERBUFFER_RED_SIZE|RENDERBUFFER_GREEN_SIZE|RENDERBUFFER_BLUE_SIZE|RENDERBUFFER_ALPHA_SIZE|RENDERBUFFER_DEPTH_SIZE|RENDERBUFFER_STENCIL_SIZE|FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE|FRAMEBUFFER_ATTACHMENT_OBJECT_NAME|FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL|FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE|COLOR_ATTACHMENT0|DEPTH_ATTACHMENT|STENCIL_ATTACHMENT|DEPTH_STENCIL_ATTACHMENT|NONE|FRAMEBUFFER_COMPLETE|FRAMEBUFFER_INCOMPLETE_ATTACHMENT|FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT|FRAMEBUFFER_INCOMPLETE_DIMENSIONS|FRAMEBUFFER_UNSUPPORTED|FRAMEBUFFER_BINDING|RENDERBUFFER_BINDING|MAX_RENDERBUFFER_SIZE|INVALID_FRAMEBUFFER_OPERATION|UNPACK_FLIP_Y_WEBGL|UNPACK_PREMULTIPLY_ALPHA_WEBGL|CONTEXT_LOST_WEBGL|UNPACK_COLORSPACE_CONVERSION_WEBGL|BROWSER_DEFAULT_WEBGL|canvas|drawingBufferWidth|drawingBufferHeight|"+ //TODO: webgl CONSTANTS without dot notation // constants with dot notation will only shown in autocompletion when added here
            "const|yield|import|get|set|async|await|" +
            "break|case|catch|continue|default|delete|do|else|finally|for|function|" +
            "if|in|of|instanceof|new|return|switch|throw|try|typeof|let|var|while|with|debugger|" +
            "__parent__|__count__|escape|unescape|with|__proto__|" +
            "class|enum|extends|super|export|implements|private|public|interface|package|protected|static",
        "storage.type":
            "const|let|var",
        "constant.language":
            "null|Infinity|NaN|undefined",
        "support.function":
            "downloadMeshes|downloadTextures|setMatrixArrayType|toRadian|equals|add|adjoint|clone|copy|create|determinant|exactEquals|frob|fromRotation|fromScaling|fromValues|identity|invert|LDU|mul|multiply|multiplyScalar|multiplyScalarAndAdd|rotate|scale|set|str|sub|subtract|transpose|fromTranslation|fromMat2d|fromMat4|fromQuat|normalFromMat4|projection|translate|fromRotationTranslation|fromRotationTranslationScale|fromRotationTranslationScaleOrigin|fromXRotation|fromYRotation|fromZRotation|frustum|getRotation|getScaling|getTranslation|lookAt|ortho|perspective|perspectiveFromFieldOfView|rotateX|rotateY|rotateZ|targetTo|length|rotationTo|setAxes|sqlerp|calculateW|conjugate|dot|fromEuler|fromMat3|getAxisAngle|len|lerp|normalize|setAxisAngle|slerp|sqrLen|squaredLength|ceil|cross|dist|distance|div|divide|floor|forEach|max|min|negate|random|round|scaleAndAdd|sqrDist|squaredDistance|transformMat2|transformMat2d|transformMat3|transformMat4|angle|bezier|hermite|inverse|transformQuat|"+ //TODO: gl matrix functions.
                                //TODO: webgl editor functions without dot notation //functions with dot notation will only shown in autocompletion when added here
            "alert|getVertexShaderSource|getFragmentShaderSource|lookAtArcballCamera|modelInteraction|initShaders|initMeshBuffers|initTextureBuffer|deleteTextureBuffer|deleteMeshBuffers|writeLog|flatten" +
            "|getContextAttributes|isContextLost|getSupportedExtensions|getExtension|activeTexture|attachShader|bindAttribLocation|bindBuffer|bindFramebuffer|bindRenderbuffer|bindTexture|blendColor|blendEquation|blendEquationSeparate|blendFunc|blendFuncSeparate|bufferData|bufferSubData|checkFramebufferStatus|clear|clearColor|clearDepth|clearStencil|colorMask|compileShader|compressedTexImage2D|compressedTexSubImage2D|copyTexImage2D|copyTexSubImage2D|createBuffer|createFramebuffer|createProgram|createRenderbuffer|createShader|createTexture|cullFace|deleteBuffer|deleteFramebuffer|deleteProgram|deleteRenderbuffer|deleteShader|deleteTexture|depthFunc|depthMask|depthRange|detachShader|disable|disableVertexAttribArray|drawArrays|drawElements|enable|enableVertexAttribArray|finish|flush|framebufferRenderbuffer|framebufferTexture2D|frontFace|generateMipmap|getActiveAttrib|getActiveUniform|getAttachedShaders|getAttribLocation|getBufferParameter|getParameter|getError|getFramebufferAttachmentParameter|getProgramParameter|getProgramInfoLog|getRenderbufferParameter|getShaderParameter|getShaderPrecisionFormat|getShaderInfoLog|getShaderSource|getTexParameter|getUniform|getUniformLocation|getVertexAttrib|getVertexAttribOffset|hint|isBuffer|isEnabled|isFramebuffer|isProgram|isRenderbuffer|isShader|isTexture|lineWidth|linkProgram|pixelStorei|polygonOffset|readPixels|renderbufferStorage|sampleCoverage|scissor|shaderSource|stencilFunc|stencilFuncSeparate|stencilMask|stencilMaskSeparate|stencilOp|stencilOpSeparate|texImage2D|texParameterf|texParameteri|texSubImage2D|uniform1f|uniform2f|uniform3f|uniform4f|uniform1i|uniform2i|uniform3i|uniform4i|uniform1fv|uniform2fv|uniform3fv|uniform4fv|uniform1iv|uniform2iv|uniform3iv|uniform4iv|uniformMatrix2fv|uniformMatrix3fv|uniformMatrix4fv|useProgram|validateProgram|vertexAttrib1f|vertexAttrib2f|vertexAttrib3f|vertexAttrib4f|vertexAttrib1fv|vertexAttrib2fv|vertexAttrib3fv|vertexAttrib4fv|vertexAttribPointer|viewport|Location",
        "constant.language.boolean": "true|false"
    }, "identifier");
    var kwBeforeRe = "case|do|else|finally|in|instanceof|return|throw|try|typeof|yield|void";

    var escapedRe = "\\\\(?:x[0-9a-fA-F]{2}|" + // hex
        "u[0-9a-fA-F]{4}|" + // unicode
        "u{[0-9a-fA-F]{1,6}}|" + // es6 unicode
        "[0-2][0-7]{0,2}|" + // oct
        "3[0-7][0-7]?|" + // oct
        "[4-7][0-7]?|" + //oct
        ".)";

    this.$rules = {
        "no_regex" : [
            DocCommentHighlightRules.getStartRule("doc-start"),
            comments("no_regex"),
            {
                token : "string",
                regex : "'(?=.)",
                next  : "qstring"
            }, {
                token : "string",
                regex : '"(?=.)',
                next  : "qqstring"
            }, {
                token : "constant.numeric", // hex
                regex : /0(?:[xX][0-9a-fA-F]+|[bB][01]+)\b/
            }, {
                token : "constant.numeric", // float
                regex : /[+-]?\d[\d_]*(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/
            }, {
                token : [
                    "storage.type", "punctuation.operator", "support.function",
                    "punctuation.operator", "entity.name.function", "text","keyword.operator"
                ],
                regex : "(" + identifierRe + ")(\\.)(prototype)(\\.)(" + identifierRe +")(\\s*)(=)",
                next: "function_arguments"
            }, {
                token : [
                    "storage.type", "punctuation.operator", "entity.name.function", "text",
                    "keyword.operator", "text", "storage.type", "text", "paren.lparen"
                ],
                regex : "(" + identifierRe + ")(\\.)(" + identifierRe +")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                next: "function_arguments"
            }, {
                token : [
                    "entity.name.function", "text", "keyword.operator", "text", "storage.type",
                    "text", "paren.lparen"
                ],
                regex : "(" + identifierRe +")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                next: "function_arguments"
            }, {
                token : [
                    "storage.type", "punctuation.operator", "entity.name.function", "text",
                    "keyword.operator", "text",
                    "storage.type", "text", "entity.name.function", "text", "paren.lparen"
                ],
                regex : "(" + identifierRe + ")(\\.)(" + identifierRe +")(\\s*)(=)(\\s*)(function)(\\s+)(\\w+)(\\s*)(\\()",
                next: "function_arguments"
            }, {
                token : [
                    "storage.type", "text", "entity.name.function", "text", "paren.lparen"
                ],
                regex : "(function)(\\s+)(" + identifierRe + ")(\\s*)(\\()",
                next: "function_arguments"
            }, {
                token : [
                    "entity.name.function", "text", "punctuation.operator",
                    "text", "storage.type", "text", "paren.lparen"
                ],
                regex : "(" + identifierRe + ")(\\s*)(:)(\\s*)(function)(\\s*)(\\()",
                next: "function_arguments"
            }, {
                token : [
                    "text", "text", "storage.type", "text", "paren.lparen"
                ],
                regex : "(:)(\\s*)(function)(\\s*)(\\()",
                next: "function_arguments"
            }, {
                token : "keyword",
                regex : "(?:" + kwBeforeRe + ")\\b",
                next : "start"
            }, {
                token : ["support.constant"],
                regex : /that\b/
            }, {
                token : ["storage.type", "punctuation.operator", "support.function.firebug"],
                regex : /(console)(\.)(warn|info|log|error|time|trace|timeEnd|assert)\b/
            }, {
                token : keywordMapper,
                regex : identifierRe
            }, {
                token : "punctuation.operator",
                regex : /[.](?![.])/,
                next  : "property"
            }, {
                token : "keyword.operator",
                regex : /--|\+\+|\.{3}|===|==|=|!=|!==|<+=?|>+=?|!|&&|\|\||\?:|[!$%&*+\-~\/^]=?/,
                next  : "start"
            }, {
                token : "punctuation.operator",
                regex : /[?:,;.]/,
                next  : "start"
            }, {
                token : "paren.lparen",
                regex : /[\[({]/,
                next  : "start"
            }, {
                token : "paren.rparen",
                regex : /[\])}]/
            }, {
                token: "comment",
                regex: /^#!.*$/
            }
        ],
        property: [{
                token : "text",
                regex : "\\s+"
            }, {
                token : [
                    "storage.type", "punctuation.operator", "entity.name.function", "text",
                    "keyword.operator", "text",
                    "storage.type", "text", "entity.name.function", "text", "paren.lparen"
                ],
                regex : "(" + identifierRe + ")(\\.)(" + identifierRe +")(\\s*)(=)(\\s*)(function)(?:(\\s+)(\\w+))?(\\s*)(\\()",
                next: "function_arguments"
            }, {
                token : "punctuation.operator",
                regex : /[.](?![.])/
            }, {
                token : "support.function", //TODO: add here Webgl/glMatrix functions accessible only with dot notation
                regex : /down(?:loadMeshes|loadTextures)|init(?:MeshBuffers|TextureBuffer)|get(?:ContextAttributes|SupportedExtensions|Extension|Active(?:Attrib|Uniform)|AttachedShaders|AttribLocation|BufferParameter|Parameter|Error|FramebufferAttachmentParameter|Program(?:Parameter|InfoLog)|RenderbufferParameter|Shader(?:Parameter|PrecisionFormat|InfoLog|Source)|TexParameter|Uniform|UniformLocation|Vertex(?:Attrib|AttribOffset)|Rotation|Scaling|Translation|AxisAngle)|activeTexture|attachShader|bind(?:AttribLocation|Buffer|Framebuffer|Renderbuffer|Texture)|blend(?:Color|Equation|EquationSeparate|Func|FuncSeparate)|buffer(?:Data|SubData)|checkFramebufferStatus|clear|clear(?:Color|Depth|Stencil)|colorMask|compileShader|compressed(?:TexImage2D|TexSubImage2D)|copy(?:TexImage2D|TexSubImage2D)|create(?:Buffer|Framebuffer|Program|Renderbuffer|Shader|Texture)|cullFace|delete(?:deleteMeshBuffers|deleteTextureBuffer|Buffer|Framebuffer|Program|Renderbuffer|Shader|Texture)|depth(?:Func|Mask|Range)|detachShader|disable|disableVertexAttribArray|draw(?:Arrays|Elements)|enable|enableVertexAttribArray|finish|flush|frame(?:bufferRenderbuffer|bufferTexture2D)|frontFace|generateMipmap|hint|is(?:Buffer|Enabled|Framebuffer|Program|Renderbuffer|Shader|Texture)|lineWidth|linkProgram|pixelStorei|polygonOffset|readPixels|renderbufferStorage|sampleCoverage|scissor|shaderSource|stencil(?:Func|FuncSeparate|Mask|MaskSeparate|Op|OpSeparate)|tex(?:Image2D|Parameterf|Parameteri|SubImage2D)|uniform(?:1fv|2fv|3fv|4fv|1iv|2iv|3iv|4iv|Matrix(?:2fv|3fv|4fv)|1f|2f|3f|4f|1i|2i|3i|4i)|useProgram|validateProgram|vertex(?:Attrib1f|Attrib(?:2f|3f|4f|1fv|2fv|3fv|4fv|Pointer))|viewport|setMatrixArrayType|toRadian|equals|add|adjoint|clone|copy|create|determinant|exactEquals|frob|from(?:Rotation(?:Translation(?:ScaleOrigin|Scale))|Euler|Mat3|Rotation|XRotation|YRotation|ZRotation|Scaling|Values|Translation|Quat|Mat(?:2d|4))|identity|invert|LDU|multiply|multiply(?:Scalar|ScalarAndAdd)|mul|rotate|scale|set|str|subtract|sub|transpose|normalFromMat4|projection|translate|frustum|lookAt|ortho|perspective|perspectiveFromFieldOfView|rotate(?:X|Y|Z)|targetTo|length|rotationTo|setAxes|sqlerp|calculateW|conjugate|dot|len|lerp|normalize|setAxisAngle|slerp|sqrLen|squaredLength|ceil|cross|dist|distance|div|divide|floor|forEach|max|min|negate|random|round|scaleAndAdd|sqrDist|squaredDistance|transformMat2|transform(?:Mat(?:2d|3|4)|Quat)|angle|bezier|hermite|inverse|Location|VertexAttribArray|isContextLost|(s(?:h(?:ift|ow(?:Mod(?:elessDialog|alDialog)|Help))|croll(?:X|By(?:Pages|Lines)?|Y|To)?|t(?:op|rike)|i(?:n|zeToContent|debar|gnText)|ort|u(?:p|b(?:str(?:ing)?)?)|pli(?:ce|t)|e(?:nd|t(?:Re(?:sizable|questHeader)|M(?:i(?:nutes|lliseconds)|onth)|Seconds|Ho(?:tKeys|urs)|Year|Cursor|Time(?:out)?|Interval|ZOptions|Date|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(?:ome|andleEvent)|navigate|c(?:har(?:CodeAt|At)|o(?:s|n(?:cat|textual|firm)|mpile)|eil|lear(?:Timeout|Interval)?|a(?:ptureEvents|ll)|reate(?:StyleSheet|Popup|EventObject))|t(?:o(?:GMTString|S(?:tring|ource)|U(?:TCString|pperCase)|Lo(?:caleString|werCase))|est|a(?:n|int(?:Enabled)?))|i(?:s(?:NaN|Finite)|ndexOf|talics)|d(?:isableExternalCapture|ump|etachEvent)|u(?:n(?:shift|taint|escape|watch)|pdateCommands)|j(?:oin|avaEnabled)|p(?:o(?:p|w)|ush|lugins.refresh|a(?:ddings|rse(?:Int|Float)?)|r(?:int|ompt|eference))|e(?:scape|nableExternalCapture|val|lementFromPoint|x(?:p|ec(?:Script|Command)?))|valueOf|UTC|queryCommand(?:State|Indeterm|Enabled|Value)|f(?:i(?:nd|le(?:ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(?:nt(?:size|color)|rward)|loor|romCharCode)|watch|l(?:ink|o(?:ad|g)|astIndexOf)|a(?:sin|nchor|cos|t(?:tachEvent|ob|an(?:2)?)|pply|lert|b(?:s|ort))|r(?:ou(?:nd|teEvents)|e(?:size(?:By|To)|calc|turnValue|place|verse|l(?:oad|ease(?:Capture|Events)))|andom)|g(?:o|et(?:ResponseHeader|M(?:i(?:nutes|lliseconds)|onth)|Se(?:conds|lection)|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear|A(?:ttention|llResponseHeaders)))|m(?:in|ove(?:B(?:y|elow)|To(?:Absolute)?|Above)|ergeAttributes|a(?:tch|rgins|x))|b(?:toa|ig|o(?:ld|rderWidths)|link|ack))\b(?=\()/
            }, {
                token : "support.function.dom",
                regex : /(s(?:ub(?:stringData|mit)|plitText|e(?:t(?:NamedItem|Attribute(?:Node)?)|lect))|has(?:ChildNodes|Feature)|namedItem|c(?:l(?:ick|o(?:se|neNode))|reate(?:C(?:omment|DATASection|aption)|T(?:Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(?:ntityReference|lement)|Attribute))|tabIndex|i(?:nsert(?:Row|Before|Cell|Data)|tem)|open|delete(?:Row|C(?:ell|aption)|T(?:Head|Foot)|Data)|focus|write(?:ln)?|a(?:dd|ppend(?:Child|Data))|re(?:set|place(?:Child|Data)|move(?:NamedItem|Child|Attribute(?:Node)?)?)|get(?:NamedItem|Element(?:sBy(?:Name|TagName|ClassName)|ById)|Attribute(?:Node)?)|blur)\b(?=\()/
            }, {
                token :  "support.constant",
                regex : /xRot|yRot|xTrans|yTrans|zTrans|velocity|deltaXRot|deltaYRot|deltaXTrans|deltaYTrans|deltaZTrans|interactionType|objectScale|(s(?:ystemLanguage|cr(?:ipts|ollbars|een(?:X|Y|Top|Left))|t(?:yle(?:Sheets)?|atus(?:Text|bar)?)|ibling(?:Below|Above)|ource|uffixes|e(?:curity(?:Policy)?|l(?:ection|f)))|h(?:istory|ost(?:name)?|as(?:h|Focus))|y|X(?:MLDocument|SLDocument)|M(?:IN_VALUE|AX_VALUE)|c(?:haracterSet|o(?:n(?:structor|trollers)|okieEnabled|lorDepth|mp(?:onents|lete))|urrent|puClass|l(?:i(?:p(?:boardData)?|entInformation)|osed|asses)|alle(?:e|r)|rypto)|t(?:o(?:olbar|p)|ext(?:Transform|Indent|Decoration|Align)|ags)|SQRT(?:1_2|2)|i(?:n(?:ner(?:Height|Width)|put)|ds|gnoreCase)|zIndex|o(?:scpu|n(?:readystatechange|Line)|uter(?:Height|Width)|p(?:sProfile|ener)|ffscreenBuffering)|NEGATIVE_INFINITY|d(?:i(?:splay|alog(?:Height|Top|Width|Left|Arguments)|rectories)|e(?:scription|fault(?:Status|Ch(?:ecked|arset)|View)))|u(?:ser(?:Profile|Language|Agent)|n(?:iqueID|defined)|pdateInterval)|_content|p(?:ixelDepth|ort|ersonalbar|kcs11|l(?:ugins|atform)|a(?:thname|dding(?:Right|Bottom|Top|Left)|rent(?:Window|Layer)?|ge(?:X(?:Offset)?|Y(?:Offset)?))|r(?:o(?:to(?:col|type)|duct(?:Sub)?|mpter)|e(?:vious|fix)))|e(?:n(?:coding|abledPlugin)|x(?:ternal|pando)|mbeds)|v(?:isibility|endor(?:Sub)?|Linkcolor)|URLUnencoded|P(?:I|OSITIVE_INFINITY)|f(?:ilename|o(?:nt(?:Size|Family|Weight)|rmName)|rame(?:s|Element)|gColor)|whiteSpace|l(?:i(?:stStyleType|n(?:eHeight|kColor))|o(?:ca(?:tion(?:bar)?|lName)|wsrc)|e(?:ngth|ft(?:Context)?)|a(?:st(?:M(?:odified|atch)|Index|Paren)|yer(?:s|X)|nguage))|a(?:pp(?:MinorVersion|Name|Co(?:deName|re)|Version)|vail(?:Height|Top|Width|Left)|ll|r(?:ity|guments)|Linkcolor|bove)|r(?:ight(?:Context)?|e(?:sponse(?:XML|Text)|adyState))|global|x|m(?:imeTypes|ultiline|enubar|argin(?:Right|Bottom|Top|Left))|L(?:N(?:10|2)|OG(?:10E|2E))|b(?:o(?:ttom|rder(?:Width|RightWidth|BottomWidth|Style|Color|TopWidth|LeftWidth))|ufferDepth|elow|ackground(?:Color|Image)))|(?:(DEPTH_|STENCIL_|COLOR_)?BUFFER_BIT)|DEPTH_(?:COMPONENT16|COMPONENT|STENCIL|ATTACHMENT|STENCIL_ATTACHMENT|TEST|RANGE|WRITEMASK|CLEAR_VALUE|FUNC)|POINTS|LINES|LINE_(?:LOOP|STRIP)|TRIANGLES|TRIANGLE_(?:STRIP|FAN)|NEVER|LE(?:SS|QUAL)|EQUAL|GREATER|NOTEQUAL|GEQUAL|ALWAYS|ZERO|ONE|SRC_(?:COLOR|ALPHA)|ONE_MINUS_(?:SRC_COLOR|SRC_ALPHA|DST_ALPHA|DST_COLOR|CONSTANT_COLOR|CONSTANT_ALPHA)|DST_ALPHA|DST_COLOR|SRC_ALPHA_SATURATE|FUNC_ADD|BLEND_(?:COLOR|EQUATION|EQUATION_RGB|EQUATION_ALPHA|DST_RGB|SRC_RGB|DST_ALPHA|SRC_ALPHA)|FUNC_(?:SUBTRACT|REVERSE_SUBTRACT)|CONSTANT_COLOR|CONSTANT_ALPHA|ARRAY_(?:BUFFER|BUFFER_BINDING)|ELEMENT_(?:ARRAY_BUFFER_BINDING|ARRAY_BUFFER)|STREAM_DRAW|STATIC_DRAW|DYNAMIC_DRAW|BUFFER_(?:SIZE|USAGE)|CURRENT_VERTEX_ATTRIB|FRONT|BACK|FRONT_AND_BACK|CULL_FACE|BLEND|DITHER|STENCIL_TEST|SCISSOR_TEST|POLYGON_OFFSET_FILL|SAMPLE_ALPHA_TO_COVERAGE|SAMPLE_COVERAGE|NO_ERROR|INVALID_(?:ENUM|VALUE|OPERATION)|OUT_OF_MEMORY|C(?:W|CW)|LINE_WIDTH|ALIASED_POINT_SIZE_RANGE|ALIASED_LINE_WIDTH_RANGE|CULL_FACE_MODE|FRONT_FACE|STENCIL_CLEAR_VALUE|STENCIL_FUNC|STENCIL_FAIL|STENCIL_PASS_DEPTH_(?:FAIL|PASS)|STENCIL_(?:REF|VALUE_MASK|WRITEMASK|BACK_(?:FUNC|FAIL)|BACK_(?:PASS_(?:DEPTH_FAIL|DEPTH_PASS)|REF|VALUE_MASK|WRITEMASK))|VIEWPORT|SCISSOR_BOX|COLOR_(?:CLEAR_VALUE|WRITEMASK)|UNPACK_ALIGNMENT|PACK_ALIGNMENT|MAX_(?:TEXTURE_SIZE|VIEWPORT_DIMS)|SUBPIXEL_BITS|(?:(RED_|GREEN_|BLUE_|ALPHA_|DEPTH_|STENCIL_)?BITS)BITS|POLYGON_OFFSET_(?:UNITS|FACTOR)|TEXTURE_BINDING_2D|SAMPLES|SAMPLE_(?:BUFFERS|COVERAGE_(?:VALUE|INVERT))|COMPRESSED_TEXTURE_FORMATS|DONT_CARE|FASTEST|NICEST|GENERATE_MIPMAP_HINT|BYTE|UNSIGNED_(?:BYTE|INT|(SHORT(?:_4_4_4_4|_5_5_5_1|_5_6_5))?)|SHORT|INT|FLOAT|ALPHA|RGB|RGBA|LUMINANCE|LUMINANCE_ALPHA|(?:(FRAGMENT_|VERTEX_)?SHADER)|MAX_(?:VERTEX_(?:ATTRIBS|UNIFORM_VECTORS|TEXTURE_IMAGE_UNITS)|VARYING_VECTORS|COMBINED_TEXTURE_IMAGE_UNITS|TEXTURE_IMAGE_UNITS|FRAGMENT_UNIFORM_VECTORS)|SHADER_TYPE|(?:(DELETE_|LINK_|VALIDATE)?_STATUS)|ATTACHED_SHADERS|ACTIVE_(?:UNIFORMS|ATTRIBUTES)|SHADING_LANGUAGE_VERSION|CURRENT_PROGRAM|KEEP|REPLACE|INCR|DECR|INVERT|INCR_WRAP|DECR_WRAP|VENDOR|RENDERER|VERSION|(?:(NEAREST_|LINEAR_)?(?:MIPMAP_NEAREST|MIPMAP_LINEAR))|NEAREST|LINEAR|TEXTURE(?:_MAG_FILTER|_MIN_FILTER|_WRAP(?:_S|_T)|_2D|_BINDING_CUBE_MAP|_CUBE_MAP_(?:POSITIVE_X|NEGATIVE_X|POSITIVE_Y|NEGATIVE_Y|POSITIVE_Z|NEGATIVE_Z)|_CUBE_MAP|0|1|2|3|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31)|TEXTURE|MAX_CUBE_MAP_TEXTURE_SIZE|ACTIVE_TEXTURE|REPEAT|CLAMP_TO_EDGE|MIRRORED_REPEAT|FLOAT_(?:VEC2|VEC3|VEC4)|INT_(?:VEC2|VEC3|VEC4)|BOOL_(?:VEC2|VEC3|VEC4)|BOOL|FLOAT_(?:MAT2|MAT3|MAT4)|SAMPLER_(?:2D|CUBE)|VERTEX_ATTRIB_ARRAY_(?:ENABLED|SIZE|STRIDE|TYPE|NORMALIZED|POINTER|BUFFER_BINDING)|IMPLEMENTATION_COLOR_READ_(?:TYPE|FORMAT)|COMPILE_STATUS|(?:(LOW_|MEDIUM_|HIGH_)?(?:FLOAT|INT))|RGB(?:A4|5_A1|565)|RENDERBUFFER_(?:BINDING|WIDTH|HEIGHT|INTERNAL_FORMAT|RED_SIZE|GREEN_SIZE|BLUE_SIZE|ALPHA_SIZE|DEPTH_SIZE|STENCIL_SIZE)|FRAMEBUFFER_(?:COMPLETE|INCOMPLETE_(?:ATTACHMENT|MISSING_ATTACHMENT|DIMENSIONS)|UNSUPPORTED|BINDING|ATTACHMENT_(?:OBJECT_TYPE|OBJECT_NAME|TEXTURE_LEVEL|TEXTURE_CUBE_MAP_FACE))|COLOR_ATTACHMENT0|STENCIL_(?:ATTACHMENT|INDEX8)|NONE|MAX_RENDERBUFFER_SIZE|INVALID_FRAMEBUFFER_OPERATION|(?:(FRAME|RENDER)?BUFFER)|UNPACK_(?:FLIP_Y_WEBGL|PREMULTIPLY_ALPHA_WEBGL|COLORSPACE_CONVERSION_WEBGL)|CONTEXT_LOST_WEBGL|BROWSER_DEFAULT_WEBGL|canvas|drawingBufferWidth|drawingBufferHeight|n(?:ext|ame(?:space(?:s|URI)|Prop))\b/
            }, {
                token : "identifier",
                regex : identifierRe
            }, {
                regex: "",
                token: "empty",
                next: "no_regex"
            }
        ],
        "start": [
            DocCommentHighlightRules.getStartRule("doc-start"),
            comments("start"),
            {
                token: "string.regexp",
                regex: "\\/",
                next: "regex"
            }, {
                token : "text",
                regex : "\\s+|^$",
                next : "start"
            }, {
                token: "empty",
                regex: "",
                next: "no_regex"
            }
        ],
        "regex": [
            {
                token: "regexp.keyword.operator",
                regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
            }, {
                token: "string.regexp",
                regex: "/[sxngimy]*",
                next: "no_regex"
            }, {
                token : "invalid",
                regex: /\{\d+\b,?\d*\}[+*]|[+*$^?][+*]|[$^][?]|\?{3,}/
            }, {
                token : "constant.language.escape",
                regex: /\(\?[:=!]|\)|\{\d+\b,?\d*\}|[+*]\?|[()$^+*?.]/
            }, {
                token : "constant.language.delimiter",
                regex: /\|/
            }, {
                token: "constant.language.escape",
                regex: /\[\^?/,
                next: "regex_character_class"
            }, {
                token: "empty",
                regex: "$",
                next: "no_regex"
            }, {
                defaultToken: "string.regexp"
            }
        ],
        "regex_character_class": [
            {
                token: "regexp.charclass.keyword.operator",
                regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
            }, {
                token: "constant.language.escape",
                regex: "]",
                next: "regex"
            }, {
                token: "constant.language.escape",
                regex: "-"
            }, {
                token: "empty",
                regex: "$",
                next: "no_regex"
            }, {
                defaultToken: "string.regexp.charachterclass"
            }
        ],
        "function_arguments": [
            {
                token: "variable.parameter",
                regex: identifierRe
            }, {
                token: "punctuation.operator",
                regex: "[, ]+"
            }, {
                token: "punctuation.operator",
                regex: "$"
            }, {
                token: "empty",
                regex: "",
                next: "no_regex"
            }
        ],
        "qqstring" : [
            {
                token : "constant.language.escape",
                regex : escapedRe
            }, {
                token : "string",
                regex : "\\\\$",
                next  : "qqstring"
            }, {
                token : "string",
                regex : '"|$',
                next  : "no_regex"
            }, {
                defaultToken: "string"
            }
        ],
        "qstring" : [
            {
                token : "constant.language.escape",
                regex : escapedRe
            }, {
                token : "string",
                regex : "\\\\$",
                next  : "qstring"
            }, {
                token : "string",
                regex : "'|$",
                next  : "no_regex"
            }, {
                defaultToken: "string"
            }
        ]
    };
    
    
    if (!options || !options.noES6) {
        this.$rules.no_regex.unshift({
            regex: "[{}]", onMatch: function(val, state, stack) {
                this.next = val == "{" ? this.nextState : "";
                if (val == "{" && stack.length) {
                    stack.unshift("start", state);
                }
                else if (val == "}" && stack.length) {
                    stack.shift();
                    this.next = stack.shift();
                    if (this.next.indexOf("string") != -1 || this.next.indexOf("jsx") != -1)
                        return "paren.quasi.end";
                }
                return val == "{" ? "paren.lparen" : "paren.rparen";
            },
            nextState: "start"
        }, {
            token : "string.quasi.start",
            regex : /`/,
            push  : [{
                token : "constant.language.escape",
                regex : escapedRe
            }, {
                token : "paren.quasi.start",
                regex : /\${/,
                push  : "start"
            }, {
                token : "string.quasi.end",
                regex : /`/,
                next  : "pop"
            }, {
                defaultToken: "string.quasi"
            }]
        });
        
        if (!options || options.jsx != false)
            JSX.call(this);
    }
    
    this.embedRules(DocCommentHighlightRules, "doc-",
        [ DocCommentHighlightRules.getEndRule("no_regex") ]);
    
    this.normalizeRules();
};

oop.inherits(JavaScriptHighlightRules, TextHighlightRules);

function JSX() {
    var tagRegex = identifierRe.replace("\\d", "\\d\\-");
    var jsxTag = {
        onMatch : function(val, state, stack) {
            var offset = val.charAt(1) == "/" ? 2 : 1;
            if (offset == 1) {
                if (state != this.nextState)
                    stack.unshift(this.next, this.nextState, 0);
                else
                    stack.unshift(this.next);
                stack[2]++;
            } else if (offset == 2) {
                if (state == this.nextState) {
                    stack[1]--;
                    if (!stack[1] || stack[1] < 0) {
                        stack.shift();
                        stack.shift();
                    }
                }
            }
            return [{
                type: "meta.tag.punctuation." + (offset == 1 ? "" : "end-") + "tag-open.xml",
                value: val.slice(0, offset)
            }, {
                type: "meta.tag.tag-name.xml",
                value: val.substr(offset)
            }];
        },
        regex : "</?" + tagRegex + "",
        next: "jsxAttributes",
        nextState: "jsx"
    };
    this.$rules.start.unshift(jsxTag);
    var jsxJsRule = {
        regex: "{",
        token: "paren.quasi.start",
        push: "start"
    };
    this.$rules.jsx = [
        jsxJsRule,
        jsxTag,
        {include : "reference"},
        {defaultToken: "string"}
    ];
    this.$rules.jsxAttributes = [{
        token : "meta.tag.punctuation.tag-close.xml", 
        regex : "/?>", 
        onMatch : function(value, currentState, stack) {
            if (currentState == stack[0])
                stack.shift();
            if (value.length == 2) {
                if (stack[0] == this.nextState)
                    stack[1]--;
                if (!stack[1] || stack[1] < 0) {
                    stack.splice(0, 2);
                }
            }
            this.next = stack[0] || "start";
            return [{type: this.token, value: value}];
        },
        nextState: "jsx"
    }, 
    jsxJsRule,
    comments("jsxAttributes"),
    {
        token : "entity.other.attribute-name.xml",
        regex : tagRegex
    }, {
        token : "keyword.operator.attribute-equals.xml",
        regex : "="
    }, {
        token : "text.tag-whitespace.xml",
        regex : "\\s+"
    }, {
        token : "string.attribute-value.xml",
        regex : "'",
        stateName : "jsx_attr_q",
        push : [
            {token : "string.attribute-value.xml", regex: "'", next: "pop"},
            {include : "reference"},
            {defaultToken : "string.attribute-value.xml"}
        ]
    }, {
        token : "string.attribute-value.xml",
        regex : '"',
        stateName : "jsx_attr_qq",
        push : [
            {token : "string.attribute-value.xml", regex: '"', next: "pop"},
            {include : "reference"},
            {defaultToken : "string.attribute-value.xml"}
        ]
    },
    jsxTag
    ];
    this.$rules.reference = [{
        token : "constant.language.escape.reference.xml",
        regex : "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"
    }];
}

function comments(next) {
    return [
        {
            token : "comment", // multi line comment
            regex : /\/\*/,
            next: [
                DocCommentHighlightRules.getTagRule(),
                {token : "comment", regex : "\\*\\/", next : next || "pop"},
                {defaultToken : "comment", caseInsensitive: true}
            ]
        }, {
            token : "comment",
            regex : "\\/\\/",
            next: [
                DocCommentHighlightRules.getTagRule(),
                {token : "comment", regex : "$|^", next : next || "pop"},
                {defaultToken : "comment", caseInsensitive: true}
            ]
        }
    ];
}
exports.JavaScriptHighlightRules = JavaScriptHighlightRules;
});

ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;

var MatchingBraceOutdent = function() {};

(function() {

    this.checkOutdent = function(line, input) {
        if (! /^\s+$/.test(line))
            return false;

        return /^\s*\}/.test(input);
    };

    this.autoOutdent = function(doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*\})/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({row: row, column: column});

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column-1), indent);
    };

    this.$getIndent = function(line) {
        return line.match(/^\s*/)[0];
    };

}).call(MatchingBraceOutdent.prototype);

exports.MatchingBraceOutdent = MatchingBraceOutdent;
});

ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;

var FoldMode = exports.FoldMode = function(commentRegex) {
    if (commentRegex) {
        this.foldingStartMarker = new RegExp(
            this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
        );
        this.foldingStopMarker = new RegExp(
            this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
        );
    }
};
oop.inherits(FoldMode, BaseFoldMode);

(function() {
    
    this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/;
    this.singleLineBlockCommentRe= /^\s*(\/\*).*\*\/\s*$/;
    this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
    this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
    this._getFoldWidgetBase = this.getFoldWidget;
    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
    
        if (this.singleLineBlockCommentRe.test(line)) {
            if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
                return "";
        }
    
        var fw = this._getFoldWidgetBase(session, foldStyle, row);
    
        if (!fw && this.startRegionRe.test(line))
            return "start"; // lineCommentRegionStart
    
        return fw;
    };

    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);
        
        if (this.startRegionRe.test(line))
            return this.getCommentRegionBlock(session, line, row);
        
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;

            if (match[1])
                return this.openingBracketBlock(session, match[1], row, i);
                
            var range = session.getCommentFoldRange(row, i + match[0].length, 1);
            
            if (range && !range.isMultiLine()) {
                if (forceMultiline) {
                    range = this.getSectionRange(session, row);
                } else if (foldStyle != "all")
                    range = null;
            }
            
            return range;
        }

        if (foldStyle === "markbegin")
            return;

        var match = line.match(this.foldingStopMarker);
        if (match) {
            var i = match.index + match[0].length;

            if (match[1])
                return this.closingBracketBlock(session, match[1], row, i);

            return session.getCommentFoldRange(row, i, -1);
        }
    };
    
    this.getSectionRange = function(session, row) {
        var line = session.getLine(row);
        var startIndent = line.search(/\S/);
        var startRow = row;
        var startColumn = line.length;
        row = row + 1;
        var endRow = row;
        var maxRow = session.getLength();
        while (++row < maxRow) {
            line = session.getLine(row);
            var indent = line.search(/\S/);
            if (indent === -1)
                continue;
            if  (startIndent > indent)
                break;
            var subRange = this.getFoldWidgetRange(session, "all", row);
            
            if (subRange) {
                if (subRange.start.row <= startRow) {
                    break;
                } else if (subRange.isMultiLine()) {
                    row = subRange.end.row;
                } else if (startIndent == indent) {
                    break;
                }
            }
            endRow = row;
        }
        
        return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
    };
    this.getCommentRegionBlock = function(session, line, row) {
        var startColumn = line.search(/\s*$/);
        var maxRow = session.getLength();
        var startRow = row;
        
        var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
        var depth = 1;
        while (++row < maxRow) {
            line = session.getLine(row);
            var m = re.exec(line);
            if (!m) continue;
            if (m[1]) depth--;
            else depth++;

            if (!depth) break;
        }

        var endRow = row;
        if (endRow > startRow) {
            return new Range(startRow, startColumn, endRow, line.length);
        }
    };

}).call(FoldMode.prototype);

});

ace.define("ace/mode/javascript",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/javascript_highlight_rules","ace/mode/matching_brace_outdent","ace/worker/worker_client","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var JavaScriptHighlightRules = require("./javascript_highlight_rules").JavaScriptHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var WorkerClient = require("../worker/worker_client").WorkerClient;
var CstyleBehaviour = require("./behaviour/cstyle").CstyleBehaviour;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = JavaScriptHighlightRules;
    
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new CstyleBehaviour();
    this.foldingRules = new CStyleFoldMode();
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "//";
    this.blockComment = {start: "/*", end: "*/"};

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        if (state == "start" || state == "no_regex") {
            var match = line.match(/^.*(?:\bcase\b.*:|[\{\(\[])\s*$/);
            if (match) {
                indent += tab;
            }
        } else if (state == "doc-start") {
            if (endState == "start" || endState == "no_regex") {
                return "";
            }
            var match = line.match(/^\s*(\/?)\*/);
            if (match) {
                if (match[1]) {
                    indent += " ";
                }
                indent += "* ";
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

    this.createWorker = function(session) {
        var worker = new WorkerClient(["ace"], "ace/mode/javascript_worker", "JavaScriptWorker");
        worker.attachToDocument(session.getDocument());

        worker.on("annotate", function(results) {
            session.setAnnotations(results.data);
        });

        worker.on("terminate", function() {
            session.clearAnnotations();
        });

        return worker;
    };

    this.$id = "ace/mode/javascript";
}).call(Mode.prototype);

exports.Mode = Mode;
});
