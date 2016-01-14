/**
 * Client id - 813346482484.apps.googleusercontent.com
 */
Impressionist = function()
{

    this.slidecounter = 0;
    this.menuopen = false;

    this.selectedElement;
    this.selectedforedit;

    this.clonedElement;
    this.selectedSlide;

    this.orchestrationcoords = [];
    this.selectedOrchElement;
    this.lastslideleftpos = 0;

    this.saveKey = "fullslider_decks";
    this.lastSaved = "fullslider_lastsaved";

    this.currentPresentation;
    this.mypresentations = [];
    this.mode = "create";
    this.loggedinstate = false;
    this.dropdownopen = false;
    this.currentClicked = "";


    this.isBold = false;
    this.isItalic = false;
    this.isUnderlined = false;
    this.isLeftAligned = false;
    this.isRightAligned = false;
    this.isCenterAligned = false;

    this.vxmax = 6000;
    //Viewport x min
    this.vxmin = -6000;
    //Viewport y max
    this.vymax = 6000;
    //Viewport y min
    this.vymin = -6000;
    //Window x max
    this.wxmax = 960;
    //Window x min
    this.wxmin = 0;
    //Window y max
    this.wymax = 630;
    //Window y min
    this.wymin = 0;
    this.slidewxmax = 960;
    this.slidewxmin = 0;
    this.slidewymax = 630;
    this.slidewymin = 0;

    this.titleText = 3.5;
    this.subtitleText = 2.75;
    this.normalText = 1.75;
};
Impressionist.prototype =
        {
            initialize: function()
            {
                me = this;
                me.continueInit();
//                me.openNewPresentationWindow();
            },
            continueInit: function()
            {
                me.initializeWelcomePanel();
                me.initializeImageModal();
                me.initializeNewPresModal();
                me.initializeMyPresModal();
                me.initializeAlerts();
                me.setupColorpickerPopup();
                me.setupMenuItemEvents();
                me.enableSort();
//                me.setupPopover();
//                me.setupDials();
                me.hideTransformControl();
                //Load array with all saved presentations
                var presentations = me.getSavedPresentations();
                me.renderPresentations(presentations);
                //Load last saved presentation
//                 me.openLastSavedPresentation();

                me.openWelcomePanel();
            },
            initializeImageModal: function() {
                $("#modals").append(add_img_modal);
            },
            initializeNewPresModal: function() {
                $("#modals").append(new_pres_modal);
            },
            initializeMyPresModal: function() {
                $("#modals").append(my_pres_modal);
            },
            initializeWelcomePanel: function() {
                $("#modals").append(welcome_panel);
            },
            initializeAlerts: function() {
                $("#modals").append(alert_danger);
                $("#dangeralert").fadeOut(0);
                $("#modals").append(alert_success);
                $("#successalert").fadeOut(0);
            },
            openWelcomePanel: function() {
                $("#welcomemodal").removeClass("hide");
                $("#welcomemodal").modal("show");
            },
            openLastSavedPresentation: function()
            {
                var presentation = JSON.parse(me.getItem(me.lastSaved));
                console.log("lastsaved", presentation);
                if (!presentation)
                {
                    var savedpresos = JSON.parse(me.getItem(me.saveKey));
                    console.log("savedpresos", savedpresos);
                    if (savedpresos && savedpresos.length > 0)
                    {
                        $("#savedpresentationsmodal").removeClass("hide");
                        $("#savedpresentationsmodal").modal("show");
                    }
                    else
                    {
                        me.openNewPresentationWindow();
                    }

                }
                else
                {
                    me.currentPresentation = presentation;
                    console.log("Retrieved id: ", me.currentPresentation);
                    me.loadPresentation(me.currentPresentation);
                }
            },
            openNewPresentationWindow: function()
            {
                $("#newpresentationmodal").removeClass("hide");
                $("#newpresentationmodal").modal("show");
                $("#newpresoheader").html("Create New Presentation");
                me.mode = "create";
            },
            renderPresentations: function(presentations)
            {
                me.mypresentations = presentations;
                $("#savedpresentations").html("<h3 style='display:inline-block; color:#2980B9; font-size:120%'> You don't have any saved presentations. </h3>");
                if (presentations.length > 0)
                {
                    $("#savedpresentations").html("");
                }
                for (var i = 0; i < presentations.length; i++)
                {
                    presentation = presentations[i];
                    templ = saved_presentations;
                    templ = templ.split("__presotitle__").join(presentation.title);
                    templ = templ.split("__presoid__").join(presentation.id);
                    $("#savedpresentations").append(templ);
                }
                $(".deletepresobtn").on("click", function(e)
                {
                    var msg = confirm("Are you sure?");
                    if (msg == true)
                    {
                        me.deleteSavedPresentation($(this).attr("data-id"));
                    }
                    else
                    {
                        console.log("do nothing");
                    }

                });
                //$("#savedpresentationsmodal").modal("show");
            },
            hideTransformControl: function()
            {
                $("#play").css("display", "none");
            },
            cloneElement: function(element)
            {
                clone = element.clone();
                clone.attr("id", "slideelement_" + me.generateUID());
                clone.css("left", pxToVw(element.position().left) + 0.2 + "vw");
                clone.css("top", pxToVw(element.position().top + 0.2) + "vw");
                me.clonedElement = clone;
                return me.clonedElement;
            },
            appendClonedElement: function()
            {
                console.log(me.clonedElement, "clonedelement");
                me.selectedSlide.append(me.clonedElement);
                var id = $(me.clonedElement).attr("id");
                me.enableDrag();
                me.selectedElement = $("#" + id);
                me.generateScaledSlide(me.selectedSlide);
                //On create text element, this is selected with click event
                launchEvent("click", me.selectedelement);
            },
            setupMenuItemEvents: function()
            {
                $("#makebold").on("click", function(e)
                {
                    e.stopPropagation();
                    document.execCommand('bold', false, null);
                });
                $("#makeitalic").on("click", function(e)
                {
                    e.stopPropagation();
                    document.execCommand('italic', false, null);
                });
                $("#makeunderline").on("click", function(e)
                {
                    e.stopPropagation();
                    document.execCommand('underline', false, null);
                });
                $("#makealignleft").on("click", function(e)
                {
                    e.stopPropagation();
                    document.execCommand('justifyLeft', false, null);
                });
                $("#makealignright").on("click", function(e)
                {
                    e.stopPropagation();
                    document.execCommand('justifyRight', false, null);
                });
                $("#makealigncenter").on("click", function(e)
                {
                    e.stopPropagation();
                    document.execCommand('justifyCenter', false, null);
                });
            },
            enableSort: function()
            {
                $(".slidethumbholder").sortable({update: function(event, ui)
                    {
                        console.log("sort updated", event, ui);
                        me.assignSlideNumbers();
                        me.reArrangeFullsliderSlides();
                    }});
                //$(".slidethumbholder").disableSelection();
            },
            cloneSlide: function(slide)
            {
                var uid = me.generateUID();
                var originalUid = slide.attr("id").replace("slidethumb_", "");

                //Clone thumbnail
                var clonedThumb = slide.clone();
                clonedThumb.attr("id", "slidethumb_" + uid);
                clonedThumb.removeClass("context-menu-active");
                $(".slidethumbholder").append(clonedThumb);
                $("#slidethumb_" + uid).animate({opacity: 1}, 200);

                //Change old uid by new uid in new thumbnail's deletebtn and canvas
                var deletebtn = $("#slidethumb_" + uid + " > #deletebtn");
                deletebtn.attr("data-parent", "slidethumb_" + uid);
                var thumbCanvas = $("#slidethumb_" + uid + " > canvas");
                thumbCanvas.attr("id", "slidethumb_" + uid);
                me.addSlideEvents();

                //Clone Slide
                var clonedSlide = $("#fullslider_slide_" + originalUid).clone();
                clonedSlide.attr("id", "fullslider_slide_" + uid);
                $(".fullslider-slide-container").append(clonedSlide);
                var children = $("#fullslider_slide_" + uid).children();
                for (var i = 0; i < children.length; i++)
                {
                    $(children[i]).attr("id", "slidelement_" + me.generateUID());
                }

                me.selectSlide("#fullslider_slide_" + uid);
                me.selectThumb(uid);
                me.enableDrag();
                me.updateScaledSlide(me.selectedSlide);
                me.selectCurrentClicked($("#slidethumb_" + uid));
            },
            copySlideToSlide: function(slidethumb) {
                var originalUid = slidethumb.attr("id").replace("slidethumb_", "");
                var slideUid = me.currentClicked.attr("id").replace("slidethumb_", "");

                var copiedSlide = $("#fullslider_slide_" + originalUid);
                var slide = $("#fullslider_slide_" + slideUid);

                slide.html(copiedSlide.html());

                var children = slide.children();
                for (var i = 0; i < children.length; i++)
                {
                    $(children[i]).attr("id", "slidelement_" + me.generateUID());
                }

                me.selectSlide("#fullslider_slide_" + slideUid);
                me.updateScaledSlide(me.selectedSlide);
                me.selectThumb(slideUid);
                me.enableDrag();
                me.selectCurrentClicked($("#slidethumb_" + slideUid));

            },
            reArrangeFullsliderSlides: function()
            {
                children = $(".slidethumbholder").children();
                var clonedElements = [];
                for (var i = 0; i < children.length; i++)
                {
                    child = children[i];
                    console.log("Rearrange child", child.id);
                    id = (child.id).split("_")[1];
                    el = $("#fullslider_slide_" + id);
                    clonedElements.push(el);
                }
                $(".fullslider-slide-container").html("");
                for (var j = 0; j < clonedElements.length; j++)
                {
                    console.log("el", clonedElements[j]);
                    $(".fullslider-slide-container").append(clonedElements[j]);
                }
                me.enableDrag();
            },
            setupDials: function()
            {
                $("#rotationknob").knob({change: function(v)
                    {
                        //me.rotateElement( v );
                        me.rotateElement(v);
                    }});
                $("#skewxknob").knob({change: function(v)
                    {
                        me.rotateElementX(v);
                    }});
                $("#skewyknob").knob({change: function(v)
                    {
                        me.rotateElementY(v);
                    }});
                $("#scalerange").on("change", function(e)
                {
                    console.log("moving scale", $(this).val());
                    me.selectedOrchElement.attr("data-scale", $(this).val());
                    id = me.selectedOrchElement.attr("id").split("_")[1];
                    $("#slidethumb_" + id).attr("data-scale", $(this).val());
                });
                $("#depthrange").on("change", function(e)
                {
                    me.selectedOrchElement.attr("data-z", $(this).val());
                    id = me.selectedOrchElement.attr("id").split("_")[1];
                    $("#slidethumb_" + id).attr("data-z", $(this).val());
                });
                $(".transformlabel").css("vertical-align", "top");
            },
            rotateElement: function(value)
            {
                //me.selectedOrchElement.css("transform-origin", "0 0");

                rotx = me.selectedOrchElement.attr("data-rotate-x");
                roty = me.selectedOrchElement.attr("data-rotate-y");
                s = "";
                if (rotx != undefined)
                {
                    s += "rotateX(" + rotx + "deg)";
                }
                if (roty != undefined)
                {
                    s += "rotateY(" + roty + "deg)";
                }
                str = s + " rotate(" + value + "deg)";
                me.selectedOrchElement.css("transform", str);
                console.log("css", me.selectedOrchElement.css("transform"));
                me.selectedOrchElement.attr("data-rotate", value);
                id = me.selectedOrchElement.attr("id").split("_")[1];
                console.log("Updating slidethumb", $("#slidethumb_" + id));
                $("#slidethumb_" + id).attr("data-rotate-x", rotx);
                $("#slidethumb_" + id).attr("data-rotate-y", roty);
                $("#slidethumb_" + id).attr("data-rotate", value);
                $("#slidethumb_" + id).attr("data-transform-string", str);
            },
            rotateElementX: function(value)
            {
                rot = me.selectedOrchElement.attr("data-rotate");
                roty = me.selectedOrchElement.attr("data-rotate-y");
                s = "";
                if (rot != undefined)
                {
                    console.log("rotated already", rot);
                    s += "rotate(" + rot + "deg)";
                }
                if (roty != undefined)
                {
                    s += "rotateY(" + roty + "deg)";
                }
                str = s + " rotateX(" + value + "deg)";
                console.log("Transform string before writing", str);
                me.selectedOrchElement.css("transform", str);
                me.selectedOrchElement.attr("data-rotate", value);
                console.log("css", me.selectedOrchElement.css("transform"));
                me.selectedOrchElement.attr("data-rotate-x", value);
                id = me.selectedOrchElement.attr("id").split("_")[1];
                console.log("Updating slidethumb", $("#slidethumb_" + id));
                $("#slidethumb_" + id).attr("data-rotate-x", value);
                $("#slidethumb_" + id).attr("data-rotate-y", roty);
                $("#slidethumb_" + id).attr("data-rotate", rot);
                $("#slidethumb_" + id).attr("data-transform-string", str);
            },
            rotateElementY: function(value)
            {
                rot = me.selectedOrchElement.attr("data-rotate");
                rotx = me.selectedOrchElement.attr("data-rotate-x");
                s = "";
                if (rot != undefined)
                {
                    console.log("rotated already", rot);
                    s += "rotate(" + rot + "deg)";
                }
                if (rotx != undefined)
                {
                    s += "rotateX(" + rotx + "deg)";
                }
                str = s + " rotateY(" + value + "deg)";
                console.log("Transform string before writing y", str);
                me.selectedOrchElement.css("transform", str);
                me.selectedOrchElement.attr("data-rotate", value);
                console.log("css", me.selectedOrchElement.css("transform"));
                me.selectedOrchElement.attr("data-rotate-y", value);
                id = me.selectedOrchElement.attr("id").split("_")[1];
                console.log("Updating slidethumb", $("#slidethumb_" + id));
                $("#slidethumb_" + id).attr("data-rotate-x", rotx);
                $("#slidethumb_" + id).attr("data-rotate-y", value);
                $("#slidethumb_" + id).attr("data-rotate", rot);
                $("#slidethumb_" + id).attr("data-transform-string", str);
            },
            setupPopover: function()
            {
                $(".slidelement").popover({html: "hello world", placement: "bottom", trigger: "click"});
            },
            enableDrag: function()
            {
                $(window).resize(function(e) {
                    if ((me.selectedforedit !== "") && ($("#welcomemodal").css("display") == "none")) {
                        launchEvent("dblclick", me.selectedforedit);
                    }
                    if (me.selectedElement !== "") {
                        scalePlay(me.selectedElement[0]);
                    }
                    else {

                    }
                });

//                $(".slidelement").resizable({
//                    handles: {
//                        'nw': '#play .ui-resizable-nw',
//                        'ne': '#play .ui-resizable-ne',
//                        'sw': '#play .ui-resizable-sw',
//                        'se': '#play .ui-resizable-se',
//                        'n': '#play .ui-resizable-n',
//                        'e': '#play .ui-resizable-e',
//                        's': '#play .ui-resizable-s',
//                        'w': '#play .ui-resizable-w'
//                    }
//                });

                $(".slidelement").draggable().on("dblclick", function(e)
                {
                    $(this).removeClass("grabbing");
                    if ($(this).attr("data-type") !== "image") {
                        me.editElement(this);
                    }
                }).on("click", function(e)
                {
                    me.selectCurrentClicked($(this));
                    e.stopPropagation();
                    me.selectElement(this);
                    me.updateScaledSlide(me.selectedSlide);
                }).on("mousedown", function(e)
                {
                    me.selectElement(this);
                    if (!($(this).attr("contentEditable") == "true")) {
                        $(this).removeClass("movecursor");
                        $(this).addClass("grabbing");
                    }
                }).on("mouseover", function(e)
                {
                    if (!($(this).attr("contentEditable") == "true")) {
                        $(this).addClass("movecursor");
                    }
                }).on("mouseup", function(e)
                {
                    if (!($(this).attr("contentEditable") == "true")) {
                        $(this).addClass("movecursor");
                    }
                }).on("drag", function(e)
                {
                    if (me.isSelected(this)) {
                        scalePlay(this);
                    }
                    drawElement(this);
                    me.updateScaledSlide(me.selectedSlide);
                    $(".slidelement").draggable().on("mouseup", function(e)
                    {
                        var maxwidth = calculateMaxWidth(this, $(".fullslider-slide-container"));
                        var maxheight = calculateMaxHeight(this, $(".fullslider-slide-container"));
                        $(this).css("max-width", maxwidth + "vw");
                        $(this).css("max-height", maxheight + "vw");
                        drawElement(this);
//                        me.selectElement(this);
                        $(this).removeClass("grabbing");
                    });
                }).on('blur keyup paste input', function() {
                    if ($(this).attr("contentEditable")) {
                        var mw = parseInt($(this).css("max-width").replace(/[^-\d\.]/g, ''));
                        var mh = parseInt($(this).css("max-height").replace(/[^-\d\.]/g, ''));
                        var left = $(this).css("left").replace(/[^-\d\.]/g, '');
                        var top = $(this).css("top").replace(/[^-\d\.]/g, '');
                        var continue_drecreasing = true;
                        while (continue_drecreasing && this.scrollWidth >= mw && this.scrollHeight >= mh) {
//                            if (left > 0) {
//                                left -= 4;
//                                $(this).css("left", pxToVw(left) + "vw");
//
//                                mw = calculateMaxWidth(this, $(".fullslider-slide-container"));
//                                mh = calculateMaxHeight(this, $(".fullslider-slide-container"));
//
//                                $(this).css("max-width", mw + "vw");
//                                $(this).css("max-height", mh + "vw");
//
//                                mw = vwToPx(mw);
//                                mh = vwToPx(mh);
//                            }
//                            else {
//                                if (top > 0) {
//                                    top -= 4;
//                                    $(this).css("top", pxToVw(top) + "vw");
//
//                                    mw = calculateMaxWidth(this, $(".fullslider-slide-container"));
//                                    mh = calculateMaxHeight(this, $(".fullslider-slide-container"));
//
//                                    $(this).css("max-width", mw + "vw");
//                                    $(this).css("max-height", mh + "vw");
//                                    mw = vwToPx(mw);
//                                    mh = vwToPx(mh);
//                                }
//                                else {
                            continue_drecreasing = decreaseSize($(this));
//                                }
//                            }
                        }
                    }
                });
                //only can moves in slide
                $(function() {
                    $(".ui-draggable").draggable({autoscroll: false, containment: ".fullslider-slide-container", scroll: false});
                });
            },
            positionTransformControl: function()
            {
                _transform = me.selectedElement.css("-webkit-transform");
                $("#play").css("-webkit-transform", _transform);
                $("#play").css("display", "block");
                scalePlay(me.selectedElement[0]);
                $("#spandelete").on("click", function(e)
                {
                    e.stopPropagation();
                    me.deleteElement(me.selectedElement);
                });
            },
            setTransformValues: function(el)
            {
                rotation = el.attr("data-rotate");
                skewx = el.attr("data-skewx");
                skewy = el.attr("data-skewy");
                $("#rotationknob").val(rotation || 0);
                $("#skewxknob").val(skewx || 0);
                $("#skewyknob").val(skewy || 0);
            },
            selectElement: function(el)
            {
                console.log("click firing....");
                // if not is in editionmode, select it
                if ($(el).attr("contentEditable") == "false" || typeof ($(el).attr("contentEditable")) == "undefined") {
                    me.clearElementSelections();
                    me.selectedElement = $(el);
                    $(el).addClass("elementselected");
                    $(el).attr("data-select", true);
                    //me.setTransformValues($(el));
                    me.positionTransformControl();
                }
            },
            isSelected: function(element) {
                return (element.getAttribute("data-select"));
            },
            editElement: function(el) {
                me.clearElementSelections();
                me.selectedforedit = el;
                $(el).draggable({disabled: true});
                $(el).addClass("elementediting");
                $(el).removeClass("movecursor");
            },
            deleteElement: function(el) {
                el.remove();
                me.updateScaledSlide(me.selectedSlide);
                $("#play").css("display", "none");
            },
            setupColorpickerPopup: function()
            {
                var $colorChooser = $(document).find(".color-chooser");
                if ($colorChooser.length > 0) {
                    var hex = '333';
                    $colorChooser.spectrum({
                        color: '#' + hex,
                        showSelectionPalette: true,
                        showPalette: true,
                        showInitial: true,
                        showInput: true,
                        palette: [],
                        clickoutFiresChange: true,
                        theme: 'sp-dark',
                        move: function(color) {
                            document.execCommand('foreColor', false, color.toHexString());
                        },
                        change: function(color) {
                            Backbone.trigger('etch:state', {
                                color: color.toHexString()
                            });
                        }
                    });
                    var prevent = function(e) {
                        e.preventDefault();
                    };
                    var replacer = $("#tools").find(".sp-replacer");
                    replacer.html('<i class="fa fa-tint"></i>');
                    replacer.addClass("btn btn-info menubtn");
                    replacer.removeClass("sp-replacer sp-dark");
                    $(".sp-replacer").mousedown(prevent);
                    $(".sp-container").mousedown(prevent);
                    $colorChooser.mousedown(prevent);
                    $colorChooser.find("div").css("backgroundColor", '#' + hex);
                }
            },
            addSettingsPanel: function(type)
            {
                if (!me.currentPresentation) {
                    me.createNewPresentation();
                }
                this.removelisteners();
                this.attachListeners();
            },
            manageGlobalClick: function(e)
            {
                //console.log("in globel ",e.target);
                //$(".dropdownpopup").css("display", "none");
                me.updateScaledSlide(me.selectedSlide);
                var t = $(e.target);
                if (t.not('.etch-editor-panel, .etch-editor-panel *, .etch-image-tools, .etch-image-tools *, .elementediting, .elementediting *,.sp-container *, .colorpicker *, #colorpickerbtn, #textToolsm, #textTools *').size() && !($("#addElementsPanel").find(t).length)) {
                    me.clearElementSelections();
                }

                me.selectCurrentClicked(t);
            },
            selectCurrentClicked: function(el) {
                if (me.currentClicked !== "" && !isInElement($(".context-menu-list"), el)) {
                    me.currentClicked.removeClass("currentClicked");
                    me.currentClicked = "";
                }
                var toSave = ""
                if (isInElement($(".slidethumbholder"), el)) {
                    toSave = el;
                    if (isInElement($(".slidethumb"), el) && el.attr("id") !== "deletebtn") {
                        if (!el.hasClass("slidethumb")) {
                            toSave = el.parent();
                        }
                    }
                    toSave.addClass("currentClicked");
                }
                else {
                    if (isElementByClass("slidelement", el)) {
                        toSave = el;
                    }
                }
                me.currentClicked = toSave;
            },
            clearElementSelections: function()
            {
                $("#play").css("display", "none");
                $(".slidelement").removeClass("elementhover");
                $(".slidelement").removeClass("elementselected");
                $(".slidelement").removeClass("elementediting");
                $(".slidelement").draggable({disabled: false});
                $(".slidelement").attr("data-select", false);
                $(".slidelement").attr("contentEditable", "false");
                me.selectedElement = "";
                me.selectedforedit = "";
            },
            colorSelectedElement: function(color)
            {
                if (me.selectedElement)
                {
                    me.selectedElement.css("color", color);
                }

            },
            addSlide: function()
            {
                thumb = slidethumb;
                uid = me.generateUID();
                thumb = thumb.split("slidethumb_^UID^").join("slidethumb_" + uid);
                $(".slidethumbholder").append(thumb);
                $("#slidethumb_" + uid).animate({opacity: 1}, 200);
                //$("#slidethumb_" + uid).attr("data-left", me.lastslideleftpos + "px");
                //$("#slidethumb_" + uid).attr("data-top", "0px");
                me.addSlideEvents();
                me.lastslideleftpos += 200;
                me.assignSlideNumbers();
                me.addFullsliderSlide(uid);
                $("#presentationmetatitle").html($("#titleinput").val());
            },
            addSlideEvents: function()
            {
                $(".deletebtn").on("click", function(e)
                {
                    p = $("#" + $(this).attr("data-parent"));
                    slideid = $(this).attr("data-parent").split("_")[1];
                    var index = $("#slidethumb_" + slideid).index();
                    console.log("parent", p, slideid);
                    p.animate({opacity: 0}, 200, function(e)
                    {
                        $(this).remove();
                        $("#fullslider_slide_" + slideid).remove();
                        me.assignSlideNumbers();
                        var children = $(".slidethumbholder").children();
                        var newslideid;
                        if (children[index]) {
                            newslideid = $(children[index]).attr("id");
                        }
                        else {
                            newslideid = $(children[index - 1]).attr("id");
                        }
                        newslideid = newslideid.split("_")[1];
                        me.selectSlide("#fullslider_slide_" + newslideid);
                        me.selectThumb(newslideid);
                    });
                });
                $(".slidemask").on("click", function(e)
                {
//                    e.stopPropagation();
                    id = (e.target.id).split("_")[1];
                    console.log("slidemask", id);
                    me.selectSlide("#fullslider_slide_" + id);
                    me.selectThumb(id);
                    me.hideTransformControl();
                });
            },
            addFullsliderSlide: function(id)
            {
                islide = fullslider_slide;
                islide = islide.split("__slidenumber__").join("_" + id);
                $(".fullslider-slide-container").append(islide);
                $("#fullslider_slide_" + id).addClass("fullslider-slide-element");
                //$("#fullslider_slide_"+id).addClass(me.theme);
                me.selectSlide("#fullslider_slide_" + id);
                me.selectThumb(id);
                me.addFullsliderText("normal");
                me.enableDrag();
            },
            addFullsliderSlideItem: function()
            {
                console.log("adding the new item....");
                item = text_snippet;
                var id = "slidelement_" + me.generateUID();
                item = item.split("slidelement_id").join(id);
                $(me.selectedSlide).append(item);
                return (document.getElementById(id));
            },
            addFullsliderText: function(type) {
                var element = me.addFullsliderSlideItem();
                me.addTextStyle(element, type);
                me.enableDrag();
                me.selectedelement = element;
                me.generateScaledSlide(me.selectedSlide);
            },
            addTextStyle: function(element, type) {
                switch (type) {
                    case "normal":
                        $(element).css("font-size", this.normalText + "vw");

                        break;
                    case "title":
                        $(element).css("font-size", this.titleText + "vw");
                        break;
                    case "subtitle":
                        $(element).css("font-size", this.subtitleText + "vw");
                        break;
                    default:
                        $(element).css("font-size", "1.75vw");
                        break;
                }
                
                $(element).css("position", "absolute");
                $(element).css("left", "24.6vw");
                $(element).css("top", "5.66vw");
                $(element).css("line-height", "initial", "important");
                $(element).css("color", "#000");
                $(element).css("height", "initial");
                $(element).css("width", "auto");
                $(element).css("white-space", "normal");
                $(element).css("font-family", "'Montserrat', sans-serif");
                var maxwidth = calculateMaxWidth(element, $(".fullslider-slide-container"));
                var maxheight = calculateMaxHeight(element, $(".fullslider-slide-container"));
                $(element).css("max-width", maxwidth + "vw");
                $(element).css("max-height", maxheight + "vw");
                $(element).css("overflow", "hidden");
                $(element).css("word-break", "break-word", "important");
            },
            addDataSelectable: function(element) {
                element.setAttribute("data-select", true);
                me.selectElement(element);
            },
            generateScaledSlide: function(el)
            {
                tempel = el;
                newel = $(el).clone();
                try
                {
                    id = newel.attr("id").split("_")[2];
                }
                catch (e)
                {
                    //error.
                }
                //$("clonethumb_"+id).remove();
                newel.attr("id", "clonethumb_" + id);
                newel.attr("data-clone", true);
                newel.css("transform", "scale(0.17, 0.197)");
                newel.css("-webkit-transform", "scale(0.17, 0.197)"); /* Safari and Chrome */
                newel.css("-moz-transform", "scale(0.17, 0.197)"); /* Firefox */
                newel.css("-ms-transform", "scale(0.17, 0.197)"); /* IE 9 */
                newel.css("-o-transform", "scale(0.17, 0.197)"); /* Opera */

                newel.removeClass("fullslider-slide-element");
                //newel.css("border", "1px solid #999");
                newel.css("left", "-25vw");
                newel.css("top", "-15.48vw");
                newel.css("width", "60.1896vw");
                newel.css("height", "38.653vw");
                children = $("#slidethumb_" + id).children();
                for (var i = 0; i < children.length; i++)
                {

                    child = children[i];
                    if ($(child).attr("data-clone") == "true")
                    {
                        $(child).remove();
                    }
                }

                $("#slidethumb_" + id).append(newel);
                //$(".orchestrationviewport").append( orchel );
                //$(".fullslider-slide").append( newel );


            },
            updateScaledSlide: function(el)
            {
                var id = el.attr("id").split("_")[2];
                var section = $("#slidethumb_" + id + " > section");
                section.html(el.html());
            },
            selectSlide: function(id)
            {
                children = $(".fullslider-slide-container").children();
                //console.log("I am in selection", children)
                for (var i = 0; i < children.length; i++)
                {
                    child = children[i];
                    childid = "#" + child.id;
                    if (childid == id)
                    {
                        //console.log("found", childid);
                        $(childid).css("z-index", 1);
                        me.selectedSlide = $(childid);
                    }
                    else
                    {
                        console.log("did not find", childid);
                        $(childid).css("z-index", -200 + (-(Math.round(Math.random() * 1000))));
                    }
                }
            },
            selectThumb: function(id)
            {
                $(".slidethumb").removeClass("currentselection");
                $("#slidethumb_" + id).addClass("currentselection");
            },
            assignSlideNumbers: function()
            {
                children = $(".slidethumbholder").children();
                //console.log("children", children);
                for (var i = 0; i < children.length; i++)
                {
                    child = $(children[i]);
                    count = i;
                    //console.log("child", $("#"+child[0].id).find(".slidedisplay").html())
                    $("#" + child[0].id).find(".slidedisplay").html("Slide " + (++count));
                    //slidenumber = $("#"+child[0].id).find(".slidedisplay").html();
                    //child.innerText = child.innerText.split("__text__").join("Slide "+(++count));
                }
            },
            generateUID: function()
            {
                return Math.round(Math.random() * 10000);
            },
            animateSettingsPanel: function(direction)
            {
                if (direction == "left")
                {
                    $(".settingsbox").animate({"left": "-500px", "opacity": 0}, {duration: 300, easing: "linear"});
                    me.menuopen = false;
                }
                if (direction == "right")
                {
                    $(".settingsbox").animate({"left": "230px", "opacity": 1}, {duration: 300, easing: "linear"});
                    me.menuopen = true;
                }
            },
            animatePanel: function(panel, amount)
            {
                $(".maskedcontainer").animate({"top": amount, "opacity": 1}, {duration: 300, easing: "linear"});
            },
            attachListeners: function()
            {
                $("html").on("click", me.manageGlobalClick);
                $(".settingsCancelBtn").on("click", me.onSettingsCancelClicked);
                $(".menuItemBtn").on("click", me.onMenuItemClicked);
                $(".slidelement").on("click", me.triggetElementEdit);
                $(".slidelement").on("mouseup", me.createEditor);
                $("#newstylepanel").on("click", me.openStyleSelector);
                $("#exportpresopanel").on("click", me.openCodeExportWindow);
                $("#editpresonamebtn").on("click", function(e)
                {
                    $("#newpresentationmodal").removeClass("hide");
                    $("#newpresentationmodal").modal("show");
                    $("#newpresoheader").html("Save Presentation As");
                    $("#titleinput").val($("#presentationmetatitle").text());
                    me.mode = "save";
                });
                $(".previewpresobtn").on("click", function(e)
                {
                    console.log("data parent id", $(this).attr("data-id"));
                    me.fetchAndPreview($(this).attr("data-id"));
                });
                $(".createpresentation").on("click", function(e)
                {

                    console.log("Mode", me.mode);
                    if (me.mode == "create")
                    {
                        me.createNewPresentation();
                    }
                    else
                    {
                        console.log("saving now");
                        $("#presentationmetatitle").html($("#titleinput").val());
                        me.currentPresentation.title = $("#titleinput").val();
                        me.savePresentation();
                    }
                    $(".modal").modal("hide");
                });
                $("#savepresentationbtn").on("click", function(e)
                {
                    if (me.currentPresentation)
                    {
                        console.log("Has access to current presentation");
                        me.clearElementSelections();
                        $("#titleinput").val(me.currentPresentation.title);
                    }
//                    $("#newpresentationmodal").removeClass("hide");
//                    $("#newpresentationmodal").modal("show");
                    me.mode = "save";
                    me.savePresentation();
                });
                $(".dropdownitem").on("click", function(e)
                {
                    console.log("Dd value: ", $(e.target).attr("data-dk-dropdown-value"));
                    me.changeTextFormat($(e.target).attr("data-dk-dropdown-value"));
                    $(".dropdownpopup").css("display", "block");
                    $(".pulldownmenu").html($(e.target).html());
                    //$(".dropdownpopup").css("display", "none");
                    me.dropdownopen = true;
                    me.hideTransformControl();
                });
                $("#addtextbtn,#normalTextBtn").on("click", function(e)
                {
                    console.log("add btn clicked...");
                    me.addFullsliderText("normal");
                    //On create text element, this is selected with click event
                    launchEvent("click", me.selectedforedit);
                });
                $("#titleTextBtn").on("click", function(e)
                {
                    console.log("add btn clicked...");
                    me.addFullsliderText("title");
                    //On create text element, this is selected with click event
                    launchEvent("click", me.selectedforedit);
                });
                $("#subtTextBtn").on("click", function(e)
                {
                    console.log("add btn clicked...");
                    me.addFullsliderText("subtitle");
                    //On create text element, this is selected with click event
                    launchEvent("click", me.selectedforedit);
                });
                $("#addimagebtn").on("click", function(e)
                {
                    console.log("open image modal...");
                    $("#imagemodal").removeClass("hide");
                    $("#imagemodal").modal("show");
                    $("#imageinput").focus();
                });
                $(".newpresopanel").on("click", function(e)
                {
                    $(".modal").modal("hide");
                    console.log("open image modal...");
                    $("#newpresentationmodal").removeClass("hide");
                    $("#newpresentationmodal").modal("show");
                    $("#titleinput").val("New Presentation")
                    $("#newpresoheader").html("Create New Presentation");
                    me.mode = "create";
                });
                $("#imageinput").on("blur keyup", function(e)
                {
                    image = $(this).val();
                    $("#previewimg").attr("src", image);
                });
                $("#addslidebtn").on("click", function(e)
                {
                    me.addSlide();
                });
                $("#appendimagebtn").on("click", function(e)
                {
                    console.log("append image to stage");
                    image = $("#previewimg").attr("src");
                    me.addImageToSlide(image);
                    $("#imagemodal").modal("hide");
                });
                $("#openpresentationsbtn").on("click", function(e)
                {
                    $(".previewpresobtn").on("click", function(e)
                    {
                        console.log("data parent id", $(this).attr("data-id"));
                        me.fetchAndPreview($(this).attr("data-id"));
                    });
                    $(".openpresobtn").on("click", function(e)
                    {
                        console.log("Edit presentation");
                        me.mode = "save";
                        me.openPresentationForEdit($(this).attr("data-id"));
                    });
                    $("#savedpresentationsmodal").removeClass("hide");
                    $("#savedpresentationsmodal").modal("show");
                });
                $("#viewbtn").on("click", function(e)
                {
                    var slides = me.generateExportMarkup();
                    me.generatePreview(slides);
                });
                $("#downloadpresbtn").on("mouseover", function(e)
                {
                    me.downloadFile(me.generateFile(), me.getFileName());
                });
                $(".loadpresbtn").on("click", function(e)
                {
                    $("#inputFile").click();
                });
                $('#inputFile').change(function(e) {
                    $(".loadpresbtn").button('loading');
                    var files = e.target.files;
                    var error = false;
                    if (!(/\.fspf$/).test(files[0].name)) {
                        var msg = "File extension is not supported. Fullslider only supports '.fspf' files.";
                        openAlert("danger", msg);
                        error = true;
                        $('input[name=openFile]').removeAttr('value');
                        $(".loadpresbtn").button('reset');
                    }
                    else {
                        var reader = new FileReader();
                        reader.addEventListener("loadend", function() {

                            var presentation;
                            try {
                                presentation = JSON.parse(reader.result);
                                if (!me.existPresentation(presentation.id)) {
                                    me.mypresentations.push(presentation);
                                }
                                error = me.isFileCorrupted(presentation);
                                if (error) {
                                    var msg = "Could not open the file. File is corrupted.";
                                    openAlert("danger", msg);
                                }
                                else {
                                    me.loadPresentation(presentation);
                                    var msg = "File has been loaded succesfully!";
                                    openAlert("success", msg);
                                    $("#welcomemodal").modal("hide");
                                }
                                $('input[name=openFile]').removeAttr('value');
                                $(".loadpresbtn").button('reset');
                            }
                            catch (e) {
                                var msg = "Could not open the file. File is corrupted.";
                                openAlert("danger", msg);
                            }
                        });
                        reader.readAsText(files[0]);
                        if (reader.readyState == 1) {
                            $(".loadpresbtn").button('reset');
                        }
                    }

                });
                $(".stylethumbnail").on("click", function(e)
                {
                    $(".stylethumbnail").css("border-bottom", "1px dotted #DDD");
                    $(this).css("border-bottom", "2px solid #1ABC9C");
                });
            },
            openStyleSelector: function()
            {
                $("#styleselectionmodal").modal("show");
            },
            deleteSavedPresentation: function(id)
            {
                var presentations = JSON.parse(me.getItem(me.saveKey));
                var presentation;
                for (var i = 0; i < presentations.length; i++)
                {
                    presentation = presentations[i];
                    if (id == presentation.id)
                    {
                        presentations.splice(i, 1);
                        break;
                    }
                }
                console.log("after delete", presentations);
                me.saveItem(me.saveKey, JSON.stringify(presentations));
                var lastsaved = JSON.parse(me.getItem(me.lastSaved));
                if ((lastsaved !== null) && lastsaved.id == id)
                {
                    console.log("lastsaved", lastsaved.id);
                    localStorage.removeItem(me.lastSaved);
                }
                presentations = me.getSavedPresentations();
                me.renderPresentations(presentations);
            },
            generateExportMarkup: function()
            {
                var children = $(".slidethumbholder").children();
//                var count = 0;
                for (var i = 0; i < children.length; i++)
                {
                    var child = $(children[i]);
                    var id = child.attr("id").split("_")[1];
//                    var l = count;
//                    count += 200;
//                    var t = child.attr("data-top").split("px")[0];

//                    var coords = me.calculateSlideCoordinates(l, t);
                    var el = $("#fullslider_slide_" + id);
//                    el.attr("data-x", coords.x - 500);
//                    el.attr("data-y", coords.y);
//                    el.attr("data-rotate", child.attr("data-rotate"));
//                    el.attr("data-rotate-x", child.attr("data-rotate-x"));
//                    el.attr("data-rotate-y", child.attr("data-rotate-y"));
//                    el.attr("data-z", child.attr("data-z"));
//                    el.attr("data-scale", child.attr("data-scale"));
//                    el.addClass("step");
                }
                var outputcontainer = $(".fullslider-slide-container").clone();
                console.log("output", $(".fullslider-slide-container").html().toString());
                outputcontainer.find(".fullslider-slide").each(function(i, object)
                {
                    console.log("Physically adding sizing information");
                });
                return (outputcontainer.html().toString());
            },
            createNewPresentation: function()
            {
                $(".slidethumbholder").html("");
                $(".fullslider-slide-container").html("");
                me.addSlide();
                var presentation = {
                    id: Math.round(Math.random() * 201020),
                    title: $("#presentationmetatitle").text(),
                    contents: $(".fullslider-slide-container").html().toString(),
                    thumbcontents: $(".slidethumbholder").html().toString(),
                };
                me.currentPresentation = presentation;
            },
            openPresentationForEdit: function(id)
            {
                console.log("id", id);
                for (var i = 0; i < me.mypresentations.length; i++)
                {
                    var presentation = me.mypresentations[i];
                    if (id == presentation.id)
                    {
                        me.loadPresentation(presentation);
                    }
                    $("#savedpresentationsmodal").modal("hide");
                }
            },
            isFileCorrupted: function(presentation) {
                var id = (presentation.id === undefined || presentation.id === null);
                var title = (presentation.title === undefined || presentation.title === null);
                var contents = (presentation.contents === undefined || presentation.contents === null);
                var thumbcontents = (presentation.thumbcontents === undefined || presentation.thumbcontents === null);
                var error = (id || title || contents || thumbcontents);
                return error;
            },
            fetchAndPreview: function(id)
            {
                for (var i = 0; i < me.mypresentations.length; i++)
                {
                    presentation = me.mypresentations[i];
                    if (id == presentation.id)
                    {
                        console.log("content", presentation.contents);
                        $(".placeholder").html(presentation.contents);
                        $(".placeholder").find(".fullslider-slide").each(function(i, object)
                        {
                            console.log("Physically adding sizing information, again");
                            $(this).css("width", "1024px");
                            $(this).css("height", "768px");
                            $(this).addClass("step");
                        });
                        me.generatePreview($(".placeholder").html().toString());
                        $("#savedpresentationsmodal").modal("hide");
                        break;
                    }
                }
            },
            getFileName: function() {
                var title = me.getTitle();
                title = title.replace(/\s+/g, '_');
                return title;
            },
            getTitle: function() {
                return ($("#presentationmetatitle").text());
            },
            savePresentation: function()
            {
                $("#savepresentationbtn").text("Saving...");
                var item = me.getItem(me.saveKey);
                var arr;
                if (item)
                {
                    arr = JSON.parse(item);
                    if (this.mode == "save")
                    {
                        if (me.currentPresentation)
                        {
                            arr = me.removeReference(arr);
                        }

                    }

                }
                else
                {
                    arr = [];
                }
                var tempid;
                if (this.mode == "save")
                {
                    if (me.currentPresentation)
                    {
                        tempid = me.currentPresentation.id;
                    }
                    else
                    {
                        tempid = Math.round(Math.random() * 201020);
                    }

                }
                else
                {
                    tempid = Math.round(Math.random() * 201020);
                }
                var o = {
                    id: tempid,
                    title: $("#presentationmetatitle").text(),
                    contents: $(".fullslider-slide-container").html().toString(),
                    thumbcontents: $(".slidethumbholder").html().toString(),
                };
                me.currentPresentation = o;
                $("#presentationmetatitle").html(me.currentPresentation.title);
                arr.push(o);
                me.saveItem(me.saveKey, JSON.stringify(arr));
                me.saveItem(me.lastSaved, JSON.stringify(o));
                presentations = me.getSavedPresentations();
                presentations.reverse();
                me.renderPresentations(presentations);
                $(".previewpresobtn").on("click", function(e)
                {
                    console.log("data parent id", $(this).attr("data-id"));
                    me.fetchAndPreview($(this).attr("data-id"));
                });
                $(".modal").modal("hide");
                setTimeout(me.resetSaveButtonText, 1000);
            },
            resetSaveButtonText: function()
            {
                $("#savepresentationbtn").html('<i class="glyphicon glyphicon-ok-sign"></i>&nbsp;Save');
            },
            generateFile: function() {
                var title = me.getTitle();
                var contents = me.generateExportMarkup();
                var thumbcontents = $(".slidethumbholder").html().toString();
                var id = me.currentPresentation.id;
                var file = {
                    'id': id,
                    'title': title,
                    'contents': contents,
                    'thumbcontents': thumbcontents
                };
                var text = JSON.stringify(file);
                var blob = new Blob([text], {type: "application/json"});
                return blob;
            },
            downloadFile: function(content, filename) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    var save = document.getElementById("downloadpresbtn");
                    save.setAttribute("href", event.target.result);
                    save.setAttribute("target", '_blank');
                    save.setAttribute("download", (filename + ".fspf") || (me.generateUID() + '.fspf'));
                    (window.URL || window.webkitURL).revokeObjectURL(save.href);
                };
                reader.readAsDataURL(content);
            },
            loadPresentation: function(presentation) {
                $(".fullslider-slide-container").html(presentation.contents);
                $(".slidethumbholder").html(presentation.thumbcontents);
                $(".slidethumbholder").each(function(i, object)
                {
                    $(this).css("opacity", 1);
                });
                var first_slide_id = $(".fullslider-slide-container").find(".fullslider-slide-element").attr("id");
                first_slide_id = first_slide_id.replace(/[^-\d\.]/g, '');
                me.selectSlide("#fullslider_slide_" + first_slide_id);
                me.selectThumb(first_slide_id);
                me.currentPresentation = presentation;
                $("#presentationmetatitle").html(me.currentPresentation.title);
                console.log("rendered");
                $("#savedpresentationsmodal").modal("hide");
                $(".slidemask").on("click", function(e)
                {
                    console.log("repopulated zone");
                    e.stopPropagation();
                    id = (e.target.id).split("_")[1];
                    console.log("slidemask", id);
                    me.selectSlide("#fullslider_slide_" + id);
                    me.selectThumb(id);
                    me.hideTransformControl();
                });
                $(".deletebtn").on("click", function(e)
                {
                    p = $("#" + $(this).attr("data-parent"));
                    slideid = $(this).attr("data-parent").split("_")[1];
                    console.log("parent", p, slideid);
                    p.animate({opacity: 0}, 200, function(e)
                    {
                        $(this).remove();
                        $("#fullslider_slide_" + slideid).remove();
                        me.assignSlideNumbers();
                    });
                });
                me.enableDrag();
                me.mode = "save";
                me.savePresentation();
            },
            existPresentation: function(id) {
                var exist = false;
                var i = 0;
                var presentation = null;
                while ((!exist) && (i < me.mypresentations.length))
                {
                    presentation = me.mypresentations[i];
                    if (id == presentation.id)
                    {
                        exist = true;
                    }
                    i++;
                }
                return exist;
            },
            removeReference: function(arr)
            {

                for (var i = 0; i < arr.length; i++)
                {
                    if (arr[i].id == me.currentPresentation.id)
                    {
                        arr.splice(i, 1);
                        break;
                    }
                }

                return arr;
            },
            getSavedPresentations: function()
            {
                var item = me.getItem(me.saveKey);
                arr = [];
                if (item)
                {
                    arr = JSON.parse(item);
                }
                return arr;
            },
            generatePreview: function(str)
            {
                sessionStorage.setItem('preview', str);
                sessionStorage.setItem('title', me.getTitle());
//                window.open("app/components/impress.js/index.html");
                window.open("app/components/reveal.js/index.html");
            },
            calculateSlideCoordinates: function(wx, wy)
            {
                var vx = Math.round(((me.vxmax - me.vxmin) / (me.wxmax - me.wxmin)) * (wx - me.wxmin) + me.vxmin);
                var vy = Math.round(((me.vymax - me.vymin) / (me.wymax - me.wymin)) * (wy - me.wymin) + me.vymin);
                var object = {x: vx, y: vy};
                console.log("object", object);
                return object;
            },
            addImageToSlide: function(src)
            {
                console.log("adding image", src);
                var img = new Image();
                var id = me.generateUID();
                $(img).attr("id", "slidelement_" + id);
                $(img).css("left", "15vw");
                $(img).css("top", "15vw");
                $(img).addClass("slidelement");
                $(img).attr("src", src);
                $(img).attr("data-type", "image");
                console.log("selectedslide", me.selectedSlide);
                me.selectedSlide.append($(img));
                var im_height = $("#slidelement_" + id)[0].offsetHeight;
                var im_width = $("#slidelement_" + id)[0].offsetWidth;
                var scale;
                if (im_height < im_width) {
                    scale = im_width / im_height;
                    im_height = 7;
                    im_width = 7 * scale;
                }
                else {
                    if (im_height > im_width) {
                        scale = im_height / im_width;
                        im_width = 7;
                        im_height = 7 * scale;
                    }
                    else {
                        im_height = 7;
                        im_width = 7;
                    }
                }

                $(img).css("height", im_height + "vw");
                $(img).css("width", im_width + "vw");
                me.enableDrag();
            },
            removeSlide: function(el)
            {
                el.remove();
                clearInterval(me.deleteslideinterval);
            },
            createEditor: function(e)
            {
                editor = $(e.target).clone();
                //editor.attr("contentEditable", "true");
            },
            triggetElementEdit: function(e)
            {
                //$(e.target).attr("contentEditable", true);
            },
            removelisteners: function()
            {
                $(".settingsCancelBtn").off();
                $(".viewtogglebtn").off();
            },
            onSettingsCancelClicked: function(e)
            {
                console.log("clicked");
                me.animateSettingsPanel("left");
            },
            onMenuItemClicked: function(e)
            {
                $("#newpresentationmodal").removeClass("hide");
                $("#newpresentationmodal").modal("show");
                $("#newpresoheader").html("Create New Presentation");
                me.mode = "create";
            },
            calculateThumbnailCoords: function(wx,
                    wy,
                    vxmax,
                    vxmin,
                    vymax,
                    vymin,
                    wxmax,
                    wxmin,
                    wymax,
                    wymin
                    )
            {
                var vx = Math.round(((vxmax - vxmin) / (wxmax - wxmin)) * (wx - wxmin) + vxmin);
                var vy = Math.round(((vymax - vymin) / (wymax - wymin)) * (wy - wymin) + vymin);
                var object = {x: vx, y: vy};
                return object;
            },
            saveItem: function(key, value)
            {
                if (me.isSupported())
                {
                    localStorage.setItem(key, value);
                }

            },
            getItem: function(key)
            {
                if (me.isSupported()) {
                    return localStorage.getItem(key);
                }
            },
            isSupported: function()
            {
                if (localStorage)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            },
            getCurrentClicked: function() {
                return me.currentClicked;
            },
            getSelectedElement: function() {
                return me.selectedElement;
            },
            getSelectedForEdit: function() {
                return me.selectedforedit;
            },
            getClonedElement: function() {
                return me.clonedElement;
            },
        };
