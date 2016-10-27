var slides_list = [];

$(document).ready(function() {   
    $('#convert').click(function() {   
        for(x = 0; x < slides_list.length; x++){
            Impressionist.prototype.deleteIdSlide(slides_list[x]);
        }
        slides_list = [];
        var $content = $('#markdown-text').val();
        var $fullSlider_content = markdown.toHTML( $content );
        var source = $fullSlider_content;
        for (i = 1 ; i < source.length; ++i ) {
            process(source[i]);
        };
    });
}); 

var process = function(source){
    switch(source[0]) {
        case 'slide':
            if(source[1] === undefined){
                slides_list.push(Impressionist.prototype.addSlideMD());
                break;
            }
            else{
                slides_list.push(Impressionist.prototype.addSlideMD());
                Impressionist.prototype.addFullsliderTextMD("title", source[1]);
                break;
            }
            break;
        /*case 'p':
            Impressionist.prototype.addFullsliderText("normal");
            break;*/
    }
}

var addSlideList = function(idSlide){
    slides_list.push(idSlide);
    $('#markdown-text').val($('#markdown-text').val()+'#Title Slide\n\n');
}