// Environment Variables
var source = undefined; //Content for process markdown
var id_slides_list = []; //Save the slides id for to delete all slides
var code_img = ''; //Variable to differentiate between code or imagen
var slides_list = []; //Slides list for to create index
var modeIndex = ''; //Full or parcial index
var id_index_slides = []; //Save id for index slides control
var id_figure = ''; //Save id for add figure a elements_list
var url_image = ''; //Save id for add image a elements_list
var elements_list = {}; //Elements id list for to locate in text editor
var spaceLines = []; //White lines in text editor
var max_line = 0; //Max_line for add text editor
var manualFigure = true; //Difference between graphic or text add figure
var manualImage = true; //Difference between graphic or text add image
var optionsLines = []; //Options lines in text editor
var typeElements = {}; //Type of element for each element of the presentation
var imagesListProcess = {}; //Save the images for adding later

$(document).ready(function() {   
    $('#markdown-text').on('change', function() { 
        change = false;
        old_slides = id_slides_list.slice();
        // Resetting
        for(var x = 0; x < id_slides_list.length; x++){
            Impressionist.prototype.deleteIdSlide(id_slides_list[x]);
        }
        resetAll();
        // Preprocessing
        processingText();
        // Markdown
        var content = $('#markdown-text').val();
        source = markdown.toHTML(content);
        // Check error
        if(source[0] != 'start'){
            alert("An error occurred, please try again later");
            return;
        }
        // Processing
        for (var i = 1 ; i < source.length; ++i ) {
            process(source[i]);
            max_line++;
            while(spaceLines.includes(max_line)){
                max_line++;
            }
        };
        deleteSpaces();
        initializeUndoRedo();
        change = true;
    });
}); 

