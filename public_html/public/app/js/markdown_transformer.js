var id_slides_list = []; //Save the slides id for to delete all slides
var code_img = ''; //Variable to differentiate between code or imagen
var slides_list = []; //Slides list for to create index
var modeIndex = ''; //Full or parcial index
var id_figure = ''; //Save id for add figure a elements_list
var elements_list = {}; //Elements id list for to locate in text editor
var max_line = 0; //max_line for add text-editor
var manualFigure = true; //difference between graphic or text add figure
var mainSlide = '';
var numText = 0;

$(document).ready(function() {   
    $('#markdown-text').on('change', function() { 
        //Resetting
        for(var x = 0; x < id_slides_list.length; x++){
            Impressionist.prototype.deleteIdSlide(id_slides_list[x]);
        }
        modeIndex = '';
        id_slides_list = [];
        slides_list = [];
        elements_list = {};
        max_line = 0;
        //Preprocessing
        var preText = $('#markdown-text').val().split('\n');
        var text = '';
        for(var i = 0; i < preText.length; i++){
            if(preText[i] != ''){
                text += preText[i] + '\n\n';
            }
        }
        $('#markdown-text').val(text);
        //Markdown
        var content = $('#markdown-text').val();
        var source = markdown.toHTML(content);
        //console.log(source); //testing
        //Check error
        if(source[0] != 'start'){
            alert("An error occurred, please try again later");
            return;
        }
        //Index preprocessing
        if(source[1][0] == 'index'){
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
            };
            modeIndex = source[1][1];
            createSlideIndex("first", 0);
        };
        //console.log(slides_list); //testing
        //Processing
        for (var i = 1 ; i < source.length; ++i ) {
            process(source[i]);
            max_line += 2;
            //console.log(source); //testing
            //console.log(i); //testing
            //console.log(id_slides_list); //testing
            //console.log(elements_list); //testing
        };
    });
    $('#convert').click(function() { 
        //console.log(elements_list); //testing
        //console.log(max_line); //testing
        //console.log(id_slides_list); //testing
    });
}); 

var process = function(source){
    //Mode text (italic text, bold text, code, imagen, normal text)
    if(source[1] != undefined){
        switch(source[1][0]) {
            case "em":
                var mode = "em";
                source[1] = source[1][1];
                break;
            case "strong":
                var mode = "strong"
                source[1] = source[1][1];
                break;
            case "code":
                var mode = "normal";
                code_img = 'code';
                source[1] = source[1][1];
                break;
            case "img":
                var mode = "normal";
                code_img = 'img';
                source[1] = source[1][1];
                break;
            default:
                var mode = "normal";
                break;
        }   
    }
    switch(source[0]){
        case 'slide1':
            if(source[1] === undefined){
                var id = Impressionist.prototype.addSlideMD();
                id_slides_list.push(id);
                elements_list[id] = max_line;
                numText = 0;
                break;
            }
            else{
                if(modeIndex == 'f'){
                    createSlideIndex(source[1], 1);                   
                }
                var id = Impressionist.prototype.addSlideMD();
                id_slides_list.push(id);
                elements_list[id] = max_line;
                id = Impressionist.prototype.addFullsliderTextMD("title", source[1], mode, 0.0732064, 1.02489);
                id = id.substr(12, 4);
                elements_list[id] = max_line;
                mainSlide = source[1];
                numText = 0;
                break;
            }
            break;
        case 'slide2':
            if(source[1] === undefined){
                var id = Impressionist.prototype.addSlideMD();
                id_slides_list.push(id);
                elements_list[id] = max_line;
                numText = 0;
                break;
            }
            else{
                if(modeIndex == 'f'){
                    createSlideIndex(source[1], 2);
                }
                var id = Impressionist.prototype.addSlideMD();
                id_slides_list.push(id);
                elements_list[id] = max_line;
                id = Impressionist.prototype.addFullsliderTextMD("title", mainSlide, mode, 0.0732064, 1.02489);
                id = id.substr(12, 4);
                elements_list[id] = max_line;
                id = Impressionist.prototype.addFullsliderTextMD("subtitle", source[1], mode, 5.13089, 3.66492);
                id = id.substr(12, 4);
                elements_list[id] = max_line;
                numText = 0;
                break;
            }
            break;
        case 'tl1':
            var id =Impressionist.prototype.addFullsliderTextMD("title", source[1], mode, 5.66, 24.6);
            id = id.substr(12, 4);
            elements_list[id] = max_line;
            break;
        case 'tl2':
            var id = Impressionist.prototype.addFullsliderTextMD("subtitle", source[1], mode, 5.66, 24.6);
            id = id.substr(12, 4);
            elements_list[id] = max_line;
            break;
        case 'figure1':
            $('#drawRect').click();
            manualFigure = false;
            eventsSimulate();
            $('#editEnd').click();
            manualFigure = true;
            var id = id_figure.substr(12, 4);
            elements_list[id] = max_line;
            break;
        case 'figure2':
            $('#drawLine').click();
            manualFigure = false;
            eventsSimulate();
            $('#editEnd').click();
            manualFigure = true;
            var id = id_figure.substr(12, 4);
            elements_list[id] = max_line;
            break;
        case 'figure3':
            $('#drawEllipse').click();
            manualFigure = false;
            eventsSimulate();
            $('#editEnd').click();
            manualFigure = true;
            var id = id_figure.substr(12, 4);
            elements_list[id] = max_line;
            break;
        case 'figure4':
            $('#drawArrow').click();
            manualFigure = false;
            eventsSimulate();
            $('#editEnd').click();
            manualFigure = true;
            var id = id_figure.substr(12, 4);
            elements_list[id] = max_line;
            break;
        case 'p':
            switch(code_img){
                case 'code':
                    console.log('code');
                    var text = '<li>';
                    for(x = 0; x < source[1].length; x++){
                        text += source[1][x];
                        if(source[1][x] === '\n'){
                            text += '</li><li>'
                        }
                    }
                    text += '</li>'
                    var id = Impressionist.prototype.addFullsliderCodeMD(text);
                    id = id.substr(12, 4);
                    elements_list[id] = max_line;
                    code_img = '';
                    break;
                case 'img':
                    createImageFromDataUrl(source[1].src);
                    code_img = '';
                    break;
                default:
                    var top = 11.4202 + numText * 2;
                    var id = Impressionist.prototype.addFullsliderTextMD("normal", source[1], mode, top, 3.66032);
                    id = id.substr(12, 4);
                    elements_list[id] = max_line;
                    numText++;
                    break;
            }
    }
}

