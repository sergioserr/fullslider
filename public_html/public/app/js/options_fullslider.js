//Defaults variables
default_text = {
    top: 11.4202,
    left: 3.66032,
    fontsize: 1.75,
    transform: 0,
}
default_title = {
    top: 0.0732064,
    left: 1.02489,
    fontsize: 3.5,
    transform: 0,
}
default_subtitle = {
    top: 5.13089,
    left: 3.66492,
    fontsize: 2.75,
    transform: 0,
}
default_code = {
    top: 5.66,
    left: 24.6,
    fontsize: 1.3,
    style: 'idea',
    numbers: 'true',
    transform: 0,
}
default_image = {
    top: 5.66,
    left: 24.6,
    height: 7,
    width: 7.49235,
    transform: 0,
}
default_figure = {
    top: 6.44788,
    left: 5.83935,
    height: 11.3636363636363631,
    width: 11.3636363636363631,
    transform: 0,
    fill: "#007fff",
    stroke: "#000000",
    lineSize: 3,
    Opacity: 1,
}
default_temp = {
    top: undefined,
    left: undefined,
    height: undefined,
    width: undefined,
    fontsize: undefined,
    transform: undefined,
    style: undefined,
    numbers: undefined,
    fill: undefined,
    stroke: undefined,
    lineSize: undefined,
    Opacity: undefined,
}
function NumElements(){
    this.numText = 0;
    this.numElem = 0;
    this.numTitle = 0;
    this.numSub = 0;
    this.numFigure = 0;
    this.numCode = 0;
    this.numImage = 0;
}
//Numbers of elements for slide
slideNumElements = {};

//Control elements in  each slide
function addNumElementsSlide(idSlide){
    slideNumElements[idSlide] = new NumElements();
}
function removeNumElementsSlide(idSlide){
    delete slideNumElements[idSlide];
}
function moreText(quantity){
    slideNumElements[obtainSlide()].numText += quantity;
    slideNumElements[obtainSlide()].numElem += quantity;
}
function moreTitle(quantity){
    slideNumElements[obtainSlide()].numTitle += quantity;
    if(slideNumElements[obtainSlide()].numTitle > 1){
         slideNumElements[obtainSlide()].numText += quantity;   
    }
    slideNumElements[obtainSlide()].numElem += quantity;
}
function moreSub(quantity){
    slideNumElements[obtainSlide()].numSub += quantity;
    if(slideNumElements[obtainSlide()].numSub > 1){
        slideNumElements[obtainSlide()].numText += quantity;         
    }
    slideNumElements[obtainSlide()].numElem += quantity;
}
function moreCode(quantity){
    slideNumElements[obtainSlide()].numCode += quantity;
    slideNumElements[obtainSlide()].numElem += quantity;
}
function moreImage(quantity, slide){
    slide = slide.attr('id');
    if(slide == undefined){
        return undefined;
    }
    slide = slide.substr(17, 4);
    slideNumElements[slide].numImage += quantity;
    slideNumElements[slide].numElem += quantity;
}
function moreFigure(quantity){
    slideNumElements[obtainSlide()].numFigure += quantity;
    slideNumElements[obtainSlide()].numElem += quantity;
}
function lessElement(type, quantity){
    switch(type){
        case 'text':
            if(slideNumElements[obtainSlide()] != undefined){
                slideNumElements[obtainSlide()].numText -= quantity;
                slideNumElements[obtainSlide()].numElem -= quantity;
            }
            break;
        case 'title':
            if(slideNumElements[obtainSlide()] != undefined){
                slideNumElements[obtainSlide()].numTitle -= quantity;
                if(slideNumElements[obtainSlide()].numSub > 1){
                    slideNumElements[obtainSlide()].numText -= quantity;         
                }
                slideNumElements[obtainSlide()].numElem -= quantity;
            }
            break;
        case 'subtitle':
            if(slideNumElements[obtainSlide()] != undefined){
                slideNumElements[obtainSlide()].numSub -= quantity;
                if(slideNumElements[obtainSlide()].numSub > 1){
                    slideNumElements[obtainSlide()].numText -= quantity;         
                }
                slideNumElements[obtainSlide()].numElem -= quantity;
            }
            break;
        case 'code':
            if(slideNumElements[obtainSlide()] != undefined){
                slideNumElements[obtainSlide()].numCode -= quantity;
                slideNumElements[obtainSlide()].numElem -= quantity;
            }
            break;
        case 'image':
            if(slideNumElements[obtainSlide()] != undefined){
                slideNumElements[obtainSlide()].numImage -= quantity;
                slideNumElements[obtainSlide()].numElem -= quantity;
            }
            break;
        case 'figure':
            if(slideNumElements[obtainSlide()] != undefined){
                slideNumElements[obtainSlide()].numFigure -= quantity;
                slideNumElements[obtainSlide()].numElem -= quantity;
            }
            break;
        case 'titleS':
            if(slideNumElements[obtainSlide()] != undefined){
                slideNumElements[obtainSlide()].numTitle -= quantity;
                if(slideNumElements[obtainSlide()].numSub > 1){
                    slideNumElements[obtainSlide()].numText -= quantity;         
                }
                slideNumElements[obtainSlide()].numElem -= quantity;
            }
            break;
        case 'subtitleS':
            if(slideNumElements[obtainSlide()] != undefined){
                slideNumElements[obtainSlide()].numSub -= quantity;
                if(slideNumElements[obtainSlide()].numSub > 1){
                    slideNumElements[obtainSlide()].numText -= quantity;         
                }
                slideNumElements[obtainSlide()].numElem -= quantity;
            }
            break;
    }
}