var process = function(source){
    // Mode text (italic text, bold text, code, imagen, normal text)
    if(source[1] != undefined){
        switch(source[1][0]) {
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
            if(source[1] == undefined){
                var id = Impressionist.prototype.addSlideMD();
                id_slides_list.push(id);
                elements_list[id] = max_line;
                typeElements[id] = 'slide1';
                addNumElementsSlide(id);
                break;
            }
            else{
                if(modeIndex == 'f'){
                    createSlideIndex(source[1], 1);                   
                }
                var id = Impressionist.prototype.addSlideMD();
                id_slides_list.push(id);
                elements_list[id] = max_line;
                addNumElementsSlide(id);
                typeElements[id] = 'slide1';
                var p = 1;
                var p1 = 1;
                var proText = '';
                var temText = '';
                while(source[p] != undefined){
                    if((typeof source[p]) != "string"){
                        while(p1 < source[p].length){
                            if((typeof source[p][p1]) != "string"){
                                temText += '<' + source[p][p1][0] + '>' + source[p][p1][1] + '</' + source[p][p1][0] + '>';
                            }
                            else{
                                temText += source[p][p1];
                            }
                            p1++;
                        }
                        p1 = 1;
                        proText += '<' + source[p][0] + '>' + temText + '</' + source[p][0] + '>';
                        temText = '';
                    }
                    else{
                        proText += source[p];
                    }
                    p++;
                }
                id = Impressionist.prototype.addFullsliderTextMD("title", proText);
                id = id.substr(12, 4);
                elements_list[id] = max_line;
                typeElements[id] = 'titleS';
                moreTitle(1);
                break;
            }
            break;
        case 'slide2':
            if(source[1] == undefined){
                var id = Impressionist.prototype.addSlideMD();
                id_slides_list.push(id);
                elements_list[id] = max_line;
                typeElements[id] = 'slide2';
                addNumElementsSlide(id);
                break;
            }
            else{
                if(modeIndex == 'f'){
                    createSlideIndex(source[1], 2);
                }
                var id = Impressionist.prototype.addSlideMD();
                id_slides_list.push(id);
                elements_list[id] = max_line;
                addNumElementsSlide(id);
                typeElements[id] = 'slide2';
                var p = 1;
                var p1 = 1;
                var proText = '';
                var temText = '';
                while(source[p] != undefined){
                    if((typeof source[p]) != "string"){
                        while(p1 < source[p].length){
                            if((typeof source[p][p1]) != "string"){
                                temText += '<' + source[p][p1][0] + '>' + source[p][p1][1] + '</' + source[p][p1][0] + '>';
                            }
                            else{
                                temText += source[p][p1];
                            }
                            p1++;
                        }
                        p1 = 1;
                        proText += '<' + source[p][0] + '>' + temText + '</' + source[p][0] + '>';
                        temText = '';
                    }
                    else{
                        proText += source[p];
                    }
                    p++;
                }
                id = Impressionist.prototype.addFullsliderTextMD("subtitle", proText);
                id = id.substr(12, 4);
                elements_list[id] = max_line;
                typeElements[id] = 'subtitleS';
                moreSub(1);
                break;
            }
            break;
        case 'options':
            optionsLines.push(max_line);
            set_temp(source[1]);
            break;
        case 'tl1':
            var p = 1;
            var p1 = 1;
            var proText = '';
            var temText = '';
            while(source[p] != undefined){
                if((typeof source[p]) != "string"){
                    while(p1 < source[p].length){
                        if((typeof source[p][p1]) != "string"){
                            temText += '<' + source[p][p1][0] + '>' + source[p][p1][1] + '</' + source[p][p1][0] + '>';
                        }
                        else{
                            temText += source[p][p1];
                        }
                        p1++;
                    }
                    p1 = 1;
                    proText += '<' + source[p][0] + '>' + temText + '</' + source[p][0] + '>';
                    temText = '';
                }
                else{
                    proText += source[p];
                }
                p++;
            }
            var id = Impressionist.prototype.addFullsliderTextMD("title", proText);
            id = id.substr(12, 4);
            elements_list[id] = max_line;
            typeElements[id] = 'title';
            moreTitle(1);
            break;
        case 'tl2':
            var p = 1;
            var p1 = 1;
            var proText = '';
            var temText = '';
            while(source[p] != undefined){
                if((typeof source[p]) != "string"){
                    while(p1 < source[p].length){
                        if((typeof source[p][p1]) != "string"){
                            temText += '<' + source[p][p1][0] + '>' + source[p][p1][1] + '</' + source[p][p1][0] + '>';
                        }
                        else{
                            temText += source[p][p1];
                        }
                        p1++;
                    }
                    p1 = 1;
                    proText += '<' + source[p][0] + '>' + temText + '</' + source[p][0] + '>';
                    temText = '';
                }
                else{
                    proText += source[p];
                }
                p++;
            }
            var id = Impressionist.prototype.addFullsliderTextMD("subtitle", proText);
            id = id.substr(12, 4);
            elements_list[id] = max_line;
            typeElements[id] = 'subtitle';
            moreSub(1);
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
            typeElements[id] = 'figure';
            moreFigure(1);
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
            typeElements[id] = 'figure';
            moreFigure(1);
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
            typeElements[id] = 'figure';
            moreFigure(1);
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
            typeElements[id] = 'figure';
            moreFigure(1);
            break;
        case 'ol':
            var lines = multiElement(max_line, 'list');
            var p = 1;
            var p1 = 1;
            var temText = '';
            var text = '<ol><li>';
            var proText = '';
            for(x = 1; x < source.length; x++){
                if(x != source.length-1){
                    while(source[x][p] != undefined){
                        if((typeof source[x][p]) != "string"){
                            while(p1 < source[x][p].length){
                                if((typeof source[x][p][p1]) != "string"){
                                    temText += '<' + source[x][p][p1][0] + '>' + source[x][p][p1][1] + '</' + source[x][p][p1][0] + '>';
                                }
                                else{
                                    temText += source[x][p][p1];
                                }
                                p1++;
                            }
                            p1 = 1;
                            proText += '<' + source[x][p][0] + '>' + temText + '</' + source[x][p][0] + '>';
                            temText = '';
                        }
                        else{
                            proText += source[x][p];
                        }
                        p++;
                    }
                    text += proText + '</li><li>';
                    proText = '';
                }
                else{
                    while(source[x][p] != undefined){
                        if((typeof source[x][p]) != "string"){
                            while(p1 < source[x][p].length){
                                if((typeof source[x][p][p1]) != "string"){
                                    temText += '<' + source[x][p][p1][0] + '>' + source[x][p][p1][1] + '</' + source[x][p][p1][0] + '>';
                                }
                                else{
                                    temText += source[x][p][p1];
                                }
                                p1++;
                            }
                            p1 = 1;
                            proText += '<' + source[x][p][0] + '>' + temText + '</' + source[x][p][0] + '>';
                            temText = '';
                        }
                        else{
                            proText += source[x][p];
                        }
                        p++;
                    }
                    text += proText + '</li>';
                    proText = '';
                }
                p = 1;
            }
            text += '</li></ol>'
            var id = Impressionist.prototype.addFullsliderListMD(text);
            id = id.substr(12, 4);
            elements_list[id] = lines;
            max_line += lines.length - 1;
            max_line--;
            moreText(lines.length - 1);
            typeElements[id] = 'text';
            break;
        case 'ul':
            var lines = multiElement(max_line, 'list');
            var p = 1;
            var p1 = 1;
            var temText = '';
            var text = '<ul><li>';
            var proText = '';
            for(x = 1; x < source.length; x++){
                if(x != source.length-1){
                    while(source[x][p] != undefined){
                        if((typeof source[x][p]) != "string"){
                            while(p1 < source[x][p].length){
                                if((typeof source[x][p][p1]) != "string"){
                                    temText += '<' + source[x][p][p1][0] + '>' + source[x][p][p1][1] + '</' + source[x][p][p1][0] + '>';
                                }
                                else{
                                    temText += source[x][p][p1];
                                }
                                p1++;
                            }
                            p1 = 1;
                            proText += '<' + source[x][p][0] + '>' + temText + '</' + source[x][p][0] + '>';
                            temText = '';
                        }
                        else{
                            proText += source[x][p];
                        }
                        p++;
                    }
                    text += proText + '</li><li>';
                    proText = '';
                }
                else{
                    while(source[x][p] != undefined){
                        if((typeof source[x][p]) != "string"){
                            while(p1 < source[x][p].length){
                                if((typeof source[x][p][p1]) != "string"){
                                    temText += '<' + source[x][p][p1][0] + '>' + source[x][p][p1][1] + '</' + source[x][p][p1][0] + '>';
                                }
                                else{
                                    temText += source[x][p][p1];
                                }
                                p1++;
                            }
                            p1 = 1;
                            proText += '<' + source[x][p][0] + '>' + temText + '</' + source[x][p][0] + '>';
                            temText = '';
                        }
                        else{
                            proText += source[x][p];
                        }
                        p++;
                    }
                    text += proText + '</li>';
                    proText = '';
                }
                p = 1;
            }
            text += '</li></ul>'
            var id = Impressionist.prototype.addFullsliderListMD(text);
            id = id.substr(12, 4);
            elements_list[id] = lines;
            max_line += lines.length - 1;
            max_line--;
            moreText(lines.length - 1);
            typeElements[id] = 'text';
            break;
        case 'p':
            switch(code_img){
                case 'code':
                    var lines = multiElement(max_line, 'code');
                    var text = '<li>';
                    for(x = 0; x < source[1].length; x++){
                        text += source[1][x];
                        if(source[1][x] == '\n'){
                            text += '</li><li>'
                        }
                    }
                    text += '</li>'
                    var id = Impressionist.prototype.addFullsliderCodeMD(text);
                    id = id.substr(12, 4);
                    elements_list[id] = lines;
                    max_line += lines.length;
                    max_line--;
                    moreCode(lines.length - 1);
                    code_img = '';
                    typeElements[id] = 'code';
                    break;
                case 'img':
                    manualImage = false;
                    imagesListProcess[source[1].src] = [];
                    imagesListProcess[source[1].src].push(Impressionist.prototype.getSelectedSlide());
                    imagesListProcess[source[1].src].push(getOptions('image'));
                    imagesListProcess[source[1].src].push(max_line);
                    moreImage(1, Impressionist.prototype.getSelectedSlide());
                    $("#urlimageinput").val(source[1].src);
                    $("#urlimgform").submit();
                    code_img = '';
                    break;
                default:
                    var lines = multiElement(max_line, 'text');
                    var p = 1;
                    var p1 = 1;
                    var proText = '';
                    var temText = '';
                    while(source[p] != undefined){
                        if((typeof source[p]) != "string"){
                            while(p1 < source[p].length){
                                if((typeof source[p][p1]) != "string"){
                                    temText += '<' + source[p][p1][0] + '>' + source[p][p1][1] + '</' + source[p][p1][0] + '>';
                                }
                                else{
                                    temText += source[p][p1];
                                }
                                p1++;
                            }
                            p1 = 1;
                            proText += '<' + source[p][0] + '>' + temText + '</' + source[p][0] + '>';
                            temText = '';
                            if(source[p+1] == '\n'){
                                proText += '\n';
                                p++;
                            }
                        }
                        else{
                            proText += source[p];
                        }
                        p++;
                    }
                    var id = Impressionist.prototype.addFullsliderTextMD("normal", proText);
                    id = id.substr(12, 4);
                    elements_list[id] = lines;
                    max_line += lines.length;
                    max_line--;
                    moreText(lines.length);
                    typeElements[id] = 'text';
                    break;
            }
    }
    if(source[0] != 'options' && source[0] != 'hr'){
        cleanDefault();
    }
}

//Slide
var addSlideList = function(idSlide){
    id_slides_list.push(idSlide);
    restructureList(max_line, true, 'slide');
    elements_list[idSlide] = max_line;
    spaceLines.push(max_line+1);
    max_line += 2;
    addNumElementsSlide(idSlide);
    typeElements[idSlide] = 'slide1';
    changeContent();
    changeTextEditor();
}
var deleteSlideList = function(idSlide){
    for(var i = 0; i < id_slides_list.length; i++){
        if(id_slides_list[i] == idSlide){
            id_slides_list.splice(i,1);
        }
    }
    if(id_index_slides.length != 0){
        for(var i = 0; i < id_index_slides.length; i++){
            if(id_index_slides[i] == idSlide){
                id_index_slides = [];
//                restructureList(0, false, '');
//                max_line--;
//                restructureList(0, false, '');
//                max_line--;
                optionsLines.splice(0,1);
                modeIndex = '';
            }
        }
    }
    var line = elements_list[idSlide];
    delete elements_list[idSlide];
    removeNumElementsSlide(idSlide);
    delete typeElements[idSlide];
    for(lock in elements_list){
        if(elements_list[lock] == line){
            delete elements_list[lock];
        }
    }
    restructureList(line, false, 'slide');
    max_line--;
    if(spaceLines.includes(line)){
        for(s = 0; s < spaceLines.length; s++){
            if(line == spaceLines[s]){
                spaceLines.splice(s, 1);
            }
        }
        restructureList(line, false, 'slide');
        max_line--;
    }
    var notSlide = true;
    var l = 0;
    var locks = Object.keys(elements_list);
    var lock = '';
    var posibleTitle = false;
    var findOption = false;
    while(l <= locks.length-1){
        if(findOption){
            line -= 2;
            findOption = false;
        }
        if(optionsLines.includes(line)){
            if(modeIndex != '' && line == 0){
                
            }
            else{
                line += 2;
                findOption = true;
            }
        }
        var lock = locks[l];
        if(compareLines(elements_list[lock], line)){
            for(iS = 0; iS < id_slides_list.length; iS++){
                if(id_slides_list[iS] == lock){
                    notSlide = false;
                }
            }
            if(notSlide){
                if(posibleTitle){
                    deleteElementList(lock, true);
                    locks = Object.keys(elements_list);
                    l = 0;
                    posibleTitle = false;
                }
                else{
                    posibleTitle = true;
                    l++;
                    if(l == locks.length){
                        l = 0;
                    }
                }
            }  
        }
        else{
            l++;
        }
        if(!notSlide){
            break;
        }
        if((l == locks.length) && posibleTitle){
            l = 0;
        }
    }
    changeTextEditor();
}
function compareLines(lineElement, line){
    if(lineElement.length != undefined){
        return lineElement[0] == line;
    }
    else{
        return lineElement == line;
    }
}
function currentSlide(){
    var slide = $("[style='z-index: 1;']").attr('id');
    slide = slide.substr(17, 4);
    return elements_list[slide];
}

//Elements
var deleteElementList = function(idElement, fromSlide = false){
    if(idElement.length > 4){
        idElement = idElement.substr(12, 4);
    }
    var lineElement = elements_list[idElement];
    if(lineElement.length != undefined){
        lessElement(typeElements[idElement], lineElement.length);
        delete typeElements[idElement];
        var line = lineElement[0];
        if(optionsLines.includes(line-2)){
            if(modeIndex != '' && line-2 == 0){
                
            }
            else{
                line -= 2;
                for(op = 0; op < optionsLines.length; op++){
                    if(optionsLines[op] == line){
                        optionsLines.splice(op,1);
                    }
                }
                restructureList(line, false, '');
                max_line--;
                restructureList(line, false, '');
                max_line--;
            }
        }
        for(var i = 0; i < lineElement.length; i++){
            restructureList(line, false, '');
        }
        max_line -= lineElement.length;
        if(spaceLines.includes(line)){
            for(s = 0; s < spaceLines.length; s++){
                if(line == spaceLines[s]){
                    spaceLines.splice(s, 1);
                }
            }
            restructureList(line, false, '');
            max_line--;
        }
    }
    else{
        lessElement(typeElements[idElement], 1);
        delete typeElements[idElement];
        if(optionsLines.includes(lineElement-2)){
            if(modeIndex != '' && lineElement-2 == 0){
                
            }
            else{
                lineElement -= 2;
                for(op = 0; op < optionsLines.length; op++){
                    if(optionsLines[op] == lineElement){
                        optionsLines.splice(op,1);
                    }
                }
                restructureList(lineElement, false, '');
                max_line--;
                restructureList(lineElement, false, '');
                max_line--;
            }
        }
        restructureList(lineElement, false, '');
        max_line--;
        if(spaceLines.includes(lineElement)){
            for(s = 0; s < spaceLines.length; s++){
                if(lineElement == spaceLines[s]){
                    spaceLines.splice(s, 1);
                }
            }
            restructureList(lineElement, false, 'slide');
            max_line--;
        }
    }
    deleteSpaces();
    delete elements_list[idElement];
    if(!fromSlide){
        changeTextEditor();
    }
}

//Text, code
var addTextList = function(idText, type, text='Sample Text'){
    var lineSlide = currentSlide();
    restructureList(lineSlide+2, true, type, text);
    idText = idText.substr(12, 4);
    elements_list[idText] = lineSlide + 2;
    spaceLines.push(lineSlide + 3);
    max_line += 2;
    switch(type){
        case 'normal':
            moreText(1);
            typeElements[idText] = 'text';
            break;
        case 'title':
            moreTitle(1);
            typeElements[idText] = type;
            break;
        case 'subtitle':
            moreSub(1);
            typeElements[idText] = type;
            break;
    }
    changeTextEditor();
}
var addCodeList = function(idCode){
    var lineSlide = currentSlide();
    restructureList(lineSlide+2, true, 'code', undefined, 4);
    idCode = idCode.substr(12, 4);
    var lines = [];
    lines.push(lineSlide + 2);
    lines.push(lineSlide + 3);
    lines.push(lineSlide + 4);
    elements_list[idCode] = lines;
    spaceLines.push(lineSlide + 5);
    max_line += 4;
    typeElements[idCode] = 'code';
    moreCode(3);
    changeTextEditor();
}

//Figures
function eventsSimulate(){
    var options = getOptions('figure');
    var eventDown = document.createEvent("MouseEvents");
    var eventMove = document.createEvent("MouseEvents");
    var eventUp= document.createEvent("MouseEvents");
    eventDown.initMouseEvent("mousedown", false, true, window, 0, 0, 0, 295, 210, false, false, false, false, 0, null);
    document.getElementById('canvas').dispatchEvent(eventDown);
    var x = vwToPx(options.height - 0.5411255411255411) + 210;
    var y = vwToPx(options.width - 0.5411255411255411) + 295;
    eventMove.initMouseEvent("mousemove", false, true, window, 0, 0, 0, y, x, false, false, false, false, 0, null);
    document.getElementById('canvas').dispatchEvent(eventMove);
    eventUp.initMouseEvent("mouseup", false, true, window, 0, 0, 0, y, x, false, false, false, false, 0, null);
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
        spaceLines.push(lineSlide + 3);
        max_line += 2;
        typeElements[idFigure] = 'figure';
        moreFigure(1);
    }
}