//Slide
var addSlideList = function(idSlide){
    id_slides_list.push(idSlide);
    restructureList(max_line, true, 'slide');
    elements_list[idSlide] = max_line;
    max_line += 2;
}
var deleteSlideList = function(idSlide){
    for(var i = 0; i < id_slides_list.length; i++){
        if(id_slides_list[i] == idSlide){
            id_slides_list.splice(i,1);
        }
    }
    var line = elements_list[idSlide];
    delete elements_list[idSlide];
    restructureList(line, false, 'slide');
    max_line -= 2;
    var notSlide = true;
    for(lock in elements_list){
        if(elements_list[lock] == line){
            for(i = 0; i < id_slides_list.length; i++){
                if(id_slides_list[i] == lock){
                    notSlide = false;
                }
            }
            if(notSlide){
                deleteElementList(lock);
            }  
        }
        if(!notSlide){
            break;
        }  
    }
}
function currentSlide(){
    var slide = $("[style='z-index: 1;']").attr('id');
    slide = slide.substr(17, 4);
    return elements_list[slide];
}

//Elements
var deleteElementList = function(idElement){
    if(idElement.length > 4){
        idElement = idElement.substr(12, 4);
        console.log('Hola')
    }
    var line = elements_list[idElement];
    restructureList(line, false, '');
    delete elements_list[idElement];
    max_line -= 2;
}

//Text, code
var addTextList = function(idText, type){
    var lineSlide = currentSlide();
    restructureList(lineSlide+2, true, type);
    idText = idText.substr(12, 4);
    elements_list[idText] = lineSlide + 2;
    max_line += 2;
}
var addCodeList = function(idCode){
    var lineSlide = currentSlide();
    restructureList(lineSlide+2, true, 'code');
    idCode = idCode.substr(12, 4);
    elements_list[idCode] = lineSlide + 2;
    max_line += 2;
}

