//Defaults variables
default_text = {
    top: 11.4202,
    left: 3.66032,
}
default_title = {
    top: 0.0732064,
    left: 1.02489,
}
default_subtitle = {
    top: 5.13089,
    left: 3.66492,
}
default_code = {
    top: 5.66,
    left: 24.6,
}
default_figure = {
    top: 6.44788,
    left: 5.83935,
//    height: 6.918,
//    width: 6.918,
}
default_temp = {
    top: undefined,
    left: undefined,
//    height: undefined,
//    width: undefined,
}
function NumElements(){
    this.numText = 0;
    this.numElem = 0;
    this.numTitle = 0;
    this.numSub = 0;
    this.numFigure = 0;
    this.numCode = 0;
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
        case 'figure':
            if(slideNumElements[obtainSlide()] != undefined){
                slideNumElements[obtainSlide()].numFigure -= quantity;
                slideNumElements[obtainSlide()].numElem -= quantity;
            }
            break;
    }
}

//Modify elements
function modifyElement(element){
    var options = parserElement(element);
    var type = element.getAttribute('data-type')
//    console.log(type); //debug
    var textOptions = '';
//    console.log(options); //debug
    for(option in options){
        switch(option){
            case 'top':
                textOptions += option + ':' + " '"; 
                var n = 0;
                while(options[option][n] != 'v'){
                    textOptions += options[option][n];
                    n++;
                }
                 textOptions += "',";
                break;
            case 'left':
                textOptions += option + ':' + " '"; 
                var n = 0;
                while(options[option][n] != 'v'){
                    textOptions += options[option][n];
                    n++;
                }
                 textOptions += "',";
                break;
//            case 'width':
//                if(type == 'graphic'){
//                    textOptions += option + ':' + " '"; 
//                    var n = 0;
//                    while(options[option][n] != 'v'){
//                        textOptions += options[option][n];
//                        n++;
//                    }
//                     textOptions += "',";
//                }
//                break;
//            case 'height':
//                if(type == 'graphic'){
//                    textOptions += option + ':' + " '"; 
//                    var n = 0;
//                    while(options[option][n] != 'v'){
//                        textOptions += options[option][n];
//                        n++;
//                    }
//                     textOptions += "',";
//                }
//                break;
        }
    }
//    console.log(textOptions) //debug
    var id = element.getAttribute("id").substr(12, 4);
    addOptionsList(id, textOptions);
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
//        case 'height':
//            options.height = default_figure.height;
//            break;
//        case 'width':
//            options.width = default_figure.width;
//            break;
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
                    default_temp.top = parseInt(value);
                    break;
                case 'left':
                    default_temp.left = parseInt(value);
                    break;
//                case 'height':
//                    default_temp.height = parseInt(value);
//                    break;
//                case 'width':
//                    default_temp.width = parseInt(value);
//                    break;
            }
        }
    }
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
var parserElement = function(element){
    var parseText = element.getAttribute("style").split(';');
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