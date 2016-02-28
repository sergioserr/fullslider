/**
 * Matrix Play
 *
 * Drag a box around to get the transform css!
 * Version 1.3 - 2012/03/03
 *
 */

// decimals of the matrix css output
var FIXED = 3;
var targetobject;
/**
 * Various helpers
 *
 */

if (!Function.prototype.bind) {
    Function.prototype.bind = function(scope) {
        var method = this;
        return function() {
            return method.apply(scope, arguments);
        };
    };
}

function find(selector) {
    return document.querySelectorAll(selector);
}

function closest(nodeName, node) {
    var reg = new RegExp('^' + nodeName + '$', 'i');
    while (node && !reg.test(node.nodeName)) {
        node = node.parentNode;
    }
    return node;
}

function addEvent(node, type, listener) {
    node.addEventListener(type, listener, false);
}

function addEvents(nodes, type, listener) {
    var i, l = nodes.length;
    for (i = 0; i < l; i++) {
        addEvent(nodes[i], type, listener);
    }
}


/**
 * 2D vector for prettuer 2D <3 math <3
 *
 */
var Vector = function(x, y) {
    this.x = x;
    this.y = y;
};
Vector.prototype = {
    add: function(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    },
    subtract: function(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    },
    multiply: function(v) {
        return new Vector(this.x * v.x, this.y * v.y);
    },
    divide: function(v) {
        return new Vector(this.x / v.x, this.y / v.y);
    },
    // not used
    dot: function(b) {
        var d = this.multiply(b);
        return (d.x + d.y);
    },
    // not used
    magnitude: function() {
        var x = this.x;
        var y = this.y;
        return _sqrt(x * x + y * y);
    },
    // not used
    normalize: function() {
        var m = this.magnitude();
        return new Vector(this.x / m, this.y / m);
    },
    // applies a matrix to this vector for total transformation, not used in this app.
    transform: function(matrix) {
        var m = matrix.base;
        return new Vector(
                m[0] * this.x + m[1] * this.y + m[2],
                m[3] * this.x + m[4] * this.y + m[5]
                );
    }
};
/**
 * Matrix, actually a 3x3 one, but the bottom line would always say 0 0 1, which would cause lots of senseless 0's to be calculated everywhere.
 *
 */
var Matrix = function(base) {
    this.base = base || [1, 0, 0, 0, 1, 0];
};
Matrix.prototype = {
    _multiply: function(
            a1, a2, a3, a4, a5, a6,
            b1, b2, b3, b4, b5, b6
            ) {
        return new Matrix([
            a1 * b1 + a2 * b4,
            a1 * b2 + a2 * b5,
            a1 * b3 + a2 * b6 + a3, // because of the 0 0 1
            a4 * b1 + a5 * b4,
            a4 * b2 + a5 * b5,
            a4 * b3 + a5 * b6 + a6 // and again
        ]);
    },
    multiply: function(b) {
        // apply the concatenated arrays to get 12 arguments, is actually faster.
        return this._multiply.apply(this, this.base.concat(b));
    },
    translate: function(v) {
        return this.multiply([1, 0, v.x, 0, 1, v.y]);
    },
    rotate: function(r) {
        var sin = Math.sin(r);
        var cos = Math.cos(r);
        return this.multiply([cos, sin, 0, -sin, cos, 0]);
    },
    scale: function(v) {
        return this.multiply([v.x, 0, 0, 0, v.y, 0]);
    },
    skew: function(v) {
        return this.multiply([1, v.y || 0, 0, v.x || 0, 1, 0]);
    },
    // CSS puts the translation elsewhere, really a 2x2 matrix with added dx and dy instead of a 3x3
    toArray: function() {
        var b = this.base;
        return [b[0], b[1], b[3], b[4], b[2], b[5]];
    }
};
Matrix.parseArray = function(b) {
    // 2x2 vs 3x3
    return new Matrix([
        b[0], b[1], b[4],
        b[2], b[3], b[5]
    ]);
};
/**
 * Tiny client check
 *
 */
var ua = navigator.userAgent;
var Client = {
    touchEnabled: function() {
        return !!('ontouchstart' in window);
    },
    webkit: /webkit\//i.test(ua),
    gecko: /gecko\//i.test(ua),
    trident: /trident\//i.test(ua),
    presto: /presto\//i.test(ua)
};
/**
 * Style
 *
 */
