var id_slides_list = []; //Save the slides id for to delete all slides
var code_img = ''; //Variable to differentiate between code or imagen
var slides_list = []; //Slides list for to create index
var modeIndex = ''; //Full or parcial index
var id_figure = ''; //Save id for add figure a elements_list
var elements_list = {}; //Elements id list for to locate in text editor
var spaceLines = []; //White lines in text editor
var max_line = 0; //max_line for add text-editor
var manualFigure = true; //difference between graphic or text add figure
var mainSlide = ''; //save the slide title for subslides
var numText = 0; //quantity lines of text for organize in the slide

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
        spaceLines = [];
        //Preprocessing
        processingText();
        //Markdown
        var content = $('#markdown-text').val();
        var source = markdown.toHTML(content);
        //console.log(source); //debug
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
        //console.log(slides_list); //debug
        //Processing
        for (var i = 1 ; i < source.length; ++i ) {
            process(source[i]);
            max_line++;
            console.log("Maxline++ " + max_line); //debug
            while(spaceLines.includes(max_line)){
//                spaceLines.shift;
                max_line++;
                console.log("Maxline++ " + max_line); //debug
            }
            //console.log(source); //debug
            //console.log(i); //debug
            //console.log(id_slides_list); //debug
        };
        deleteSpaces();
    });
    $('#convert').click(function() {
        console.log(elements_list); //debug
        console.log("Espacios " + spaceLines); //debug
        console.log("Max line " + max_line); //debug
        console.log(id_slides_list); //debug
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
                max_line++;
                console.log("Maxline++ " + max_line); //debug
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
                max_line++;
                console.log("Maxline++ " + max_line); //debug
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
                max_line++;
                console.log("Maxline++ " + max_line); //debug
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
                max_line++;
                console.log("Maxline++ " + max_line); //debug
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
            max_line++;
            console.log("Maxline++ " + max_line); //debug
            break;
        case 'figure2':
            $('#drawLine').click();
            manualFigure = false;
            eventsSimulate();
            $('#editEnd').click();
            manualFigure = true;
            var id = id_figure.substr(12, 4);
            elements_list[id] = max_line;
            max_line++;
            console.log("Maxline++ " + max_line); //debug
            break;
        case 'figure3':
            $('#drawEllipse').click();
            manualFigure = false;
            eventsSimulate();
            $('#editEnd').click();
            manualFigure = true;
            var id = id_figure.substr(12, 4);
            elements_list[id] = max_line;
            max_line++;
            console.log("Maxline++ " + max_line); //debug
            break;
        case 'figure4':
            $('#drawArrow').click();
            manualFigure = false;
            eventsSimulate();
            $('#editEnd').click();
            manualFigure = true;
            var id = id_figure.substr(12, 4);
            elements_list[id] = max_line;
            max_line++;
            console.log("Maxline++ " + max_line); //debug
            break;
        case 'p':
            switch(code_img){
                case 'code':
                    var lines = multiElement(max_line, 'code');
                    //console.log(lines); //debug
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
                    elements_list[id] = lines;
                    max_line += lines.length;
                    console.log("Maxline+ " + lines.length + " " + max_line); //debug
                    code_img = '';
                    break;
                case 'img':
                    createImageFromDataUrl(source[1].src);
                    code_img = '';
                    break;
                default:
                    var lines = multiElement(max_line, 'text');
                    //console.log(lines) //debug
                    var top = 11.4202 + numText * 2;
                    var id = Impressionist.prototype.addFullsliderTextMD("normal", source[1], mode, top, 3.66032);
                    id = id.substr(12, 4);
                    elements_list[id] = lines;
                    max_line += lines.length;
                    console.log("Maxline+ " + lines.length + " " + max_line); //debug
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
    spaceLines.push(max_line+1);
    max_line += 2;
    console.log("Maxline+2 " + max_line); //debug
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
    max_line--;
    console.log("Maxline--" + max_line); //debug
    if(spaceLines.includes(line)){
        for(s = 0; s < spaceLines.length; s++){
            if(line == spaceLines[s]){
                spaceLines.splice(s, 1);
            }
        }
        restructureList(line, false, 'slide');
        max_line--;
        console.log("Maxline-- " + max_line); //debug
    }
    var notSlide = true;
    for(lock in elements_list){
        console.log("lock " + lock); //debug
        //console.log(elements_list); //debug
        //console.log("elements_list[lock] " + elements_list[lock]); //debug
        var aux = compareLines(elements_list[lock], line);
        console.log(aux); //debug
        if(aux){
            for(iS = 0; iS < id_slides_list.length; iS++){
                if(id_slides_list[iS] == lock){
                    notSlide = false;
                }
            }
            if(notSlide){
                deleteElementList(lock);
            }  
        }
        if(!notSlide){
            con = false;
            break;
        }  
    }
    processingText();
    deleteSpaces();
}
function compareLines(lineElement, line){
    if(lineElement.length != undefined){
        //console.log('Multi'); //debug
        return lineElement.includes(line);
    }
    else{
        //console.log('NOMulti'); //debug
        //console.log(lineElement); //debug
        //console.log(line); //debug
        return lineElement == line;
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
    }
    var lineElement = elements_list[idElement];
    console.log(lineElement.length)
    if(lineElement.length != undefined){
        var line = lineElement[0];
        for(var i = 0; i < lineElement.length; i++){
            restructureList(line, false, '');
//            elements_list[idElement].splice(0,1);
            console.log("Hola " + line)
        }
        max_line -= lineElement.length;
        console.log("Maxline- " + lineElement.length + " " + max_line); //debug
    }
    else{
        restructureList(lineElement, false, '');
        max_line--;
        console.log("Maxline-- " + max_line); //debug
    }
    delete elements_list[idElement];
//    deleteSpaces();
}

//Text, code
var addTextList = function(idText, type){
    var lineSlide = currentSlide();
    restructureList(lineSlide+2, true, type);
    idText = idText.substr(12, 4);
    elements_list[idText] = lineSlide + 2;
    spaceLines.push(max_line+1);
    max_line += 2;
    console.log("Maxline+2 " + max_line); //debug
}
var addCodeList = function(idCode){
    var lineSlide = currentSlide();
    restructureList(lineSlide+2, true, 'code');
    idCode = idCode.substr(12, 4);
    elements_list[idCode] = lineSlide + 2;
    spaceLines.push(max_line+1);
    max_line += 2;
    console.log("Maxline+2 " + max_line); //debug
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
        spaceLines.push(max_line+1);
        max_line += 2;
        console.log("Maxline+2 " + max_line); //debug
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
function processingText(){
    spaceLines = [];
    var preText = $('#markdown-text').val().split('\n');
    var text = '';
    var preTextLine = 0;
    var textLine = 0;
    var firstElement = false;
    var last = preText.length - 1;
    //console.log(preText.length); //debug
    while(preTextLine <= last){
        if(preText[preTextLine] != '' || firstElement){ //This avoid white line in first position
            firstElement = true;
            if(preText[preTextLine] == '' && preText[preTextLine+1] == '' && preTextLine != (last)){ //This avoid white lines consecutives
                // To delete
            }
            else if(preText[preTextLine][0] == '#'){ //This add a white line after slides
                if(preText[preTextLine+1] != ''){
                    text += preText[preTextLine] + '\n\n';
                    textLine++;
                    spaceLines.push(textLine++);
                }
                else{
                    text += preText[preTextLine] + '\n';
                    textLine++;
                }
            }
            else if(preText[preTextLine][0] == '>'){ //This add a white line after figures
                if(preText[preTextLine+1] != ''){
                    text += preText[preTextLine] + '\n\n';
                    textLine++;
                    spaceLines.push(textLine++);
                }
                else{
                    text += preText[preTextLine] + '\n';
                    textLine++;
                }
            }
            else{ //Added normal 
                if (preText[preTextLine] == ''){ //Last white line of white lines consecutives
                    spaceLines.push(textLine);
                }
                text += preText[preTextLine] + '\n';
                textLine++;
            }
        }
        //console.log(text); //debug
        preTextLine++;
    }
    if(text[text.length-1] != ' '){ //This add a final white line
        text += '\n'
        spaceLines.push(textLine);
    }
    $('#markdown-text').val(text);
}
function restructureList(modified, add, type){
    var preText = $('#markdown-text').val().split('\n');
    var preElement = preText[modified];
    //console.log(preElement); //debug
    //console.log(modified); //debug
    //console.log(preText); //debug
    var text = '';
    if(preText.length == 1){ //First initialize
        text = '#\n\n';
    }
    else{
        for(var rL = 0; rL <= preText.length-1; rL++){
            //console.log(rL); //debug
            if(rL == modified){
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
                if(preElement != '' && rL > modified && add){
                    text += preElement + '\n\n';
                    preElement = preText[rL];
                }
                else{
                    if(preText[rL] != ''){
                        text += preText[rL] + '\n';
                    }
                    else{
                        if(rL != preText.length-1){
                            text += '\n';
                        }
                    }
                }
                
            }
            //console.log(text); //debug
            //console.log('-------------------------'); //debug
        }
    }
    $('#markdown-text').val(text);
    
    for(lock in elements_list){
        if(elements_list[lock].length != undefined){
            for(var m = 0; m < elements_list[lock].length; m++){
                if(elements_list[lock][m] >= modified){
                    if(add){
                        elements_list[lock][m] += 2;
                    }
                    else{
                        elements_list[lock][m] -= 1;
                    }
                }
            }
        }
        else{
            if(elements_list[lock] >= modified){
                if(add){
                    elements_list[lock] += 2;
                }
                else{
                    elements_list[lock] -= 1;
                }
            }
        }
    }
    for(s = 0; s < spaceLines.length; s++){
        if(spaceLines[s] >= modified){
            if(add){
                spaceLines[s] += 2;
            }
            else{
                spaceLines[s] -= 1;
            }
        }
    }
}
function multiElement(line, type){
    var lines = [];
    //console.log(line); //debug
    var text = $('#markdown-text').val().split('\n');
    //console.log(text) //debug
    switch(type){
        case 'code':
            var n = 1;
            for(var l = line; l < text.length; l++){
                lines.push(l);
                var c = 0;
                while(c < text[l].length){
                    if(text[l][c] == '`'){
                        if(n == 2){
                            return lines;
                        }
                        n++;
                    }
                    c++;
                }
            }
            break;
        case 'text':
            for(var l = line; l < text.length; l++){
                if(text[l] == ""){
                    return lines;
                }
                lines.push(l);
            }
            break;
    }
    return lines;
}
function deleteSpaces(){
    var sp = 0;
    while(sp < spaceLines.length){
        if(spaceLines[sp+1] == spaceLines[sp] + 1 || spaceLines[sp+1] == spaceLines[sp]){
            spaceLines.splice(sp, 1);
            restructureList(spaceLines[sp], false, '');
            max_line--;
            console.log("Maxline-- " + max_line); //debug
        }
        else{
            sp++;
        }
    }
}