var slides_list = [];
var code_img = '';

$(document).ready(function() {   
    $('#convert').click(function() {   
        for(x = 0; x < slides_list.length; x++){
            Impressionist.prototype.deleteIdSlide(slides_list[x]);
        }
        slides_list = [];
        var $content = $('#markdown-text').val();
        var $fullSlider_content = markdown.toHTML( $content );
        var source = $fullSlider_content;
        console.log(source);
        for (i = 1 ; i < source.length; ++i ) {
            process(source[i]);
            console.log(source);
            console.log(i);
            //console.log(slides_list);
        };
    });
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
    switch(source[0]) {
        case 'slide1':
            if(source[1] === undefined){
                slides_list.push(Impressionist.prototype.addSlideMD());
                break;
            }
            else{
                slides_list.push(Impressionist.prototype.addSlideMD());
                Impressionist.prototype.addFullsliderTextMD("title", source[1], mode);
                break;
            }
            break;
        case 'slide2':
            if(source[1] === undefined){
                slides_list.push(Impressionist.prototype.addSlideMD());
                break;
            }
            else{
                slides_list.push(Impressionist.prototype.addSlideMD());
                Impressionist.prototype.addFullsliderTextMD("subtitle", source[1], mode);
                break;
            }
            break;
        case 'slide3':
            if(source[1] === undefined){
                slides_list.push(Impressionist.prototype.addSlideMD());
                break;
            }
            else{
                slides_list.push(Impressionist.prototype.addSlideMD());
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
    slides_list.push(idSlide);
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