var Style = (function() {

    var prefix =
            Client.webkit ? '-webkit-' :
            Client.gecko ? '-moz-' :
            Client.presto ? '-o-' :
            Client.trident ? '-ms-' : '';
    var csstransition = prefix + 'transition';
    var csstransform = prefix + 'transform';
    var regtransform = /(transform)/g;
    var regreplace = prefix + '$1';
    var PRIORITY = ''; // eg !important

    var unit = function(val) {
        return (typeof val === 'number') ? (val + 'px') : val;
    };
    return {
        // not used
        setTransition: function(node, transition) {
            var value = transition.replace(regtransform, regreplace);
            this.set(node, csstransition, value);
        },
        setTransform: function(node, transform) {
            var value = transform;
            if (transform instanceof Matrix) {
                var array = transform.toArray();
                // mozilla requires units in the matrix's translation
                if (Client.gecko) {
                    array[4] += 'px';
                    array[5] += 'px';
                }

                value = 'matrix(' + array.join(',') + ')';
            }

            this.set(node, csstransform, value);
        },
        // not used
        setTranslate: function(node, x, y) {
            this.set(node, csstransform,
                    'translate(' + unit(x) + ',' + unit(y) + ')');
        },
        set:
                Client.trident ? // IE

                function(node, property, value) {
                    node.style[property] = value;
                } :
                function(node, property, value) {
                    console.log("NODE: " + node);
                    node.style.setProperty(property, value, PRIORITY);
                },
        // not used
        get: function(node, property) {
            var computed = window.getComputedStyle(node, null);
            var style = node.style;
            var value =
                    computed.getPropertyValue(property) ||
                    style.getPropertyValue(property) ||
                    style[property];
            return value;
        },
        /**
         * get the CSS of the given matrix
         *
         */
        toCSS: function(matrix, fix) {
            var cleaned = matrix.toArray().map(function(n) {
                return (fix && (parseInt(n, 10) !== n)) ? n.toFixed(fix) : n
            });
            var css = cleaned.join(',');
            cleaned[4] += 'px';
            cleaned[5] += 'px';
            var moz = cleaned.join(',');
            console.log("toCSS called");
            console.log("editedobject" + me.editedobject + " css " + css);
            me.selectedElement.css("-webkit-transform", "matrix(" + css + ")");
            return 'matrix(' + css + ');'
            /*return [
             '-webkit-transform: matrix(' + css + ');',
             '-moz-transform: matrix(' + moz + ');',
             '-ms-transform: matrix(' + css + ');',
             '-o-transform: matrix(' + css + ');',
             'transform: matrix(' + css + ');'
             ].join('\n');*/
        }
    };
}());
/**
 * Run!
 * 
 */

addEvent(window, 'DOMContentLoaded', function() {
    var matrix = new Play();
});

/**
 * mousedown/touchstart handler
 *
 */
function handleMousedown(e) {
    $(".slideviewport").css("-webkit-user-select", "none");
    //e.preventDefault();

    // jquery wraps the native event, need it for e.touches though
    var ev = this.getTouch(e);
    var handle = closest('span', e.target);
    var play = this.play;
    // store some vectors (see further below) for move calcs
    this.center = new Vector(
            play.offsetLeft + play.offsetWidth / 2,
            play.offsetTop + play.offsetHeight / 2
            );
    this.anchor = new Vector(ev.clientX, ev.clientY);
    this.offset = this.anchor.subtract(this.center);
    this.mode = handle.className;
}
/**
 * mousemove/touchmove handler
 *
 */
