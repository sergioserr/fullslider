var slides_list = [];
var code = false;

$(document).ready(function() {   
    $('#convert').click(function() {   
        for(x = 0; x < slides_list.length; x++){
            Impressionist.prototype.deleteIdSlide(slides_list[x]);
        }
        slides_list = [];
        var $content = $('#markdown-text').val();
        var $fullSlider_content = markdown.toHTML( $content );
        var source = $fullSlider_content;
        //console.log(source);
        for (i = 1 ; i < source.length; ++i ) {
            process(source[i]);
            
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
                code = true;
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
            /*var editor = onToolSelectedMD('rect');
            editor.addRectMD();
            onEditEnd()*/
            break;
        case 'figure2':
            break;
        case 'figure3':
            break;
        case 'figure4':
            break;
        case 'p':
            if(code){
                var text = '<li>';
                for(i = 0; i < source[1].length; i++){
                    text += source[1][i];
                    if(source[1][i] === '\n'){
                        text += '</li><li>'
                    }
                }
                text += '</li>'
                Impressionist.prototype.addFullsliderCodeMD(text);
                code = false;
            }
            else{
                Impressionist.prototype.addFullsliderTextMD("normal", source[1], mode);
            }
            break;
    }
}

var addSlideList = function(idSlide){
    slides_list.push(idSlide);
    $('#markdown-text').val($('#markdown-text').val()+'#Title Slide\n\n');
}