function slideNavigate(direction) {
    var modals = document.getElementsByClassName("modal");
    var displayed = false;
    for (var i = 0; i < modals.length; i++) {
        if ($(modals[i]).css("display") != "none") {
            displayed = true;
            break;
        }
    }
    if (!displayed && me.selectedforedit == "" && me.selectedElement == "") {
        var numSlides = $(".slidethumbholder").children().length;
        var currentSlide = parseInt($(".currentselection").attr("data-slidenumber"));
        var condition = false;
        var newSlidenum;
        if (direction == "right") {
            condition = currentSlide < numSlides;
            newSlidenum = currentSlide + 1;
        } else {
            condition = currentSlide > 1;
            newSlidenum = currentSlide - 1;
        }
        if (condition) {
            var newSlide = $(".slidethumbholder").find("[data-slidenumber='" + newSlidenum + "']");
            var newSlideid = $(newSlide).attr("id").split("_")[1];
            me.selectSlide("#fullslider_slide_" + newSlideid);
            me.selectThumb(newSlideid);
        }
    }
}

key	('delete', function(e) {
	var selectedSlide = Impressionist.prototype.getSelectedSlide()
	var selectedElement = Impressionist.prototype.getSelectedElement();
	if (selectedElement !== "") {
		Impressionist.prototype.deleteElement(selectedElement);
	} 
	else {
		var selectedClicked = Impressionist.prototype.getCurrentClicked();
		slideIdCliked = $(selectedClicked).attr("id").split("_")[1];
		slideIdSlide = $(selectedSlide).attr("id").split("_")[2];
		if(slideIdCliked === slideIdSlide){
			Impressionist.prototype.deleteSlide(selectedSlide);
		}
	}
});

key('ctrl+s', function(e) {
    e.preventDefault();
    e.stopPropagation();
    me.savePresentationOnSession();
});

key('ctrl+o', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $("#inputFile").click();
});

key('right,pagedown', function(e) {
//    e.preventDefault();
    e.stopPropagation();
    slideNavigate("right");
});

key('left,pageup', function(e) {
//    e.preventDefault();
    e.stopPropagation();
    slideNavigate("left");
});