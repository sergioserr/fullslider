var id_slides_list = [];
var code_img = '';
var slides_list = [];
var modeIndex = ""

$(document).ready(function() {   
    $('#markdown-text').on('change', function() { 
        //Resetting
        for(x = 0; x < id_slides_list.length; x++){
            Impressionist.prototype.deleteIdSlide(id_slides_list[x]);
        }
        modeIndex = ""
        id_slides_list = [];
        slides_list = [];
        //Markdown
        var content = $('#markdown-text').val();
        var source = markdown.toHTML(content);
        console.log(source);
        //Check error
        if(source[0] != 'start'){
            alert("Ha ocurrido un error, intentelo de nuevo");
            return;
        }
        //Preprocessing
        if(source[1][0] == 'index'){
            for(pre = 2 ; pre < source.length; ++pre ){
                if(source[pre][1] != undefined){
                    switch(source[pre][0]){
                        case 'slide1':
                            slides_list.push(0);
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
            createSlideIndex("primera", 0);
        };
        console.log(slides_list);
        //console.log(slides_list);
        //Processing
        for (i = 1 ; i < source.length; ++i ) {
            process(source[i]);
            //console.log(source);
            //console.log(i);
            //console.log(id_slides_list);
        };
    });
    /*$('#convert').click(function() {   
        for(x = 0; x < id_slides_list.length; x++){
            Impressionist.prototype.deleteIdSlide(id_slides_list[x]);
        }
        id_slides_list = [];
        var $content = $('#markdown-text').val();
        var $fullSlider_content = markdown.toHTML( $content );
        var source = $fullSlider_content;
        console.log(source);
        for (i = 1 ; i < source.length; ++i ) {
            process(source[i]);
            console.log(source);
            console.log(i);
            //console.log(id_slides_list);
        };
    });*/
}); 

var process = function(source){
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
                id_slides_list.push(Impressionist.prototype.addSlideMD());
                break;
            }
            else{
                if(modeIndex == 't'){
                    createSlideIndex(source[1], 1);
                }
                id_slides_list.push(Impressionist.prototype.addSlideMD());
                Impressionist.prototype.addFullsliderTextMD("title", source[1], mode);
                break;
            }
            break;
        case 'slide2':
            if(source[1] === undefined){
                id_slides_list.push(Impressionist.prototype.addSlideMD());
                break;
            }
            else{
                if(modeIndex == 't'){
                    createSlideIndex(source[1], 2);
                }
                id_slides_list.push(Impressionist.prototype.addSlideMD());
                Impressionist.prototype.addFullsliderTextMD("subtitle", source[1], mode);
                break;
            }
            break;
        case 'slide3':
            if(source[1] === undefined){
                id_slides_list.push(Impressionist.prototype.addSlideMD());
                break;
            }
            else{
                if(modeIndex == 't'){
                    createSlideIndex(source[1], 3);
                }
                id_slides_list.push(Impressionist.prototype.addSlideMD());
                Impressionist.prototype.addFullsliderTextMD("subtitle", source[1], mode);
                break;
            }
            break;
        case 'tl1':
            Impressionist.prototype.addFullsliderTextMD("title", source[1], mode);
            break;
        case 'tl2':
            Impressionist.prototype.addFullsliderTextMD("subtitle", source[1], mode);
            break;
        case 'figure1':
            $('#drawRect').click();
            eventsSimulate();
            $('#editEnd').click();
            break;
        case 'figure2':
            $('#drawLine').click();
            eventsSimulate();
            $('#editEnd').click();
            break;
        case 'figure3':
            $('#drawEllipse').click();
            eventsSimulate();
            $('#editEnd').click();
            break;
        case 'figure4':
            $('#drawArrow').click();
            eventsSimulate();
            $('#editEnd').click();
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
                    Impressionist.prototype.addFullsliderCodeMD(text);
                    code_img = '';
                    break;
                case 'img':
                    createImageFromDataUrl(source[1].src);
                    code_img = '';
                    break;
                default:
                    Impressionist.prototype.addFullsliderTextMD("normal", source[1], mode);
                    break;
            }
    }
}

var addSlideList = function(idSlide){
    id_slides_list.push(idSlide);
    $('#markdown-text').val($('#markdown-text').val()+'#Title Slide\n\n');
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
    
    id_slides_list.push(Impressionist.prototype.addSlideMD());
    
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
                        Impressionist.prototype.addFullsliderTextIndexMD(slides_list[y+1], position, range, current, long);
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