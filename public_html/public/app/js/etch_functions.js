function getGraphicEditableElement() {
    var el = me.selectedforedit;
    var svg = $($(el).find("svg"));
    var last = $(svg.children()).size() - 1;
    var graphic = $(svg).children()[last];
    return graphic;
}

function updateCurrentColor(element, color) {
    $(element.find(".sp-preview-inner")).css("backgroundColor", color);
}

function updateCurrentOpacity(element, type) {
    var graphic = getGraphicEditableElement();
    var option = $(element).find("[value='" + $(graphic).css(type) + "']");
    $(option[0]).prop('selected', true);
}

function updateCurrentStrokeWidth() {
    var graphic = getGraphicEditableElement();
    $("#edit-stroke-width").val($(graphic).attr("stroke-width"));
}

function changeFillColor(color) {
    var graphic = getGraphicEditableElement();
    $(graphic).attr("fill", color);
    var element = me.selectedforedit;
    modifyFigure(element, 'fill', graphic.getAttribute("fill"));
    changeContent();
}

function changeStrokeColor(color) {
    var graphic = getGraphicEditableElement();
    $(graphic).attr("stroke", color);
    if ($(graphic).attr("data-svgtype") == "arrow") {
        var head = $($(graphic).parent()).find("use")[0];
        $(head).attr("fill", color);//Arrowhead is fill instead of stroke
        head = $(head).attr("href");
        $(head).attr("fill", color);//Arrowhead is fill instead of stroke
    }
    var element = me.selectedforedit;
    modifyFigure(element, 'stroke', graphic.getAttribute("stroke"));
    changeContent();
}

function changeStrokeWidth() {
    var graphic = getGraphicEditableElement();
    var stroke_width = $("#edit-stroke-width").val();
    $(graphic).attr("stroke-width", stroke_width);
    var element = me.selectedforedit;

    me.addGraphicStyle(element, graphic);
    modifyFigure(element, 'lineSize', graphic.getAttribute("stroke-width"));
    changeContent();
}

function changeStrokeOpacity() {
    changeOpacity(this, "stroke-opacity");
}
function changeFillOpacity() {
    changeOpacity(this, "fill-opacity");
    var graphic = getGraphicEditableElement();
    var element = me.selectedforedit;
    modifyFigure(element, 'Opacity', graphic.getAttribute("style").substring(61,64));
}

function changeOpacity(el, type) {
    var opacity = el.options[el.selectedIndex].value;
    var graphic = getGraphicEditableElement();
    $(graphic).css(type, opacity);
}

function getCurrentGraphicColor(type) {
    var graphic = getGraphicEditableElement();
    return $(graphic).attr(type);
}

function changeBorderWidth() {
    var new_border_width = pxToVw($("#edit-border-width").val()) + "vw";
    var element = me.selectedforedit;
    var border = $(element).css("border");
    if (border) {
        border = border.split(" ");
        border[0] = new_border_width;
        border[1] = "solid";
        border = border.join(" ");
        $(element).css("border", border);
    }
    else {
        $(element).css("border", new_border_width + " solid #000");
    }
    changeContent();
}

function updateCurrentBorderWidth() {
    var element = me.selectedforedit;
    var border = $(element).css("border");

    if (border) {
        border = border.split(" ");
        $("#edit-border-width").val(getIntValue(border[0]));
    } else {
        $("#edit-border-width").val("0");
    }
}

function getCurrentEtchBorderColor() {
    var element = me.selectedforedit;
    var border = $(element).css("border");
    var border_color = $(element).css("border-color");
    var color = "#000";

    if (border_color) {
        if (border_color[0] != "#") {
            border_color = rgbToHex(border_color);
        }
        color = border_color;
    }
    else {
        if (border) {
            border = border.split(" ");
            border.shift(); //width
            border.shift(); //type
            if (border[0] != "#") {
                border = border.join(",");
                color = rgbToHex(border);
            }
            else {
                color = border[0];
            }
        }
    }
    return color;
}

function changeBorderColor(color) {
    var element = me.selectedforedit;
    var border = $(element).css("border");
    border = border.split(" ");
    border = pxToVw(getFloatValue(border[0])) + "vw " + border[1] + " " + color;
    $(element).css("border", border, "important");
    changeContent();
}


function getCurrentEtchBackgroundColor() {
    var element = me.selectedforedit;
    var bg = $(element).css("background");
    if (bg) {
        return bg;
    }
    else {
        return "#fff";
    }
}

function changeBackgroundColor(color) {
    var element = me.selectedforedit;
    $(element).css("background", color, "important");
    console.log('options'); //debug
    changeContent();
}