//Modify elements
function modifyFigure(element, option, value){
    var textOptions = '';
    switch(option){
        case 'fill':
            textOptions += option + ':' + " '" + value + "',";
            break;
        case 'stroke':
            textOptions += option + ':' + " '" + value + "',";
            break;
        case 'lineSize':
            textOptions += option + ':' + " '" + value + "',";
            break;
        case 'Opacity':
            textOptions += option + ':' + " '" + value + "',";
            break;
    }
    var id = element.getAttribute("id").substr(12, 4);
    addOptionsList(id, textOptions);
}
function modifyCode(element, option, value){
    var textOptions = '';
    switch(option){
        case 'style':
            textOptions += option + ':' + " '" + value + "',";
            break;
        case 'numbers':
            textOptions += option + ':' + " '" + value + "',";
            break;
    }
    var id = element.attr("id").substr(12, 4);
    addOptionsList(id, textOptions);
}
function modifyElementPosition(element){
    var options = parserElement(element, 'position');
    var type = element.getAttribute('data-type')
//    console.log(type); //debug
    var textOptions = '';
//    console.log(options); //debug
    for(option in options){
        switch(option){
            case 'top':
                textOptions += option + ':' + " '"; 
                var n = 0;
                while(options[option][n] != 'v' && options[option][n] != 'p'){
                    textOptions += options[option][n];
                    n++;
                }
                 textOptions += "',";
                break;
            case 'left':
                textOptions += option + ':' + " '"; 
                var n = 0;
                while(options[option][n] != 'v' && options[option][n] != 'p'){
                    textOptions += options[option][n];
                    n++;
                }
                 textOptions += "',";
                break;
        }
    }
//    console.log(textOptions) //debug
    var id = element.getAttribute("id").substr(12, 4);
    addOptionsList(id, textOptions);
}
function modifyElementSize(element){
    var options = parserElement(element, 'size');
    var type = element.attr('data-type')
//    console.log(type); //debug
    var textOptions = '';
//    console.log(options); //debug
    for(option in options){
        switch(option){
            case 'width':
                if(type == 'graphic' || type == 'image'){
                    textOptions += option + ':' + " '"; 
                    var n = 0;
                    while(options[option][n] != 'v'){
                        textOptions += options[option][n];
                        n++;
                    }
                    textOptions += "',";
                }
                break;
            case 'height':
                if(type == 'graphic' || type == 'image'){
                    textOptions += option + ':' + " '"; 
                    var n = 0;
                    while(options[option][n] != 'v'){
                        textOptions += options[option][n];
                        n++;
                    }
                    textOptions += "',";
                }
                break;
            case 'font-size':
                if(type != 'graphic' && type != 'image'){
                    textOptions += option + ':' + " '"; 
                    var n = 0;
                    while(options[option][n] != 'v'){
                        textOptions += options[option][n];
                        n++;
                    }
                    textOptions += "',";
                }
                break;
            case 'transform':
                var n = 0;
                var number = '';
                while(options[option][n] != 'd'){
                    if(options[option][n] == '"' && options[option][n+1] != 'r'){
                        break;
                    }
                    number += options[option][n];
                    n++;
                }
                textOptions += option + ':' + " '";
                number = number.substr(7);
                textOptions += number + "',";
                break;
        }
    }
//    console.log(textOptions) //debug
    var id = element.attr("id").substr(12, 4);
    addOptionsList(id, textOptions);
}
function mergeOptions(oldOp, newOp){
    var options = oldOp.split(',');
//    console.log(options) //debug
    var option = '';
    var value = '';
    var textOptions = newOp;
    for(var op = 0; op < options.length; op++){
        if(options[op] != ''){
            option = obtainOption(options[op]);
            value = obtainValue(options[op]);
            if(!textOptions.includes(option)){
                textOptions += option + ": '" + value + "',";
            }
        }
    }
    return textOptions;
}

