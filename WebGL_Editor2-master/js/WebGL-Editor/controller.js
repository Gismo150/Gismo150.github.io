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




// A simple controller which uses an HTML element as the event
// source for constructing useful variables like amount of rotation, translation for each Axis.
// Controller tested in Chrome, Firefox and Safari each on desktop-PC and touch devices.
// Supports Mouse-, Keyboard- and Touch-Input.
//
//
// Assign an "onchange" function to the controller as follows to receive the
// updated event values:
//
//   var controller = new CameraController(canvas);
//   controller.onchange = function() { ... };
//
// The view/model matrix is computed elsewhere and can make use of the controller variables.
//
// opt_canvas (an HTMLCanvasElement) can be passed in to make the hit detection

/**
 * @description
 * The main controller Object.
 * <pre>
 *     Left-Mousebutton and drag    : Rotation
 *     Right-Mousebutton and drag   : Translation
 *     Mousewheel                   : Zoom/Object scaling
 *     Touch and drag               : Rotation
 *     Double-Tap and drag          : Translation
 *     Two-finger pinch             : Zoom/Object scaling
 *     </pre>
 *
 * @param {HTMLCanvasElement} element The HTML5 < canvas >-Element
 * @constructor
 */
function Controller(element) {
    var controller = this;
    this.onchange = null;
    /**
     * @description The overall amount of x-Rotation of all interactions.
     * @type {Number}
     *
     */
    this.xRot = 0;
    /**
     * @description The overall amount of y-Rotation of all interactions.
     * @type {Number}
     *
     */
    this.yRot = 0;
    this.curX = 0;
    this.curY = 0;
    /**
     * @description The overall amount of x-Translation of all interactions.
     * @type {Number}
     *
     */
    this.xTrans = 0;
    /**
     * @description The overall amount of y-Translation of all interactions.
     * @type {Number}
     *
     */
    this.yTrans = 0;
    /**
     * @description The overall amount of z-Translation of all interactions.
     * @type {Number}
     *
     */
    this.zTrans = 0;
    /**
     * @description Sets the sensitivity of interactions. Typical values are 1/x, where x is a number.
     * @type {Number}
     *
     */
    this.velocity = 1 / 100;
    /**
     * @description The delta x-Rotation of the current interaction.
     * @type {Number}
     *
     */
    this.deltaXRot = 0.0;
    /**
     * @description The delta y-Rotation of the current interaction.
     * @type {Number}
     *
     */
    this.deltaYRot = 0.0;
    /**
     * @description The delta x-Translation of the current interaction.
     * @type {Number}
     *
     */
    this.deltaXTrans = 0.0;
    /**
     * @description The delta y-Translation of the current interaction.
     * @type {Number}
     *
     */
    this.deltaYTrans = 0.0;
    /**
     * @description The delta z-Translation of the current interaction.
     * @type {Number}
     *
     */
    this.deltaZTrans = 0.0;
    /**
     * @description The scaling of the object.
     * @type {Number}
     *
     */
    this.objectScale = 1;

    var dragging = false;
    var _clickType = undefined;

    var count = 2;
    var underZero = false;

    var translationEnabled = false;
    var touching = false;

    /*-------------------Mouse&Keyboard-Support-----------------------*/

    //used for cross-browser compatibility
    function handleMouseEvent(e) {
        var evt = (e === null ? event : e);
        _clickType = 'LEFT';
        if (evt.type !== 'mousedown') return true;
        if (evt.which) {
            if (evt.which === 3) _clickType = 'RIGHT';
            if (evt.which === 2) _clickType = 'MIDDLE';
        }
        else if (evt.button) {
            if (evt.button === 2) _clickType = 'RIGHT';
            if (evt.button === 4) _clickType = 'MIDDLE';
        }
        return true;
    }

    // Send the onchange event to any listener.
    function updateChanges() {
        if (controller.onchange !== null) {
            controller.onchange();
        }
    }


    $('#gl-canvas').mousedown(function (ev) {
        //  writeSystemMessage(ev.which);
        handleMouseEvent(ev);
        ev.preventDefault();
        controller.curX = ev.clientX;
        controller.curY = ev.clientY;
        controller.deltaZTrans = 0.0;
        dragging = true;
        //Set focus on canvas in order to detect keydown press
        document.getElementById("gl-canvas").focus();


    });

    $('#gl-canvas').mouseup(function (ev) {
        ev.preventDefault();
        dragging = false;
        controller.deltaXRot = 0.0;
        controller.deltaYRot = 0.0;
        controller.deltaXTrans = 0.0;
        controller.deltaYTrans = 0.0;
        controller.deltaZTrans = 0.0;
        _clickType = undefined;
    });


    $('#gl-canvas').mousemove(function (ev) {
        ev.preventDefault();
        if (_clickType === undefined) {
            return;
        }

        if (dragging) {
            if (_clickType === "LEFT") {
                var curX = ev.clientX;
                var curY = ev.clientY;//prev---------current
                controller.deltaXRot = (controller.curX - curX) * controller.velocity;
                controller.deltaYRot = (controller.curY - curY) * controller.velocity;
                controller.curX = curX;
                controller.curY = curY;
                // Update the X and Y rotation angles based on the mouse motion.
                controller.yRot = (controller.yRot + controller.deltaXRot);
                controller.xRot = (controller.xRot + controller.deltaYRot);
            } else if (_clickType === "RIGHT") {
                // Update the X and Y translation based on the mouse motion.
                var curX = ev.clientX;
                var curY = ev.clientY;//prev---------current
                controller.deltaXTrans = (controller.curX - curX) * controller.velocity;
                controller.deltaYTrans = (controller.curY - curY) * controller.velocity;
                controller.curX = curX;
                controller.curY = curY;
                controller.yTrans = (controller.yTrans + controller.deltaYTrans);
                controller.xTrans = (controller.xTrans + controller.deltaXTrans);
            }
        }
        // Send the onchange event to any listener.
        updateChanges();
    });

    $('#gl-canvas').mouseleave(function (ev) {
        $('#gl-canvas').trigger("mouseup");
    });

    function mouseWheel(ev) {
        var ev = window.event || ev;
        ev.preventDefault();
        //NORMALIZE the wheel event deltaY for cross-browser purposes
        controller.deltaZTrans = (ev.deltaY > 0) ? controller.velocity : -controller.velocity;
        var x = (ev.deltaY > 0) ? 1 : -1;
        modelScaling(x);
        controller.zTrans -= (controller.deltaZTrans);
        updateChanges();
        controller.deltaZTrans = 0;
    }


    function modelScaling(scale) {
        if ((controller.objectScale - scale) === 0 && (scale) === 1) { //1 skipping 0 when scaling down from > 1
            controller.objectScale = 1 / 2;
            underZero = true;
        }
        else if (controller.objectScale === 0.5 && (scale) === -1) { //2 skipping 0 when scaling up from < 1
            controller.objectScale = 1;
            underZero = false;
        }
        else if (underZero && (scale) === 1) { //3
            controller.objectScale = (1 / (count + (scale)));
            count++;
        } else if (underZero && (scale) === -1) { //4
            controller.objectScale = (1 / (count + (scale)));
            count--;
        }
        else if (!underZero && (controller.objectScale - scale) >= 1 && (scale) === 1) { //5
            controller.objectScale -= scale;
        }
        else if (!underZero && (controller.objectScale - scale) > 1 && (scale) === -1) { //6
            controller.objectScale -= scale;
        }
        updateChanges();
    }

    function keyDownHandler(ev) {
        var ev = window.event || ev;
        ev.preventDefault();
        switch (ev.keyCode) {
            case 173:                    //FIREFOX -
            case 109:                   //- (NUMPAD)
            case 189:                   //- sign
            case 98:                    //numpad 7
                controller.zTrans -= controller.velocity;
                //writeLog("zTrans"+controller.zTrans);
                controller.deltaZTrans = controller.velocity;
                modelScaling(1);
                updateChanges();
                break;
            case 171:                     //FIREFOX +
            case 107:                   //+ (NUMPAD)
            case 187:                   //+ sign
            case 104:                   //numpad 8
                controller.zTrans += controller.velocity;
                // writeLog("zTrans"+controller.zTrans);
                controller.deltaZTrans = -controller.velocity;
                modelScaling(-1);
                updateChanges();
                break;
            case 39://Right Arrow
                controller.xTrans -= controller.velocity;
                controller.deltaXTrans = -3 * controller.velocity;
                updateChanges();
                break;
            case 40://Down Arrow
                controller.yTrans -= controller.velocity;
                controller.deltaYTrans = -3 * controller.velocity;
                updateChanges();
                break;
            case 37://Left Arrow
                controller.xTrans += controller.velocity;
                controller.deltaXTrans = +3 * controller.velocity;
                updateChanges();
                break;
            case 38://Up Arrow
                controller.yTrans += controller.velocity;
                controller.deltaYTrans = +3 * controller.velocity;
                updateChanges();
                break;
        }

    }

    function keyUpHandler(ev) {
        controller.deltaYTrans = 0;
        controller.deltaXTrans = 0;
        controller.deltaZTrans = 0;
    }

    element.addEventListener('keydown', keyDownHandler, false);
    element.addEventListener('keyup', keyUpHandler, false);
    element.addEventListener('wheel', mouseWheel, false);
    element.addEventListener('touchend', onTouchEnd, false);
    element.addEventListener('touchstart', onTouchStart, false);

    /*-------------------Touch-Support-----------------------*/
    var mc = new Hammer.Manager(element);

    mc.add(new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 0}));
    mc.add(new Hammer.Tap({}));
    mc.add(new Hammer.Pinch({threshold: 0}));

    mc.on('panstart', onPanStart);
    mc.on('panmove', onPanMove);
    mc.on('panend', onPanEnd);
    mc.on('pinchstart', onPinchStart);
    mc.on('pinchmove', onPinchMove);
    mc.on('pinchend', onPinchEnd);
    mc.on('tap', onTap);

    function onTap(ev) {
        ev.preventDefault();
        if (ev.pointerType === 'touch') {
            translationEnabled = true;

        }
    }

    function onTouchStart(ev) {
        ev.preventDefault();
        touching = true;
    }

    function onTouchEnd(ev) {
        touching = false;
        ev.preventDefault();
        setTimeout(function () {
            if (!touching) {
                translationEnabled = false;
            }
        }, 600);
    }

    function onPanStart(ev) {
        ev.preventDefault();
        if (ev.pointerType === 'touch') {
            controller.curX = ev.deltaX;
            controller.curY = ev.deltaY;
            controller.deltaZTrans = 0.0;
            dragging = true;
        }
    }

    function onPanMove(ev) {
        ev.preventDefault();
        if (ev.pointerType === 'touch') {
            var curX = ev.deltaX;
            var curY = ev.deltaY;
            if (dragging && !translationEnabled) {
                controller.deltaXRot = (controller.curX - curX) * controller.velocity * 0.5;
                controller.deltaYRot = (controller.curY - curY) * controller.velocity * 0.5;
                controller.curX = curX;
                controller.curY = curY;
                // Update the X and Y rotation angles based on the touch motion.
                controller.yRot = (controller.yRot + controller.deltaX);
                controller.xRot = (controller.xRot + controller.deltaY);

            } else if (dragging && translationEnabled) {

                controller.deltaXTrans = (controller.curX - curX) * controller.velocity * 0.5;
                controller.deltaYTrans = (controller.curY - curY) * controller.velocity * 0.5;
                controller.curX = curX;
                controller.curY = curY;
                // Update the X and Y translation on the touch motion.
                controller.yTrans = (controller.yTrans + controller.deltaY);
                controller.xTrans = (controller.xTrans + controller.deltaX);
            }
            updateChanges();
        }
    }

    function onPanEnd(ev) {
        ev.preventDefault();
        if (ev.pointerType === 'touch') {
            dragging = false;
            translationEnabled = false;
            touching = false;
            controller.deltaXRot = 0.0;
            controller.deltaYRot = 0.0;
            controller.deltaXTrans = 0.0;
            controller.deltaYTrans = 0.0;
            controller.deltaZTrans = 0.0;
        }
    }

    function onPinchStart(ev) {
        ev.preventDefault();
        if (ev.pointerType === 'touch') {
            //curZTrans = controller.zTrans;
        }
    }

    function onPinchMove(ev) {
        ev.preventDefault();
        if (ev.pointerType === 'touch') {

            if (ev.additionalEvent === "pinchin") {
                controller.deltaZTrans = 0.01 * ev.distance * controller.velocity;
                controller.zTrans += 0.0002 * ev.distance;
            }
            if (ev.additionalEvent === "pinchout") {
                controller.deltaZTrans = -0.01 * ev.distance * controller.velocity;
                controller.zTrans -= 0.0002 * ev.distance;
            }
            updateChanges();
        }
    }

    function onPinchEnd(ev) {
        controller.deltaZTrans = 0;
    }
}