//Images
var takeUrlImage = function(url){
    url_image = url;
}
var addImagesList = function(idElement, url=undefined){    
    if(manualImage){
        var lineSlide = currentSlide();
        restructureList(lineSlide+2, true, 'image');
        url_image = '';
        idElement = idElement.substr(12, 4);
        elements_list[idElement] = lineSlide + 2;
        spaceLines.push(lineSlide + 3);
        max_line += 2;
        typeElements[idElement] = 'image';
        changeTextEditor();
    }
    else{
        idElement = idElement.substr(12, 4);
        elements_list[idElement] = imagesListProcess[url].shift();
        delete imagesListProcess[url];
        typeElements[idElement] = 'image';
        if(Object.keys(imagesListProcess).length == 0){
            manualImage = true;
        }
    }
}

//Options
var addOptionsList = function(idElement, options){
    var lines = elements_list[idElement];
    if(typeElements[idElement] == 'text' || typeElements[idElement] == 'slide1' || typeElements[idElement] == 'slide2'
      || typeElements[idElement] == 'title' || typeElements[idElement] == 'subtitle' || typeElements[idElement] == 'figure' || typeElements[idElement] == 'code' || typeElements[idElement] == 'image' || typeElements[idElement] == 'titleS' || typeElements[idElement] == 'subtitleS'){
        if(lines.length != undefined){
            var line = lines[0];
            if(optionsLines.includes(line-2)){
                if(modeIndex != '' && line-2 == 0){
                    
                }
                else{
                    line -= 2;
                    for(op = 0; op < optionsLines.length; op++){
                        if(optionsLines[op] == line){
                            optionsLines.splice(op,1);
                        }
                    }
                    var textOp = $('#markdown-text').val().split('\n');
                    var oldOp = oldOp = markdown.toHTML(textOp[line]);
                    restructureList(line, false, '');
                    max_line--;
                    restructureList(line, false, '');
                    max_line--;
                    options = mergeOptions(oldOp[1][1], options);
                }
            }
            restructureList(line, true, 'option', options);
            optionsLines.push(line);
            max_line += 2;
        }
        else{
            if(optionsLines.includes(lines-2)){
                if(modeIndex != '' && lines-2 == 0){
                    
                }
                else{
                    lines -= 2;
                    for(op = 0; op < optionsLines.length; op++){
                        if(optionsLines[op] == lines){
                            optionsLines.splice(op,1);
                        }
                    }
                    var textOp = $('#markdown-text').val().split('\n');
                    var oldOp = markdown.toHTML(textOp[lines]);
                    restructureList(lines, false, '');
                    max_line--;
                    restructureList(lines, false, '');
                    max_line--;
                    options = mergeOptions(oldOp[1][1], options);
                }
            }
            restructureList(lines, true, 'option', options);
            optionsLines.push(lines);
            max_line += 2;
        }
    }
    changeTextEditor();
}