//Get options
function getOptions(type){
    var options = {};
    switch(type){
        case 'text':
            for(option in default_text){
                if(default_temp[option] != undefined){
                    options[option] = default_temp[option];
                }
                else{
                    options = getOptionText(option, options);
                }
            }
            break;
        case 'title':
            for(option in default_title){
                if(default_temp[option] != undefined){
                    options[option] = default_temp[option];
                }
                else{
                    options = getOptionTitle(option, options);
                }
            }
            break;
        case 'subtitle':
            for(option in default_subtitle){
                if(default_temp[option] != undefined){
                    options[option] = default_temp[option];
                }
                else{
                    options = getOptionSubtitle(option, options);
                }
            }
            break;
        case 'code':
            for(option in default_code){
                if(default_temp[option] != undefined){
                    options[option] = default_temp[option];
                }
                else{
                    options = getOptionCode(option, options);
                }
            }
            break;
        case 'image':
            for(option in default_image){
                if(default_temp[option] != undefined){
                    options[option] = default_temp[option];
                }
                else{
                    options = getOptionImage(option, options);
                }
            }
            break;
        case 'figure':
            for(option in default_figure){
                if(default_temp[option] != undefined){
                    options[option] = default_temp[option];
                }
                else{
                    options = getOptionFigure(option, options);
                }
            }
            break;
    }
//    console.log(options) //debug
    return options;
}
function getOptionText(option, options){
    switch(option){
        case 'top':
            if(slideNumElements[obtainSlide()].numText > 10){
                options.top = default_text.top + (slideNumElements[obtainSlide()].numText - 11) * 2;
            }
            else{
                options.top = default_text.top + slideNumElements[obtainSlide()].numText * 2;
            }
            break;
        case 'left':
            if(slideNumElements[obtainSlide()].numText <= 10){
                options.left = default_text.left;
            }
            else{
                options.left = default_text.left + 18;
            }
            break;
        case 'fontsize':
            options.fontsize = default_text.fontsize;
            break;
        case 'transform':
            options.transform = default_text.transform;
            break;
    }
    return options;
}
function getOptionTitle(option, options){
    switch(option){
        case 'top':
            if(slideNumElements[obtainSlide()].numTitle > 0){
                if(slideNumElements[obtainSlide()].numText > 10){
                    options.top = default_text.top + (slideNumElements[obtainSlide()].numText - 11) * 2;
                }
                else{
                    options.top = default_text.top + slideNumElements[obtainSlide()].numText * 2;
                }
            }
            else{
                options.top = default_title.top;
            }
            break;
        case 'left':
            options.left = default_title.left;
            break;
        case 'fontsize':
            options.fontsize = default_title.fontsize;
            break;
        case 'transform':
            options.transform = default_title.transform;
            break;
    }
    return options;
}
function getOptionSubtitle(option, options){
    switch(option){
        case 'top':
            if(slideNumElements[obtainSlide()].numSub > 0){
                if(slideNumElements[obtainSlide()].numText > 10){
                    options.top = default_text.top + (slideNumElements[obtainSlide()].numText - 11) * 2;
                }
                else{
                    options.top = default_text.top + slideNumElements[obtainSlide()].numText * 2;
                }
            }
            else{
                options.top = default_subtitle.top;
            }
            break;
        case 'left':
            options.left = default_subtitle.left;
            break;
        case 'fontsize':
            options.fontsize = default_subtitle.fontsize;
            break;
        case 'transform':
            options.transform = default_subtitle.transform;
            break;
    }
    return options;
}
function getOptionCode(option, options){
    switch(option){
        case 'top':
            options.top = default_code.top + (slideNumElements[obtainSlide()].numCode) * 2;
        case 'left':
            options.left = default_code.left;
            break;
        case 'fontsize':
            options.fontsize = default_code.fontsize;
            break;
        case 'style':
            options.style = default_code.style;
            break;
        case 'numbers':
            options.numbers = default_code.numbers;
            break;
        case 'transform':
            options.transform = default_code.transform;
            break;
    }
    return options;
}
function getOptionImage(option, options){
    switch(option){
        case 'top':
            options.top = default_image.top + (slideNumElements[obtainSlide()].numImage) * 2;
        case 'left':
            options.left = default_image.left;
            break;
        case 'height':
            options.height = default_image.height;
            break;
        case 'width':
            options.width = default_image.width;
            break;
        case 'transform':
            options.transform = default_image.transform;
            break;
    }
    return options;
}
function getOptionFigure(option, options){
    switch(option){
        case 'top':
            options.top = default_figure.top;
            break;
        case 'left':
            options.left = default_figure.left;
            break;
        case 'height':
            options.height = default_figure.height;
            break;
        case 'width':
            options.width = default_figure.width;
            break;
        case 'transform':
            options.transform = default_figure.transform;
            break;
        case 'fill':
            options.fill = default_figure.fill;
            break;
        case 'stroke':
            options.stroke = default_figure.stroke;
            break;
        case 'lineSize':
            options.lineSize = default_figure.lineSize;
            break;
        case 'Opacity':
            options.Opacity = default_figure.Opacity;
            break;
    }
    return options;
}

