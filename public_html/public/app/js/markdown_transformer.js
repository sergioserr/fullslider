var slides_list = [];

$(document).ready(function() {   
    $('#convert').click(function() {   
        var $content = $('#markdown-text').val();
        var $fullSlider_content = markdown.toHTML( $content );
        var source = $fullSlider_content;
        for (i = 1 ; i < source.length; ++i ) {
            process(source[i]);
        };
    });
}); 

var process = function(source){
    var current_slide = null;
    switch(source[0]) {
        case 'slide':
            var c = true;
            if(source[1] === undefined){
                break;
            }
            current_slide = source[1];
            for (i = 0; i < slides_list.length; ++i ) {
                if(slides_list[i] === source[1]){
                    c = false;
                }
            };
            if(c){
                slides_list.push(source[1]);
                Impressionist.prototype.addSlide();
                //Impressionist.prototype.addFullsliderText("title");
            }
            break;
        /*case 'p':
            Impressionist.prototype.addFullsliderText("normal");
            break;*/
    }
}