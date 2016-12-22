var id_slides_list = []; //Save the slides id for to delete all slides
var code_img = ''; //Variable to differentiate between code or imagen
var slides_list = []; //Slides list for to create index
var modeIndex = ''; //Full or parcial index
var id_figure = ''; //Save id for add figure a elements_list
var elements_list = {}; //Elements id list for to locate in text editor
var max_line = 0; //max_line for add text-editor

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
                        case 'slide3':
                            slides_list.push(3);
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
        console.log(elements_list); //testing
        console.log(max_line); //testing
        /*for(key in elements_list){
            elements_list[key] += 2;
            console.log(elements_list[key]);
        }
        //var test = $("[style='z-index: 1;']").attr('id');
        //console.log(test);
        //console.log(elements_list); //testing
        var max_lines = $('#markdown-text').val().split('\n');
        var text = '';
        for(var i = 0;i < max_lines.length;i++){
            //max_lines[i] += '\n\n';
            //text += max_lines[i];
            console.log(max_lines[i]); //testing
        }*/
        //$('#markdown-text').val(max_lines);
    }); //testing
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
                break;
            }
            else{
                if(modeIndex == 'f'){
                    createSlideIndex(source[1], 1);
                }
                var id = Impressionist.prototype.addSlideMD();
                id_slides_list.push(id);
                elements_list[id] = max_line;
                id = Impressionist.prototype.addFullsliderTextMD("title", source[1], mode);
                id = id.substr(12, 4);
                elements_list[id] = max_line;
                break;
            }
            break;
        case 'slide2':
            if(source[1] === undefined){
                var id = Impressionist.prototype.addSlideMD();
                id_slides_list.push(id);
                elements_list[id] = max_line;
                break;
            }
            else{
                if(modeIndex == 'f'){
                    createSlideIndex(source[1], 2);
                }
                var id = Impressionist.prototype.addSlideMD();
                id_slides_list.push(id);
                elements_list[id] = max_line;
                id = Impressionist.prototype.addFullsliderTextMD("subtitle", source[1], mode);
                id = id.substr(12, 4);
                elements_list[id] = max_line;
                break;
            }
            break;
        case 'slide3':
            if(source[1] === undefined){
                var id = Impressionist.prototype.addSlideMD();
                id_slides_list.push(id);
                elements_list[id] = max_line;
                break;
            }
            else{
                if(modeIndex == 'f'){
                    createSlideIndex(source[1], 3);
                }
                var id = Impressionist.prototype.addSlideMD();
                id_slides_list.push(id);
                elements_list[id] = max_line;
                id = Impressionist.prototype.addFullsliderTextMD("subtitle", source[1], mode);
                id = id.substr(12, 4);
                elements_list[id] = max_line;
                break;
            }
            break;
        case 'tl1':
            var id =Impressionist.prototype.addFullsliderTextMD("title", source[1], mode);
            id = id.substr(12, 4);
            elements_list[id] = max_line;
        case 'tl2':
            var id = Impressionist.prototype.addFullsliderTextMD("subtitle", source[1], mode);
            id = id.substr(12, 4);
            elements_list[id] = max_line;
            break;
        case 'figure1':
            $('#drawRect').click();
            eventsSimulate();
            $('#editEnd').click();
            var id = id_figure.substr(12, 4);
            elements_list[id] = max_line;
            break;
        case 'figure2':
            $('#drawmax_line').click();
            eventsSimulate();
            $('#editEnd').click();
            var id = id_figure.substr(12, 4);
            elements_list[id] = max_line;
            break;
        case 'figure3':
            $('#drawEllipse').click();
            eventsSimulate();
            $('#editEnd').click();
            var id = id_figure.substr(12, 4);
            elements_list[id] = max_line;
            break;
        case 'figure4':
            $('#drawArrow').click();
            eventsSimulate();
            $('#editEnd').click();
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
                    var id = Impressionist.prototype.addFullsliderTextMD("normal", source[1], mode);
                    id = id.substr(12, 4);
                    elements_list[id] = max_line;
                    break;
            }
    }
}

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
    
}

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

function createSlideIndex(name, orden){
    var position = 0;
    var range = 0;
    var current = false;
    //var open = false;
    var long = (slides_list.length / 2);
    var y = 0;
    
    var id = Impressionist.prototype.addSlideMD();
    id_slides_list.push(id);
    elements_list.push(id);
    
    while (y <= slides_list.length - 1){
        if(slides_list[y+1] == name){
            current = true;
            //open = true;
        }
        range = moreRange(slides_list[y]);
        
        
        /*if(open && (orden == 1)){
            if(slides_list[y] != 3){
                //text, position, range, current, long
                Impressionist.prototype.addFullsliderTextIndexMD(slides_list[y+1], position, range, current, long);
                position = morePosition(position, long);
                if(slides_list[y+2] == 1){
                    open = false;
                }
            }
        }else if(open && (orden == 2)){
                //text, position, range, current, long
                Impressionist.prototype.addFullsliderTextIndexMD(slides_list[y+1], position, range, current, long);
                position = morePosition(position, long);
                if((slides_list[y+2] == 1) || (slides_list[y+2] == 2)){
                    open = false;
                }
            }else if(open && (orden == 3)){
                    //text, position, range, current, long
                    Impressionist.prototype.addFullsliderTextIndexMD(slides_list[y+1], position, range, current, long);
                    position = morePosition(position, long);
                    if((slides_list[y+2] == 1) || (slides_list[y+2] == 2)){
                        open = false;
                    }
                }else if(orden == 2){
                        if(slides_list[y] != 3){
                            //text, position, range, current, long
                            Impressionist.prototype.addFullsliderTextIndexMD(slides_list[y+1], position, range, current, long);
                            position = morePosition(position, long);
                        }
                        //text, position, range, current, long
                        Impressionist.prototype.addFullsliderTextIndexMD(slides_list[y+1], position, range, current, long);
                        position = morePosition(position, long);
                    }else if((slides_list[y] != 2) && (slides_list[y] != 3)){*/
                        //text, position, range, current, long
                        id = Impressionist.prototype.addFullsliderTextIndexMD(slides_list[y+1], position, range, current, long);
                        id = id.substr(12, 4);
                        elements_list.push(id);
                        position = morePosition(position, long);
                       // }
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

var takeIdFigure = function(id){
    id_figure = id;
}

function restructureList(modified, add, type){
    var preText = $('#markdown-text').val().split('\n');
    console.log('--------');
    console.log(modified);
    console.log(preText); //testing
    console.log(preText.length); //testing
    var text = '';
    if(preText.length == 1){
        text = '#\n\n';
    }
    else{
        for(var i = 0; i <= preText.length-1; i++){
            console.log(i);
            if(i == modified){
                if(preText != ''){
                    if(add){
                        switch(type){
                            case 'slide':
                                text += '#\n\n';
                                break;
                        }                    
                    }
                    else{
                        //To delete
                    }
                }   
            }
            else{
                if(preText[i] != ''){
                    text += preText[i] + '\n\n';
                }
            }
            console.log(text); //testing
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




