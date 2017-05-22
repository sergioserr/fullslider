var elClipboard = {
    type: "",
    value: ""
};

//To control elClipboard and system clipboard
var newCopied = false;
var isCopiedImage = false;
var latestImage = "";

function setElClipboard(type, value) {
    elClipboard.type = type;
    elClipboard.value = value;
    if (isCopiedImage) {
        isCopiedImage = false;
        newCopied = true;
    }
}

function copyEl() {
//    document.execCommand('copy', false, null);
    var currentClicked = me.getCurrentClicked();
    if (currentClicked !== "") {
        if (currentClicked.hasClass("slidethumb")) {
            var slideId = me.slideIdFromThumb(currentClicked);
            setElClipboard("slidethumb", $("#" + slideId).clone());
        }
        else {
            if (currentClicked.hasClass("slidelement") && !currentClicked.hasClass("elementediting")) {
                setElClipboard("slidelement", currentClicked.clone());
            }
        }
    }
    else {
        setElClipboard("", "");
    }
}

function pasteEl() {
    var currentClicked = me.getCurrentClicked();
    switch (elClipboard.type) {
        case "slidethumb":
            if (isInElement($(".slidethumbholder"), currentClicked)) {
                if (isElementByClass("slidethumb", currentClicked)) {
                    var newSlide = me.copySlideToSlide(elClipboard.value);
                    pasteSlideToSlide(elClipboard.value, newSlide);
                    changeContent();//Event for undo redo  
                }
                else {
                    var newSlide = me.cloneSlide(elClipboard.value);
                    pasteSlides(elClipboard.value, newSlide);
                    launchEvent("click", document.getElementsByClassName("slidethumbholder")[0]);
                    changeContent();//Event for undo redo  
                }
            }
            break;
        case "slidelement":
            if (isElementByClass("fullslider-slide", currentClicked) || isElementByClass("slidelement", currentClicked)) {
                if (!isElementByClass("elementediting", currentClicked)) {
                    pasteSlidelement();
                }
            }
            else {
                if (isInElement($(".slidethumbholder"), currentClicked)) {
                    if (isElementByClass("slidethumb", currentClicked)) {
                        pasteSlidelement();
                    }
                }
            }
            break;
    }
}

function pasteSlidelement() {
    var newElement = me.cloneElement(elClipboard.value);
    pasteElements(elClipboard.value, newElement);
    me.appendClonedElement();
    changeContent();//Event for undo redo  
}


key('ctrl+c', function(e) {
    copyEl();
});

function pasteImg(img) {
    var blob = img;
    createImageFromBlob(blob);
    newCopied = false;
    isCopiedImage = true;
}

function pasteItemIfLast() {
    pasteEl();
    newCopied = false;
    isCopiedImage = false;
}

$(document).on("ready", function() {
    if (me.useragent == "firefox" || me.useragent == "edge" || me.useragent == "ie") {
        key('ctrl+v', function(e) {
            pasteEl();
            changeContent();//Event for undo redo
        });
    }
    else {
        document.onpaste = function(e)
        {
            var items = e.clipboardData.items;
            for (var i = 0; i < items.length; ++i) {
                //If there is an image in system clipboard && slide is clicked
                if ((items[i].kind == 'file' && items[i].type.indexOf('image/') !== -1) &&
                        isElementByClass("fullslider-slide", me.currentClicked) ||
                        isElementByClass("slidelement", me.currentClicked))
                {
                    var clipboardimg = items[i].getAsFile();
                    var fr = new FileReader();
                    fr.onload = function(e) {
                        clipboardimg64 = e.target.result;
                        //If clipboard image is not latest pasted image.
                        if (clipboardimg64 != latestImage || (!newCopied && isCopiedImage)) {
                            latestImage = clipboardimg64;
                            pasteImg(clipboardimg);
                        }
                        else {
                            pasteItemIfLast();
                        }
                    };
                    fr.readAsDataURL(clipboardimg);

                } else {//Else, paste Fullslider element
                    if (i == items.length - 1) {
                        pasteItemIfLast();
                        break;
                    }
                }
            }
        };
    }
});