//Paste elements
var pasteElements = function(element, newElement){
    var id = element.attr("id").substr(12, 4);
    var newId = newElement.attr("id").substr(12, 4);
    var type = typeElements[id];
    var lineSlide = currentSlide();
    var lines = elements_list[id];
    if(lines.length != undefined){
        var text = $('#markdown-text').val().split('\n');
        var copyText = '';
        for(cp = lines[0]; cp <= lines[lines.length-1]; cp++){
            if(cp == lines[lines.length-1]){
                copyText += text[cp];
            }
            else{
                copyText += text[cp] + '\n';
            }
        }
        copyText += '\n';
        restructureList(lineSlide+2, true, 'paste', copyText, lines.length+1);
        newLines = [];
        for(cp = 0; cp < lines.length; cp++){
            newLines.push(lineSlide + cp + 2);
        }
        elements_list[newId] = newLines;
        spaceLines.push(lineSlide + lines.length + 2);
        max_line += lines.length + 1;
    }
    else{
        var text = $('#markdown-text').val().split('\n');
        var copyText = text[lines];
        copyText += '\n';
        restructureList(lineSlide+2, true, 'paste', copyText);
        elements_list[newId] = lineSlide + 2;
        spaceLines.push(lineSlide + 3);
        max_line += 2;
    }
    switch(type){
        case 'figure':
            moreFigure(1);
            typeElements[newId] = 'figure';
            break;
        case 'code':
            moreCode(lines.length)
            typeElements[newId] = 'code';
            break;
        case 'image':
            moreImage(1, Impressionist.prototype.getSelectedSlide());
            typeElements[newId] = 'image';
            break;
        case 'text':
            if(lines.length != undefined){
                moreText(lines.length)
            }
            else{
                moreText(1)
            }
            typeElements[newId] = 'text';
            break;
        case 'title':
            moreTitle(1)
            typeElements[newId] = 'title';
            break;
        case 'subtitle':
            moreSub(1)
            typeElements[newId] = 'subtitle';
            break;
        case 'titleS':
            moreTitle(1)
            typeElements[newId] = 'titleS';
            break;
        case 'subtitleS':
            moreSub(1)
            typeElements[newId] = 'subtitleS';
            break;
        }
    changeTextEditor();
}
var pasteSlides = function(slide, newSlide, copyLine = undefined){
    var id = slide.attr("id").substr(17, 4);
    var newId = newSlide.attr("id").substr(17, 4);
    var newElements = document.getElementById(newSlide.attr('id')).children;
    var text = $('#markdown-text').val().split('\n');
    var lineSlide = elements_list[id];
    var textSize = 1;
    var pTSize = lineSlide + 1;
    while(pTSize != text.length-1 && text[pTSize] != undefined && !(text[pTSize].includes('#')) && !(text[pTSize].includes('##'))){
        pTSize++;
        textSize++;
    }
    if(text[lineSlide].includes('#')){
        typeElements[newId] = 'slide1';
    }
    if(text[lineSlide].includes('##')){
        typeElements[newId] = 'slide2';
    }
    addNumElementsSlide(newId);
    var copyText = '';
    var cp = lineSlide;
    var cs = newElements.length-1;
    var futureLines = [];
    if(copyLine == undefined){
        var futureLine = max_line;
    }    
    else{
        var futureLine = copyLine;
        restructureList(copyLine, true, '', '', textSize);
    }
    var found = false;
    var oldElement = '';
    var firstElement = true;
    while(text[cp] != undefined && !(text[cp].includes('#')) && !(text[cp].includes('##')) || firstElement){
        for(key in elements_list){
            if(elements_list[key].length != undefined){
                if(elements_list[key].includes(cp)){
                    if(typeElements[key] != 'slide1' && typeElements[key] != 'slide2'){
                        futureLines.push(futureLine);
                        oldElement = key;
                        found = true;
                    }
                }
            }
            else{
                if(typeElements[key] != 'slide1' && typeElements[key] != 'slide2'){
                    if(elements_list[key] == cp){
                        futureLines.push(futureLine);
                        oldElement = key;
                        found = true;
                    }
                }
            }
        }
        if(found){
            if(text[cp+1] == undefined || text[cp+1].includes('#') || text[cp+1].includes('##')){
                copyText += text[cp];
            }
            else{
                copyText += text[cp] + '\n';
            }
            futureLine++;
            cp++;
            found = false;
            firstElement = false;
        }
        else{
            if(futureLines.length == 0){
                if(optionsLines.includes(cp)){
                    optionsLines.push(futureLine);
                }
                else if(optionsLines.includes(cp-1)){
                    //Nothing
                }
                else{
                    if(!spaceLines.includes(futureLine) && !firstElement){
                        spaceLines.push(futureLine);
                    }
                }
                futureLines = [];
                oldElement = '';
            }
            else{
                identifyElement(newElements[cs], futureLines, oldElement);
                if(!spaceLines.includes(futureLine)){
                    spaceLines.push(futureLine);
                }
                futureLines = [];
                oldElement = '';
                cs--;
            }
            if(cp == text.length-1 || text[cp+1] == undefined || text[cp+1].includes('#') || text[cp+1].includes('##')){
                copyText += text[cp];
            }
            else{
                copyText += text[cp] + '\n';
            }
            futureLine++;
            cp++;
            firstElement = false;
        }
    }
    id_slides_list.push(newId);
    if(copyLine == undefined){
        restructureList(max_line, true, 'paste', copyText, 0);
        elements_list[newId] = max_line;
    }
    else{
        restructureList(copyLine, true, 'paste', copyText, 0);
        elements_list[newId] = copyLine;
    }
    deleteSpaces();
    max_line += copyText.split('\n').length;
    changeTextEditor();
}
var identifyElement = function(newElement, lines, oldId){
    var newId = newElement["id"].substr(12, 4);
    var type = typeElements[oldId];
    elements_list[newId] = lines;
    switch(type){
        case 'figure':
            moreFigure(1);
            typeElements[newId] = 'figure';
            break;
        case 'code':
            moreCode(lines.length)
            typeElements[newId] = 'code';
            break;
        case 'image':
            moreImage(1, Impressionist.prototype.getSelectedSlide());
            typeElements[newId] = 'image';
            break;
        case 'text':
            if(lines.length != undefined){
                moreText(lines.length)
            }
            else{
                moreText(1)
            }
            typeElements[newId] = 'text';
            break;
        case 'title':
            moreTitle(1)
            typeElements[newId] = 'title';
            break;
        case 'subtitle':
            moreSub(1)
            typeElements[newId] = 'subtitle';
            break;
        case 'titleS':
            moreTitle(1)
            typeElements[newId] = 'titleS';
            break;
        case 'subtitleS':
            moreSub(1)
            typeElements[newId] = 'subtitleS';
            break;
        }
}
var pasteSlideToSlide = function(copySlide, newSlide){
    var oldLine = elements_list[newSlide.attr("id").substr(17, 4)];
    deleteSlideList(newSlide.attr("id").substr(17, 4));
    pasteSlides(copySlide, newSlide, oldLine);
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
    addSlideList(id);
    id_index_slides.push(id);
    
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
            id = Impressionist.prototype.addFullsliderTextIndexMD(slides_list[y+1], position, range, current, long);
            addTextList(id, 'normal', slides_list[y+1]);
            position = morePosition(position, long);
            if(slides_list[y+2] == 1){
                open = false;
            }
        }
        else if(level && orden == 2){
                id = Impressionist.prototype.addFullsliderTextIndexMD(slides_list[y+1], position, range, current, long);
                addTextList(id, 'normal', slides_list[y+1]);
                position = morePosition(position, long);
                if(slides_list[y+2] == 1){
                    level = false;
                }
            }
            else{
                if(slides_list[y] != 2){
                    id = Impressionist.prototype.addFullsliderTextIndexMD(slides_list[y+1], position, range, current, long);
                    addTextList(id, 'normal', slides_list[y+1]);
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
    var firstElement = true;
    var last = preText.length - 1;
    while(preTextLine <= last){
        if(preText[preTextLine] != '' || !firstElement){ //This avoid white line in first position
            if(preText[preTextLine].includes('{options') && preText[preTextLine].includes('}') && firstElement){//This add a white line after presentation options
                text += preText[preTextLine] + '\n\n';
                textLine++;
                spaceLines.push(textLine++);
            }
            else{
                firstElement = false;
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
                else if(preText[preTextLine] == '' && preText[preTextLine-1] == '---'){
                    //Don't add space lines after options or list
                }
                else{ //Added normal 
                    if (preText[preTextLine] == ''){ //Last white line of white lines consecutives
                        spaceLines.push(textLine);
                    }
                    text += preText[preTextLine] + '\n';
                    textLine++;
                }
            }
        }
        preTextLine++;
    }
    if(text[text.length-1] != ' '){ //This add a final white line
        text += '\n'
        spaceLines.push(textLine);
    }
    $('#markdown-text').val(text);
}
function restructureList(modified, add, type, textAdd=undefined, movesLines=undefined){
    var preText = $('#markdown-text').val().split('\n');
    var preElement = preText[modified];
    var text = '';
    if(preText.length == 1){ //First initialize
        text = '#\n\n';
    }
    else{
        for(var rL = 0; rL <= preText.length-1; rL++){
            if(rL == modified){
                if(add){
                    switch(type){
                        case 'slide':
                            text += '#\n\n';
                            break;
                        case 'normal':
                            text += textAdd + '\n\n';
                            break;
                        case 'title':
                            text += '-Sample Text-\n\n';
                            break;
                        case 'subtitle':
                            text += '--Sample Text--\n\n';
                            break;
                        case 'code':
                            text += '`function example(){\nalert();\n}`\n\n'
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
                        case 'option':
                            text += "{options: " + textAdd + "}\n---\n";
                            break;
                        case 'image':
                            text += "![](" + url_image + ")\n\n";
                            break;
                        case 'paste':
                            text += textAdd + "\n";
                            break;
                        default:
                            text += preText[rL] + "\n";
                            break;
                    }                    
                }
                else{
                    // To delete
                } 
            }
            else{
                if(rL > modified && add && type != ''){
                    text += preElement + '\n';
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
        }
    }
    $('#markdown-text').val(text);
    
    for(lock in elements_list){
        if(elements_list[lock].length != undefined){
            for(var m = 0; m < elements_list[lock].length; m++){
                if(elements_list[lock][m] >= modified){
                    if(add){
                        if(movesLines != undefined){
                            elements_list[lock][m] += movesLines;
                        }
                        else{
                            elements_list[lock][m] += 2;
                        }
                    }
                    else{
                        if(elements_list[lock][m] != 0){
                            elements_list[lock][m] -= 1;
                        }
                    }
                }
            }
        }
        else{
            if(elements_list[lock] >= modified){
                if(add){
                    if(movesLines != undefined){
                        elements_list[lock] += movesLines;
                    }
                    else{
                        elements_list[lock] += 2;
                    }
                }
                else{
                    if(elements_list[lock] != 0){
                        elements_list[lock] -= 1;
                    }
                }
            }
        }
    }
    for(s = 0; s < spaceLines.length; s++){
        if(spaceLines[s] >= modified){
            if(add){
                if(movesLines != undefined){
                    spaceLines[s] += movesLines;
                }
                else{
                    spaceLines[s] += 2;
                }
            }
            else{
                if(spaceLines[s] != 0){
                    spaceLines[s] -= 1;
                }
            }
        }
    }
    for(o = 0; o < optionsLines.length; o++){
        if(optionsLines[o] >= modified){
            if(add){
                if(movesLines != undefined){
                    optionsLines[o] += movesLines;
                }
                else{
                    optionsLines[o] += 2;
                }
            }
            else{
                if(optionsLines[o] != 0){
                    optionsLines[o] -= 1;
                }
            }
        }
    }
}
function multiElement(line, type){
    var lines = [];
    var text = $('#markdown-text').val().split('\n');
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
                if(text[l] == "" || text[l] == "#" || text[l] == "##"){
                    return lines;
                }
                lines.push(l);
            }
            break;
        case 'list':
            for(var l = line; l < text.length; l++){
                if(text[l] == "---" || text[l] == "----" || text[l] == "-----" || text[l] == "------" || text[l] == "-------"){
                    lines.push(l);
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
            restructureList(spaceLines[sp], false, '');
            spaceLines.splice(sp, 1);
            max_line--;
        }
        else{
            sp++;
        }
    }
}
function modifyTextCode(textElement, idElement){
    var idElement = idElement.substr(12, 4);
    var lines = elements_list[idElement];
    var countLines = lines.length;
    //Delete element
    var line = lines[0];
    var lastLine = lines[lines.length-1];
    for(var mT = line; mT <= lastLine; mT++){
        restructureList(line, false, '');
        max_line--;
    }
    if(spaceLines.includes(line)){
        for(s = 0; s < spaceLines.length; s++){
            if(line == spaceLines[s]){
                spaceLines.splice(s, 1);
            }
        }
        restructureList(line, false, '');
        max_line--;
    }
    //Write same element modified
    elements_list[idElement] = [];
    for(var tA = 0; tA < textElement.length; tA++){
        if(tA == 0){
            restructureList(line, true, 'paste', '`' + textElement[tA].textContent, 1);
            max_line++;
            elements_list[idElement].push(line);
            line++;
        }
        else if(tA == textElement.length-1){
            restructureList(line, true, 'paste', textElement[tA].textContent + '`' + '\n', 2);
            max_line++;
            elements_list[idElement].push(line);
            line++;
            max_line++;
            spaceLines.push(line);
        }
        else{
            restructureList(line, true, 'paste', textElement[tA].textContent, 1);
            max_line++;
            elements_list[idElement].push(line);
            line++;
        }
    }
    var newCountLines = elements_list[idElement].length;
    if(newCountLines > countLines){
        moreCode(newCountLines - countLines)
    }
    changeTextEditor();
}
function modifyTextText(textElement, idElement){
    var idElement = idElement.substr(12, 4);
    var type = typeElements[idElement];
    var lines = elements_list[idElement];
    var linesC = elements_list[idElement];
    var countLines = lines.length;
    var linesList = 0;
    if(countLines != undefined){
        //Delete element
        var line = lines[0];
        var lastLine = lines[lines.length-1];
        for(var mT = line; mT <= lastLine; mT++){
            restructureList(line, false, '');
            max_line--;
        }
        if(spaceLines.includes(line)){
            for(s = 0; s < spaceLines.length; s++){
                if(line == spaceLines[s]){
                    spaceLines.splice(s, 1);
                }
            }
            restructureList(line, false, '');
            max_line--;
        }
        //Create modified element again
        elements_list[idElement] = [];
        var chi = 0;
        var modT = '';
        for(var mTT = 0; mTT < textElement.length; mTT++){
            if(textElement[mTT].children.length != 1){
                if(textElement[mTT].innerHTML.includes('<ul>')){
                    modT = toList(textElement[mTT].children.item(0).children, 0);
                    linesList = textElement[mTT].children.item(0).children.length + 1;
                }
                else if(textElement[mTT].innerHTML.includes('<ol>')){
                    modT = toList(textElement[mTT].children.item(0).children, 1);
                    linesList = textElement[mTT].children.item(0).children.length + 1;
                }
                else{
                    while(chi < textElement[mTT].children.length){
                        modT += textElement[mTT].children.item(chi).innerHTML;
                        chi++;
                    }
                    chi = 0;
                }
            }
            else{
                if(textElement[mTT].innerHTML.includes('<ul>')){
                    modT = toList(textElement[mTT].children.item(0).children, 0);
                    linesList = textElement[mTT].children.item(0).children.length + 1;
                }
                else if(textElement[mTT].innerHTML.includes('<ol>')){
                    modT = toList(textElement[mTT].children.item(0).children, 1);
                    linesList = textElement[mTT].children.item(0).children.length + 1;
                }
                else{
                    modT = textElement[mTT].children.item(0).innerHTML;      
                }
            }
            var modifiedText = replaceStyleText(modT);
            if(modifiedText != ''){
                if(linesList != 0){
                    if(mTT == textElement.length-1){
                        restructureList(line, true, 'paste', modifiedText, linesList+1);
                        max_line += linesList;
                        for(var sl = 1; sl <= linesList; sl++){
                            elements_list[idElement].push(line);
                            line++;
                        }
                        max_line++;
                        spaceLines.push(line);
                    }
                    else{
                        restructureList(line, true, 'paste', modifiedText, linesList);
                        max_line += linesList;
                        for(var sl = 1; sl <= linesList; sl++){
                            elements_list[idElement].push(line);
                            line++;
                        }
                    }
                }
                else{
                    if(mTT == textElement.length-1){
                        restructureList(line, true, 'paste', modifiedText + '\n', 2);
                        max_line++;
                        elements_list[idElement].push(line);
                        line++;
                        max_line++;
                        spaceLines.push(line);
                    }
                    else{
                        restructureList(line, true, 'paste', modifiedText, 1);
                        max_line++;
                        elements_list[idElement].push(line);
                        line++;
                    }
                }
            }
            linesList = 0;
        }
        var newCountLines = elements_list[idElement].length;
        if(newCountLines > countLines){
            moreText(newCountLines - countLines)
        }
    }
    else{
        //Delete element
        restructureList(lines, false, '');
        max_line--;
        if(spaceLines.includes(lines)){
            for(s = 0; s < spaceLines.length; s++){
                if(lines == spaceLines[s]){
                    spaceLines.splice(s, 1);
                }
            }
            restructureList(line, false, '');
            max_line--;
        }
        //Create modified element again
        elements_list[idElement] = [];
        var chi = 0;
        var modT = '';
        for(var mTT = 0; mTT < textElement.length; mTT++){
            if(textElement[mTT].children.length != 1){
                if(textElement[mTT].innerHTML.includes('<ul>')){
                    modT = toList(textElement[mTT].children.item(0).children, 0);
                    linesList = textElement[mTT].children.item(0).children.length + 1;
                }
                else if(textElement[mTT].innerHTML.includes('<ol>')){
                    modT = toList(textElement[mTT].children.item(0).children, 1);
                    linesList = textElement[mTT].children.item(0).children.length + 1;
                }
                else{
                    while(chi < textElement[mTT].children.length){
                        modT += textElement[mTT].children.item(chi).innerHTML;
                        chi++;
                    }
                    chi = 0;
                }
            }
            else{
                if(textElement[mTT].innerHTML.includes('<ul>')){
                    modT = toList(textElement[mTT].children.item(0).children, 0);
                    linesList = textElement[mTT].children.item(0).children.length + 1;
                }
                else if(textElement[mTT].innerHTML.includes('<ol>')){
                    modT = toList(textElement[mTT].children.item(0).children, 1);
                    linesList = textElement[mTT].children.item(0).children.length + 1;
                }
                else{
                    modT = textElement[mTT].children.item(0).innerHTML;      
                }
            }
            var modifiedText = '';
            switch(type){
                case 'title':
                    modifiedText += '-' + replaceStyleText(modT) + '-';
                    break;
                case 'subtitle':
                    modifiedText += '--' + replaceStyleText(modT) + '--';
                    break;
                case 'titleS':
                    modifiedText += '#' + replaceStyleText(modT);
                    break;
                case 'subtitleS':
                    modifiedText += '##' + replaceStyleText(modT);
                    break;
                default:
                    modifiedText += replaceStyleText(modT);
                    break;
            }
            if(modifiedText != ''){
                if(linesList != 0){
                    if(mTT == textElement.length-1){
                        restructureList(lines, true, 'paste', modifiedText, linesList+1);
                        max_line += linesList;
                        for(var sl = 1; sl <= linesList; sl++){
                            elements_list[idElement].push(lines);
                            lines++;
                        }
                        max_line++;
                        spaceLines.push(lines);
                    }
                    else{
                        restructureList(lines, true, 'paste', modifiedText, linesList);
                        max_line += linesList;
                        for(var sl = 1; sl <= linesList; sl++){
                            elements_list[idElement].push(lines);
                            lines++;
                        }
                    }
                }
                else{
                    if(mTT == textElement.length-1){
                        restructureList(lines, true, 'paste', modifiedText, 2);
                        max_line++;
                        elements_list[idElement].push(lines);
                        lines++;
                        max_line++;
                        spaceLines.push(lines);
                    }
                    else{
                        restructureList(lines, true, 'paste', modifiedText, 1);
                        max_line++;
                        elements_list[idElement].push(lines);
                        lines++;
                    }
                }
            }
            linesList = 0;
        }
        if(type == "titleS" || type == "subtitleS" || type == "title" || type == "subtitle"){
            var lock = '';
            for(lock in elements_list){
                if(elements_list[lock].length != undefined){
                    if(elements_list[lock].includes(linesC)){
                        elements_list[lock] = linesC;
                    }
                }
                else{
                    if(elements_list[lock] == linesC+2){
                        elements_list[lock] = linesC;
                    }
                }
            }
        }
        var newCountLines = elements_list[idElement].length;
        if(newCountLines > countLines){
            moreText(newCountLines - countLines)
        }
    }
    changeTextEditor();
}
function replaceStyleText(text){
    var modifiedText = text.replace(/^\s+/g, '');
    modifiedText = modifiedText.replace(/<br>/g, '.');
    modifiedText = modifiedText.replace(/&nbsp;*/g, '');
    modifiedText = modifiedText.replace(/<b>\s*/g, '**');
    modifiedText = modifiedText.replace(/<\/b>/g, '**');
    modifiedText = modifiedText.replace(/<i>\s*/g, '_');
    modifiedText = modifiedText.replace(/<\/i>/g, '_');
    modifiedText = modifiedText.replace(/<strong>\s*/g, '**');
    modifiedText = modifiedText.replace(/<\/strong>/g, '**');
    modifiedText = modifiedText.replace(/<em>\s*/g, '_');
    modifiedText = modifiedText.replace(/<\/em>/g, '_');
    return modifiedText;
}
function toList(textElement, mode){
    var textList = '';
    var ind = 1;
    for(var l = 0; l < textElement.length; l++){
        if(mode == 0){ //unorder
            textList += '* ' + textElement[l].innerHTML + '\n';
        }
        else{ //order
            textList += ind + '. ' + textElement[l].innerHTML + '\n';
            ind++;
        }
    }
    textList += '---'
    return textList;
}
function moveSlideMD(slides, slide){
    for(var mS = 0; mS < slides.length; mS++){
        if(slides[mS].id.includes(slide.id)){
            if(slides[mS+1] != undefined){
                var s = slides[mS+1].id.substr(11,4);
                moveSlide(slide.id, elements_list[s]);
            }
            else{
                moveSlide(slide.id, max_line);
            }
        }
    }
}
var moveSlide = function(idSlide, line){
    var newElements = document.getElementById(idSlide).children;
    idSlide = idSlide.substr(11,4);
    newElements = newElements[3].children;
    newElements = orderNewElements(newElements);
    var text = $('#markdown-text').val().split('\n');
    var lineSlide = elements_list[idSlide];
    var lineText = lineSlide;
    var moveText = text[lineText] + '\n';
    lineText++;
    while(lineText != text.length-1 && text[lineText] != undefined && !(text[lineText].includes('#')) && !(text[lineText].includes('##'))){
        if(lineText+1 != text.length-1 && text[lineText+1] != undefined && !(text[lineText+1].includes('#')) && !(text[lineText+1].includes('##'))){
            moveText += text[lineText] + '\n';
        }
        else{
            moveText += text[lineText];
        }
        lineText++;
    }
    // Delete old position
    var lT = moveText.split('\n').length;
    var oldLine = elements_list[idSlide];
    for(var dT = 0; dT < lT; dT++){
        if(spaceLines.includes(oldLine)){
            for(s = 0; s < spaceLines.length; s++){
                if(oldLine == spaceLines[s]){
                    spaceLines.splice(s, 1);
                }
            }
            restructureList(oldLine, false, 'slide');
        }
        else{
            if(optionsLines.includes(oldLine)){
                if(modeIndex != '' && oldLine == 0){

                }
                else{
                    for(s = 0; s < optionsLines.length; s++){
                        if(oldLine == optionsLines[s]){
                            optionsLines.splice(s, 1);
                        }
                    }
                }
            }
            restructureList(oldLine, false, '');
        }
    }
    // Add again
    if(line != 0){
        line = line - (moveText.split('\n').length);
    }
    restructureList(line, true, 'paste', moveText, lT);
    var nE = 1;
    moveText = moveText.split('\n');
    elements_list[idSlide] = line;
    line++;
    var idE = '';
    for(var movedT = 1; movedT < moveText.length; movedT++){
        if(newElements[nE] != undefined){
            if(moveText[movedT].includes('{options')){
                optionsLines.push(line);
                line++;
                movedT++;
            }
            else if(moveText[movedT] != ''){
                idE = newElements[nE].id.substr(12,4);
                if(elements_list[idE].length != undefined){
                    var lines = [];
                    for(var r = 0; r < elements_list[idE].length; r++){
                        lines.push(line);
                        if(r != elements_list[idE].length-1){
                            line++;
                            movedT++;
                        }
                    }
                    elements_list[idE] = lines;
                }
                else{
                    elements_list[idE] = line;
                }
                nE++;
            }
            else{
                spaceLines.push(line);
            }
        }
        line++;
    }
    spaceLines.push(line-1);
    changeTextEditor();
}
function orderNewElements(elements1){
    var elements = Array.from(elements1);
    var nE = 1;
    var aux = '';
    var idE1 = '';
    var idE2 = '';
    var l1 = 0;
    var l2 = 0;
    while(nE < elements.length-1){
        idE1 = elements[nE].id.substr(12,4);
        idE2 = elements[nE+1].id.substr(12,4);
        if(elements_list[idE2].length != undefined){
            l2 = elements_list[idE2][0];
        }
        else{
            l2 = elements_list[idE2];
        }
        if(elements_list[idE1].length != undefined){
            l1 = elements_list[idE1][0];
        }
        else{
            l1 = elements_list[idE1];
        }
        if(l2 < l1){
            aux = elements[nE];
            elements[nE] = elements[nE+1];
            elements[nE+1] = aux;
            nE = 1;
        }
        else{
            nE++;
        }
    }
    return elements.slice();
}

function resetAll(){
    modeIndex = '';
    url_image = '';
    id_slides_list = [];
    optionsLines = [];
    typeElements = {};
    id_index_slides = [];
    clearOptions();
    slides_list = [];
    elements_list = {};
    max_line = 0;
    spaceLines = [];
    imagesListProcess = {};
}