//Figures
function eventsSimulate(){
    var eventDown = document.createEvent("MouseEvents");
    var eventMove = document.createEvent("MouseEvents");
    var eventUp= document.createEvent("MouseEvents");
    eventDown.initMouseEvent("mousedown", false, true, window, 0, 0, 0, 295, 210, false, false, false, false, 0, null);
    document.getElementById('canvas').dispatchEvent(eventDown);
    eventMove.initMouseEvent("mousemove", false, true, window, 0, 0, 0, 395, 310, false, false, false, false, 0, null);
    document.getElementById('canvas').dispatchEvent(eventMove);
    eventUp.initMouseEvent("mouseup", false, true, window, 0, 0, 0, 395, 310, false, false, false, false, 0, null);
    document.getElementById('canvas').dispatchEvent(eventUp);
}
var takeIdFigure = function(id){
    id_figure = id;
}
var addFigureList = function(idFigure, type){
    if(manualFigure){
        var lineSlide = currentSlide();
        restructureList(lineSlide+2, true, type);
        idFigure = idFigure.substr(12, 4);
        elements_list[idFigure] = lineSlide + 2;
        max_line += 2;
    }
}

//Index
function createSlideIndex(name, orden){
    var position = 0; //Number of slide
    var range = 0; //Slide level
    var y = 0;
    var current = false;
    var open = false;
    var level = false;
    var long = (slides_list.length / 2); //Slide space
    
    var id = Impressionist.prototype.addSlideMD();
    id_slides_list.push(id);
    //elements_list[id] = max_line;
    //max_line += 2;
    
    while (y <= slides_list.length - 1){
        var j = y;
        while (slides_list[j] == 2){
            if(slides_list[j+1] == name){
                level = true;
            }
            j += 2;
        }
        if(slides_list[y+1] == name){
            current = true;
            open = true;
        }
        range = moreRange(slides_list[y]);
        
        if(open && (orden == 1)){
            Impressionist.prototype.addFullsliderTextIndexMD(slides_list[y+1], position, range, current, long);
            position = morePosition(position, long);
            if(slides_list[y+2] == 1){
                open = false;
            }
        }
        else if(level && orden == 2){
                id = Impressionist.prototype.addFullsliderTextIndexMD(slides_list[y+1], position, range, current, long);
                //id = id.substr(12, 4);
                //elements_list[id] = max_line;
                //max_line += 2;
                position = morePosition(position, long);
                if(slides_list[y+2] == 1){
                    level = false;
                }
            }
            else{
                if(slides_list[y] != 2){
                    id = Impressionist.prototype.addFullsliderTextIndexMD(slides_list[y+1], position, range, current, long);
                    //id = id.substr(12, 4);
                    //elements_list[id] = max_line;
                    //max_line += 2;
                    position = morePosition(position, long);
                }
            }
        range = 0;
        current = false;
        y += 2;
    } 
}
function morePosition(position, long){
    return position += (30 / long);
}
function moreRange(num){
    return Math.pow(2, num);
}

//Text-editor
function restructureList(modified, add, type){
    var preText = $('#markdown-text').val().split('\n');
    var preElement = preText[modified];
    //console.log(preElement); //testing
    //console.log(modified); //testing
    //console.log(preText); //testing
    var text = '';
    if(preText.length == 1){
        text = '#\n\n';
    }
    else{
        for(var i = 0; i <= preText.length-1; i++){
            //console.log(i); //testing
            if(i == modified){
                if(add){
                    switch(type){
                        case 'slide':
                            text += '#\n\n';
                            break;
                        case 'normal':
                            text += 'Sample Text\n\n';
                            break;
                        case 'title':
                            text += '-Sample Text-\n\n';
                            break;
                        case 'subtitle':
                            text += '--Sample Text--\n\n';
                            break;
                        case 'code':
                            text += '`function example(){ alert(); }`\n\n'
                            break;
                        case 'rect':
                            text += '>\n\n'
                            break;
                        case 'line':
                            text += '>>\n\n'
                            break;
                        case 'ellipse':
                            text += '>>>\n\n'
                            break;
                        case 'arrow':
                            text += '>>>>\n\n'
                            break;
                    }                    
                }
                else{
                    //To delete
                } 
            }
            else{
                if(preElement != '' && i > modified && add){
                    text += preElement + '\n\n';
                    preElement = preText[i];
                }
                else{
                    if(preText[i] != ''){
                        text += preText[i] + '\n\n';
                    }
                }
                
            }
            //console.log(text); //testing
        }
    }
    $('#markdown-text').val(text);
    
    for(lock in elements_list){
        if(elements_list[lock] >= modified){
            if(add){
                elements_list[lock] += 2;
            }
            else{
                elements_list[lock] -= 2;
            }
        }
    }
}