//Set temporal options
function set_temp(options){
    var options = options.split(',');
//    console.log(options); //debug
    var option = '';
    var value = '';
    for(var op = 0; op < options.length; op++){
        if(options[op] != ''){
            option = obtainOption(options[op]);
            value = obtainValue(options[op]);
            switch(option){
                case 'top':
                    default_temp.top = parseFloat(value);
                    break;
                case 'left':
                    default_temp.left = parseFloat(value);
                    break;
                case 'index':
                    prepocessing(value);
                    break;
                case 'font-size':
                    default_temp.fontsize = parseFloat(value);
                    break;
                case 'height':
                    default_temp.height = parseFloat(value);
                    break;
                case 'width':
                    default_temp.width = parseFloat(value);
                    break;
                case 'style':
                    default_temp.style = value;
                    break;
                case 'numbers':
                    default_temp.numbers = value;
                    break;
                case 'transform':
                    default_temp.transform = parseFloat(value);
                    break;
                case 'fill':
                    default_temp.fill = value;
                    break;
                case 'stroke':
                    default_temp.stroke = value;
                    break;
                case 'lineSize':
                    default_temp.lineSize = parseFloat(value);
                    break;
                case 'Opacity':
                    default_temp.Opacity = parseFloat(value);
                    break;
            }
        }
    }
}

