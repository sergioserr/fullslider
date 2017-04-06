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
default_temp = {
    top: undefined,
    left: undefined,
}
function NumElements(){
    this.numText = 0;
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
}
function lessElement(type, quantity){
    switch(type){
        case 'text':
            if(slideNumElements[obtainSlide()] != undefined){
                slideNumElements[obtainSlide()].numText -= quantity;
            }
            break;
    }
}

//Modify elements
function modifyElement(element){
    var options = parserElement(element);
    var textOptions = '';
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
            options.top = default_title.top;
            options.left = default_title.left;
            break;
        case 'subtitle':
            options.top = default_subtitle.top;
            options.left = default_subtitle.left;
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

//Set temporal options
function set_temp(options){
    var options = options.split(',');
    var option = '';
    var value = '';
    for(var op = 0; op < options.length; op++){
        if(options[op] != ''){
            option = obtainOption(options[op]);
            value = obtainValue(options[op]);
            switch(option){
                case 'top':
                    default_temp.top = value;
                    break;
                case 'left':
                    default_temp.left = value;
                    break;
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

////debug
//function mostrarDatos(){
//    console.log(slideNumElements);
//}