function handleMousemove(e) {

    // If no current mode, do nothing. Conditional binding would be prettier.
    if (!this.mode) {
        return;
    }

    e.preventDefault();
    var ev = this.getTouch(e);
    var point = new Vector(ev.clientX, ev.clientY);
    var center = this.center;
    var anchor = this.anchor;
    var offset = this.offset;
    var matrix = this.display;
    /**
     * transform the current matrix based on the mode (classname) of the dragged handle
     *
     * <3 math <3
     */
    var actualmode = this.mode.split(" ")[0];
    switch (actualmode) {
        case 'rotate':
            var moved = point.subtract(anchor);
            var y = moved.y;
            var x = point.subtract(center).x;
            var r = Math.atan2(y, x);
            matrix = matrix.rotate(r);
            break;
        case 'scale':
            var element = me.selectedElement;
            var el_height = element[0].offsetHeight;
            var container = $(".fullslider-slide-container");
            var right_limit = container.offset().left + container.width();
            var bottom_limit = container.offset().top + container.height();
            var initialPoint = $(element[0]).offset().top + el_height;
            var difference = (e.pageY - initialPoint);
            var new_heigth = el_height + difference;
            if (element.attr("data-type") === "text") {
                var scale = new_heigth / el_height;
                var fontsize = parseFloat(getFontSize(me.selectedElement));
                var new_fontsize = fontsize * scale;
                new_fontsize = pxToVw(new_fontsize);
                if (new_fontsize < 1) {
                    new_fontsize = 1;
                }
                new_fontsize += "vw";
                me.selectedElement.css("font-size", new_fontsize);
                var max_height = parseFloat(element.css("max-height"));
                var scroll_heigth = parseFloat(element[0].scrollHeight);
                var max_width = parseFloat(element.css("max-width"));
                var scroll_width = parseFloat(element[0].scrollWidth);
                //If element with new size is out of container, undo resize
                if (scroll_heigth >= max_height || scroll_width >= max_width) {
                    fontsize = pxToVw(fontsize);
                    fontsize += "vw";
                    me.selectedElement.css("font-size", fontsize);
                }

            }
            else {
                var el_width = element[0].offsetWidth;
                var scale = el_height / el_width;
                var new_width = element[0].offsetWidth * scale;
                if (new_width < getRel()) {
                    new_width = 1;
                }
                else {
                    new_width = pxToVw(new_width);
                }
                if (new_heigth < getRel()) {
                    new_heigth = 1;
                }
                else {
                    new_heigth = pxToVw(new_heigth);
                }
                element.css("height", new_heigth + "vw");
                element.css("width", new_width + "vw");
                var right_pos = me.selectedElement.offset().left + me.selectedElement.width();
                var bottom_pos = me.selectedElement.offset().top + me.selectedElement.height();
                if (right_pos > right_limit || bottom_pos > bottom_limit) {
                    el_width = pxToVw(el_width);
                    el_height = pxToVw(el_height);
                    element.css("height", el_height + "vw");
                    element.css("width", el_width + "vw");
                }
            }
            scalePlay(element[0]);
            break;
        case 'move':
            var moved = point.subtract(anchor);
            matrix = matrix.translate(moved);
            break;
        case 'skewx':
            var moved = point.subtract(anchor);
            matrix = matrix.skew(
                    new Vector(moved.x / offset.y, 0)
                    );
            break;
        case 'skewy':
            var moved = point.subtract(anchor);
            matrix = matrix.skew(
                    new Vector(0, moved.y / offset.x)
                    );
            break;
    }

    // store and show the current transformation
    this.current = matrix;
    //targetobject = me.editedobject.attr("id");
    this.transform(matrix);
    console.log(this + " aodeeeee");
    //targetobject.transform(matrix);
}
function handleMouseup(e) {
    // yes. I know
    if (!this.mode) {
        return;
    }

    e.preventDefault();
    // clear the mode, update display and output result.
    this.mode = null;
    this.save();
    $(".slideviewport").css("-webkit-user-select", "auto");
    changeContent();
}
function getTouch(e) {
    // multitouch vs mouse
    return e.touches ? e.touches[0] : e;
}
/**
 * send the matrix over to the Style object (see below)
 *
 */
function transform(matrix) {
    Style.setTransform(this.play, matrix);
    var css = Style.toCSS(matrix, FIXED);
    if (targetobject != undefined)
    {
        Style.setTransform(targetobject, matrix);
    }
}
function save() {
    this.display = this.current;
    // yeah this looks terrible
    var state = this.current.toArray().map(function(n) {
        return (parseInt(n, 10) !== n) ? n.toFixed(FIXED) : n;
    }).join(',');
    this.render(this.display);
    this.state = state;
    if (!this.mirrored) {
        window.location.hash = state;
    }

}
function reset() {
    var reset = new Matrix();
    this.display = reset;
    this.transform(reset);
    this.render(reset);
    this.state = null;
}
/**
 * Outputs the given matrix to the output area for copy-pasting
 *
 */
function render(matrix) {
    var css = Style.toCSS(matrix, FIXED);
    //this.out.innerHTML = css;

    //$(editedobject).css("-webkit-transform", css);
}
/**
 * attempt to restore the display to the given hash
 *
 */
function restore() {
    var hash = window.location.hash;
    if (hash && hash.length) {
        try {
            var state = hash.substring(1);
            if (state === this.state) {
                // same, skip
                return;
            }

            var input = state.split(',').map(parseFloat);
            if (input.length == 6) {
                var matrix = Matrix.parseArray(input);
                this.display = matrix;
                this.transform(matrix);
                this.render(matrix);
                this.state = state;
            }
        } catch (e) {
            // something went wrong, let's reset it
            this.reset();
        }
    } else {
        // back to initial pageload, no hash
        this.reset();
    }
}



function playInit() {
    this.play = find('#play')[0];
    this.out = find('#output')[0];
    this.mirrored = !/(peterned|xs4all)/.test(window.location.href);
    // the draggable handles
    var handles = find('#play span');
    var touch = Client.touchEnabled();
    addEvents(handles, touch ? 'touchstart' : 'mousedown',
            this.handleMousedown.bind(this));
    addEvent(document, touch ? 'touchmove' : 'mousemove',
            this.handleMousemove.bind(this));
    addEvent(document, touch ? 'touchend' : 'mouseup',
            this.handleMouseup.bind(this));
    addEvent(window, 'hashchange', this.restore.bind(this));
    // transformation mode (handle classname)
    this.mode = null;
    // hash state
    this.state = 'none';
    // permanent transformation
    this.display = new Matrix();
    // temp transformation during move, added to display on release
    this.current = new Matrix();
    // if there is a usable hash, use it!
    if (window.location.hash) {
        this.restore();
    }
}


playInit();