//Figures
function addOptionsNewFigure(element){
    var options = parserElement(element, 'position');
    var textOptions = '';
//    console.log(options); //debug
    for(option in options){
        switch(option){
            case 'top':
                textOptions += option + ':' + " '"; 
                var n = 0;
                while(options[option][n] != 'v' && options[option][n] != 'p'){
                    textOptions += options[option][n];
                    n++;
                }
                textOptions += "',";
                break;
            case 'left':
                textOptions += option + ':' + " '"; 
                var n = 0;
                while(options[option][n] != 'v' && options[option][n] != 'p'){
                    textOptions += options[option][n];
                    n++;
                }
                textOptions += "',";
                break;
            case 'width':
                textOptions += option + ':' + " '"; 
                var n = 0;
                while(options[option][n] != 'v'){
                    textOptions += options[option][n];
                    n++;
                }
                textOptions += "',";
                
                break;
            case 'height':
                textOptions += option + ':' + " '"; 
                var n = 0;
                while(options[option][n] != 'v'){
                    textOptions += options[option][n];
                    n++;
                }
                textOptions += "',";
                break;
        }
    }
//    console.log(textOptions) //debug
    var id = element.getAttribute("id").substr(12, 4);
    addOptionsList(id, textOptions);
}

//Index
function prepocessing(indexType){
        for(var pre = 2 ; pre < source.length; ++pre ){
            if(source[pre][1] != undefined){
                switch(source[pre][0]){
                    case 'slide1':
                        slides_list.push(1);
                        slides_list.push(source[pre][1]);
                        break;
                    case 'slide2':
                        slides_list.push(2);
                        slides_list.push(source[pre][1]);
                        break;
                }
            }
        }
        modeIndex = indexType;
        max_line += 2;
        createSlideIndex("first", 0);
        max_line -= 2;
}

//Data obtain
function obtainOption(line){
    var c = 0;
    var option = '';
    while(line[c] != ':'){
        option += line[c];
        c++;
    }
    return option;
}
function obtainValue(line){
    var v = 0;
    var value = '';
    while(line[v] != "'"){
        v++;
    }
    v++;
    while(line[v] != "'"){
        value += line[v];
        v++;
    }
    return value;
}
var obtainSlide = function(){
    var slide = $("[style='z-index: 1;']").attr('id');
    if(slide == undefined){
        return undefined;
    }
    slide = slide.substr(17, 4);
    return slide;
}
var parserElement = function(element, type){
    if(type == 'position'){
        var parseText = element.getAttribute("style").split(';');
    }
    else if(type == 'size'){
        var parseText = element.attr("style").split(';');
    }
//    console.log(parseText); //debug
    var options = {};
    var option = '';
    var value = '';
    var p = 0;
    for(i = 0; i < parseText.length; i++){
        if(parseText[i] != ''){
            while(parseText[i][p] != ':'){
                if(parseText[i][p] != ' '){
                    option += parseText[i][p];
                }
                p++;
            }
            p++;
            while(p < parseText[i].length){
                if(parseText[i][p] != ' '){
                    value += parseText[i][p];
                }
                p++;
            }
            options[option] = value;
            p = 0;
            option = '';
            value = '';
        }
    }
    return options;
}

//Clear
function cleanDefault(){
    default_temp = {
        top: undefined,
        left: undefined,
        height: undefined,
        width: undefined,
        fontsize: undefined,
        transform: undefined,
        style: undefined,
        numbers: undefined,
        fill: undefined,
        stroke: undefined,
        strokeSize: undefined,
        Opacity: undefined,
    }  
}
function clearOptions(){
    cleanDefault();
    slideNumElements = {};
}

//debug
function mostrarDatos(){
    console.log(slideNumElements);
}