/**
 * Client id - 813346482484.apps.googleusercontent.com
 */
Impressionist = function()
{

    this.menuopen = false;

    this.useragent;
    this.useragent_tag;

    this.selectedElement;
    this.selectedforedit;

    this.imageOnEdit;

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
    this.currentClicked = "";


    this.isBold = false;
    this.isItalic = false;
    this.isUnderlined = false;
    this.isLeftAligned = false;
    this.isRightAligned = false;
    this.isCenterAligned = false;

    this.normalSize;
    this.titleSize;
    this.subtitleSize;

    this.normalFont;
    this.titleFont;
    this.subtitleFont;

    this.normalColor;
    this.titleColor;
    this.subtitleColor;

    this.boundTextOption;
    this.showSlideNumbers;

    this.patterns = {};

    this.wait_s = false;

    this.changesCounter = 0;
};
Impressionist.prototype =
        {
            initialize: function()
            {
                me = this;
                me.continueInit();
                me.getUserAgent();
//                me.openNewPresentationWindow();
            },
            continueInit: function()
            {
                me.loadDefaultConfig();
                me.removelisteners();
                me.initializeWelcomePanel();
                me.initializeImageModal();
                me.initializeEditImageModal();
                me.initializeNewPresModal();
                me.initializeMyPresModal();
                me.initializeConfigModal();
                me.initializeAlerts();
                me.initializeGraphics();
                me.setupColorpickerPopup($("#configmodal"));
                me.enableSort();
//                me.setupPopover();
                me.hideTransformControl();
                //Load array with all saved presentations
                var presentations = me.getSavedPresentations();
                me.renderPresentations(presentations);

                //Load last saved presentation
                //me.openLastSavedPresentation();

                me.attachListeners();
                me.changesCounter = 0;
                me.openWelcomePanel();
            },
            getUserAgent: function() {
                me.useragent = getUserAgent();
                me.useragent_tag = getUserAgentTag(me.useragent);
            },
            loadDefaultConfig: function() { //Load default config on Fullslider attributes
                me.loadDefaultText();
                me.boundTextOption = "nothingradio";
                me.showSlideNumbers = "dontshowslidenumbersradio";
            },
            initializeWelcomePanel: function() {
                $("#modals").append(welcome_panel);
            },
            initializeImageModal: function() {
                $("#modals").append(add_img_modal);

                //Upload image from device
                $("#inputimage").fileinput({
                    uploadUrl: "/uploadimage", // server upload action
                    uploadAsync: true,
                    maxFileCount: 5,
                    showUpload: false, // hide upload button
                    showRemove: false, // hide remove button
                }).on("filebatchselected", function(event, files) { //For auto-upload images
                    // trigger upload method immediately after files are selected
                    $("#inputimage").fileinput("upload");
                });

                $("#inputimage").on('fileuploaded', function(event, data, previewId, index) {
                    //Clear preview
                    $('#inputimage').fileinput('clear');
                    $('#inputimage').fileinput('refresh');
                    $('#inputimage').fileinput('unlock');
//                    me.addImageToSlide(data.response);

                    //Create image from returned json object of loadimage module
                    createImageFromJSONFile(data.response);
                    $("#imagemodal").modal("hide");
                });
            },
            initializeEditImageModal: function() {
                $("#modals").append(edit_img_modal);
                $("#editimgmodal").find(".modal-body").append(crop_menu);
            },
            initializeNewPresModal: function() {
                $("#modals").append(new_pres_modal);
            },
            initializeMyPresModal: function() {
                $("#modals").append(my_pres_modal);
            },
            initializeConfigModal: function() {
                $("#modals").append(config_modal);
                $('#configTab a').click(function(e) {
                    $(this).tab('show');
                });
                var text_config_li = $("#textFormat").find("ul").children();
                var normal_children = $(text_config_li[0]).children();
                var title_children = $(text_config_li[1]).children();
                var subt_children = $(text_config_li[2]).children();

                $(normal_children[1]).attr("id", "normal_text_size");
                $(normal_children[2]).attr("id", "normal_text_font");
                $(normal_children[3]).attr("id", "normal_text_color");

                $(title_children[1]).attr("id", "title_text_size");
                $(title_children[2]).attr("id", "title_text_font");
                $(title_children[3]).attr("id", "title_text_color");

                $(subt_children[1]).attr("id", "subt_text_size");
                $(subt_children[2]).attr("id", "subt_text_font");
                $(subt_children[3]).attr("id", "subt_text_color");
            },
            initializeAlerts: function() {
                $("#modals").append(alert_danger);
                $("#dangeralert").fadeOut(0);
                $("#modals").append(alert_success);
                $("#successalert").fadeOut(0);
                $("#modals").append(alert_warning);
                $("#warningalert").fadeOut(0);
                $("#modals").append(alert_info);
                $("#infoalert").fadeOut(0);
            },
            initializeGraphics: function() {
                jsvectoreditor_init();
            },
            openWelcomePanel: function() {
                $("#welcomemodal").removeClass("hide");
                $("#welcomemodal").modal("show");
            },
            openLastSavedPresentation: function()
            {
                var presentation = JSON.parse(me.getItem(me.lastSaved));
                if (!presentation)
                {
                    var savedpresos = JSON.parse(me.getItem(me.saveKey));
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
                clone.attr("id", "slidelement_" + me.generateUID());
                clone.css("left", pxToVw(element.position().left) + 0.2 + "vw");
                clone.css("top", pxToVw(element.position().top + 0.2) + "vw");
                me.clonedElement = clone;
                return me.clonedElement;
            },
            clonePatternElement: function(element)
            {
                var clone = $(element).clone();
                var id = clone.attr("id").replace(/[0-9]/g, '');
                id = id + me.generateUID();
                clone.attr("id", id);
                return clone;
            },
            appendClonedElement: function()
            {
                me.clearCurrentClicked();
                me.selectCurrentClicked($(me.clonedElement));
                me.selectedSlide.append(me.clonedElement);
                var id = $(me.clonedElement).attr("id");
                me.enableDrag();
                me.selectElement($("#" + id));
                me.updateScaledSlide(me.selectedSlide);
            },
            enableSort: function()
            {
                $(".slidethumbholder").sortable({
                    update: function(event, ui)
                    {
                        me.assignSlideNumbers();
                        me.reArrangeFullsliderSlides();
                        changeContent();//Event for undo redo
                    }
                });
                //$(".slidethumbholder").disableSelection();
            },
            formatClonedSlide: function(slide) { //For cloned elements into slide
                var children = slide.children();
                for (var i = 0; i < children.length; i++)
                {
                    $(children[i]).attr("id", "slidelement_" + me.generateUID());
                }
            },
            cloneSlide: function(slide) {
                var uid = me.generateUID();

                var clonedSlide = slide.clone();
                clonedSlide.attr("id", "fullslider_slide_" + uid);
                $(".fullslider-slide-container").append(clonedSlide);
                me.formatClonedSlide($("#fullslider_slide_" + uid));

                me.addSlideThumb(uid);
                me.selectSlide("#fullslider_slide_" + uid);
                me.generateScaledSlide(me.selectedSlide);

                me.addSlideEvents();
                me.selectThumb(uid);
                me.enableDrag();
                me.selectCurrentClicked($("#slidethumb_" + uid));
            },
            copySlideToSlide: function(slide) {
                var slideUid = me.currentClicked.attr("id").replace("slidethumb_", "");

                var targetSlide = $("#fullslider_slide_" + slideUid);

                targetSlide.html(slide.html());

                me.formatClonedSlide(targetSlide);

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
                    id = (child.id).split("_")[1];
                    el = $("#fullslider_slide_" + id);
                    clonedElements.push(el);
                }
                $(".fullslider-slide-container").html("");
                for (var j = 0; j < clonedElements.length; j++)
                {
                    $(".fullslider-slide-container").append(clonedElements[j]);
                }
                me.enableDrag();
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
                me.selectedOrchElement.attr("data-rotate", value);
                id = me.selectedOrchElement.attr("id").split("_")[1];
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
                    s += "rotate(" + rot + "deg)";
                }
                if (roty != undefined)
                {
                    s += "rotateY(" + roty + "deg)";
                }
                str = s + " rotateX(" + value + "deg)";
                me.selectedOrchElement.css("transform", str);
                me.selectedOrchElement.attr("data-rotate", value);
                me.selectedOrchElement.attr("data-rotate-x", value);
                id = me.selectedOrchElement.attr("id").split("_")[1];
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
                    s += "rotate(" + rot + "deg)";
                }
                if (rotx != undefined)
                {
                    s += "rotateX(" + rotx + "deg)";
                }
                str = s + " rotateY(" + value + "deg)";
                me.selectedOrchElement.css("transform", str);
                me.selectedOrchElement.attr("data-rotate", value);
                me.selectedOrchElement.attr("data-rotate-y", value);
                id = me.selectedOrchElement.attr("id").split("_")[1];
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
                $(".slidelement").draggable().on("dblclick", function(e)
                {
                    $(this).removeClass("grabbing");
                    switch ($(this).attr("data-type")) {
                        case "text":
                        case "code":
                        case "graphic":
                            me.editElement(this);
                            break;
                        case "image":
                            me.editImageElement(this);
                            break;
                    }
                }).on("click", function(e)
                {
                    e.stopPropagation();
                    me.toSelectElement(this);
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
                }).keydown(function(e)//Default contenteditable undo/redo shortcuts disabled
                {
                    if ($(this).attr("contentEditable") == "true") {
                        if (isUndo(e)) {
                            e.preventDefault();
                        }
                        else {
                            if (isRedo(e)) {
                                e.preventDefault();
                            }
                            else {
                                if (e.ctrlKey) {
                                    if (e.ctrlKey && e.altKey && (e.which != "18" && e.which != "17" && e.which != "16")) { //Alt gr + key
                                        changeContent();
                                    }
                                    else {
                                    }
                                }
                                else {
                                    if (e.altKey && e.which == "18" || e.shiftKey && e.which == "16") { // Only alt or only shift
                                        //nothing
                                    }
                                    else {
                                        switch (e.which) {
                                            case 37:
                                                break;
                                            case 38:
                                                break;
                                            case 39:
                                                break;
                                            case 40:
                                                break;
                                            default:
                                                changeContent();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }).on("keyup", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if ($(this).attr("contentEditable") == "true") {
                        switch ($(this).attr("data-type")) {
                            case "text":
                                if ($(this).html() == "" || $(this).html() == "<br>" || $($(this).children("div")[0]).html() == "<br>" || ($($(this).find["font"]).size() > 1 && $($(this).find["font"][0]).html() == "<br>")) {
                                    $(this).html(text_inner);
                                }
                                break;
                            case "code":
                                var code = $(this).find("code")[0];
                                if (typeof $(code).find("ol")[0] == "undefined" || $(this).html() == "" || $(this).html() == "<br>") {
                                    $(this).html(code_inner);
                                }
                                break;
                        }
                    }
                }).on("drag", function(e)
                {
                    if (me.isSelected(this)) {
                        scalePlay(this);
                    }
                    drawElement(this);
                    me.updateScaledSlide(me.selectedSlide);
                }).on('dragstop', function(e) {
                    e.stopImmediatePropagation();
                    var maxwidth = calculateMaxWidth(this, $(".fullslider-slide-container"));
                    var maxheight = calculateMaxHeight(this, $(".fullslider-slide-container"));
                    $(this).css("max-width", maxwidth + "vw");
                    $(this).css("max-height", maxheight + "vw");
                    drawElement(this);
                    if(e.isImmediatePropagationStopped){
                        modifyElement(this);
                    }
//                        me.selectElement(this);
                    $(this).removeClass("grabbing");
                    changeContent();//Event for undo redo
                }).on('blur keyup paste input', function() {
                    if ($(this).attr("contentEditable")) {
                        var mw = parseInt($(this).css("max-width").replace(/[^-\d\.]/g, ''));
                        var mh = parseInt($(this).css("max-height").replace(/[^-\d\.]/g, ''));
                        var left = $(this).css("left").replace(/[^-\d\.]/g, '');
                        var top = $(this).css("top").replace(/[^-\d\.]/g, '');
                        var continue_drecreasing = true;
                        while (continue_drecreasing && this.scrollWidth >= mw && this.scrollHeight >= mh) {
                            if (left > 0 && me.boundTextOption === "bothradio") {
                                left -= 4;
                                $(this).css("left", pxToVw(left) + "vw");

                                mw = calculateMaxWidth(this, $(".fullslider-slide-container"));
                                mh = calculateMaxHeight(this, $(".fullslider-slide-container"));

                                $(this).css("max-width", mw + "vw");
                                $(this).css("max-height", mh + "vw");

                                mw = vwToPx(mw);
                                mh = vwToPx(mh);
                            }
                            else {
                                if (top > 0 && (me.boundTextOption === "topradio" || (left <= 0 && me.boundTextOption === "bothradio"))) {
                                    top -= 4;
                                    $(this).css("top", pxToVw(top) + "vw");

                                    mw = calculateMaxWidth(this, $(".fullslider-slide-container"));
                                    mh = calculateMaxHeight(this, $(".fullslider-slide-container"));

                                    $(this).css("max-width", mw + "vw");
                                    $(this).css("max-height", mh + "vw");
                                    mw = vwToPx(mw);
                                    mh = vwToPx(mh);
                                }
                                else {
                                    continue_drecreasing = decreaseSize($(this));
                                }
                            }
                        }
                    }
                });
                //only can moves in slide
                $(function() {
                    $(".slidelement.ui-draggable").draggable({autoscroll: false, containment: ".fullslider-slide-container", scroll: false});
                });
            },
            positionTransformControl: function()
            {
                _transform = me.selectedElement.css("-webkit-transform");
                $("#play").css("-webkit-transform", _transform);
                $("#play").css("display", "block");
                scalePlay(me.selectedElement[0]);
                $("#spandelete").off();//restore
                $("#spandelete").on("click", function(e)
                {
                    e.stopPropagation();
                    me.deleteElement(me.selectedElement);
                    changeContent();//Event for undo redo
                });
            },
            toSelectElement: function(el) {
                me.selectCurrentClicked($(el));
                me.selectElement(el);
                me.updateScaledSlide(me.selectedSlide);
                if ($(el).hasClass("elementediting")) {
                    launchEvent("click", $(".etch-editor-panel")[0]); //For close color picker
                }
            },
            selectElement: function(el)
            {
                // if not is in editionmode, select it
                if (($(el).attr("contentEditable") == "false" || typeof ($(el).attr("contentEditable")) == "undefined") && (me.imageOnEdit == "" || typeof (me.imageOnEdit) == "undefined")) {
                    me.clearElementSelections();
                    me.selectedElement = $(el);
                    $(el).addClass("elementselected");
                    $(el).attr("data-select", true);
                    me.positionTransformControl();
                }
            },
            isSelected: function(element) {
                return (element.getAttribute("data-select"));
            },
            editElement: function(el) {
                me.clearElementSelections();
                me.selectedforedit = el;
                $(".slidelement").attr("contentEditable", "false");
                $(el).attr('contenteditable', true);
                $(el).draggable({disabled: true});
                $(el).addClass("elementediting");
                $(el).removeClass("movecursor");
                $(el).removeClass("elementselectable");
            },
            editImageElement: function(el) {
                me.clearElementSelections();
                me.imageOnEdit = el;
                var image_url = $(el).find("img").attr("src");
                $("#image-crop").attr("src", image_url);
                $("#image-crop").change(); //Change event for cropimage.js function

                $("#editimgmodal").removeClass("hide");
                $("#editimgmodal").modal("show");
            },
            saveEditImage: function(image_data) {
                var i = new Image();
                i.onload = function() {
                    var data = {src: this.src, width: this.width, height: this.height, element: $(me.imageOnEdit)};
                    me.addImageStyle(data);
                    var element = me.imageOnEdit;
                    me.clearElementSelections();
                    me.selectElement(element);
                    me.generateScaledSlide(me.selectedSlide);

                    changeContent();//Event for undo redo
                    $(".modal").modal("hide");
                };
                i.src = image_data;
            },
            deleteElement: function(el) {
                deleteElementList(el.context.id);
                el.remove();
                me.updateScaledSlide(me.selectedSlide);
                $("#play").css("display", "none");
            },
            addElemOnAllSlides: function(el) {
                $(".fullslider-slide-container").find(".fullslider-slide").each(function() {
                    $(this).append(me.clonePatternElement(el));
                    me.updateScaledSlide($(this));
                });
            },
            setupColorpickerPopup: function(element)
            {
                var $colorChooser = $(element).find(".color-chooser");
                if ($colorChooser.length > 0) {
                    var hex = '333';
                    $colorChooser.spectrum({
                        color: '#' + hex,
                        preferredFormat: "hex",
                        showSelectionPalette: true,
                        showPalette: true,
                        showInitial: true,
                        showInput: true,
                        cancelText: '<i class="fa fa-remove"></i>',
                        chooseText: '<i class="fa fa-check"></i>',
                        palette: [],
                        clickoutFiresChange: false,
                        theme: 'sp-dark',
                        change: function(color) {
//                            document.execCommand('foreColor', false, color.toHexString());
                            Backbone.trigger('etch:state', {
                                color: color.toHexString()
                            });
                            changeContent();//Event for undo redo
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
            },
            manageGlobalClick: function(e)
            {
                me.updateScaledSlide(me.selectedSlide);
                var t = $(e.target);
                if (t.not('.etch-editor-panel, .etch-editor-panel *, .etch-image-tools, .etch-image-tools *, .elementediting, .elementediting *,.sp-container *, .colorpicker *, #colorpickerbtn, #textToolsm, #textTools *, .contextmenu-textEditing *, #editimgmodal *').size()) {
                    if ($(me.selectedforedit).attr("data-type") == "code") {
                        me.prettifyCode();
                    }
                    me.clearElementSelections(e);
                }
                if (!isInElement($("#menu"), t)) {
                    $('#menu').removeClass('open');
                }
                e.stopPropagation();
                me.selectCurrentClicked(t);
            },
            selectCurrentClicked: function(el) {
                if (me.currentClicked !== "" && !isInElement($(".context-menu-list"), el)) {
                    me.clearCurrentClicked();
                }
                var toSave = "";
                if (isInElement($(".slidethumbholder"), el)) {
                    toSave = el;
                    if (isInElement($(".slidethumb"), el) && el.attr("id") !== "deletebtn") {
                        if (!el.hasClass("slidethumb")) {
                            toSave = el.parent();
                        }
                    }
                    $(toSave).addClass("currentClicked");
                }
                else {
                    if (isElementByClass("slidelement", el)) {
                        toSave = el;
                        toSave.addClass("currentClicked");
                    }
                    else {
                        if (isElementByClass("fullslider-slide", el)) {
                            toSave = el;
                            toSave.addClass("currentClicked");
                        }
                    }
                }
                me.currentClicked = toSave;
            },
            clearCurrentClicked: function() {
                me.currentClicked.removeClass("currentClicked");
                var currentClicked = $(document.body).find(".currentClicked");
                for (var i = 0; i < currentClicked.length; i++) {
                    $(currentClicked[0]).removeClass("currentClicked");
                }
                me.currentClicked = "";
            },
            clearElementSelections: function(e)
            {
                t=null;
                if (e) {
                    var t = $(e.target);
                }
                $("#play").css("display", "none");
                $(".slidelement").removeClass("elementhover");
                $(".slidelement").removeClass("elementselected");
                $(".slidelement").removeClass("elementediting");
                $(".slidelement").addClass("elementselectable");
                $(".slidelement").draggable({disabled: false});
                $(".slidelement").attr("data-select", false);
                $(".slidelement").attr("contentEditable", "false");
                me.selectedElement = "";
                me.selectedforedit = "";
                if (me.imageOnEdit != "" && $(me.imageOnEdit).attr("contentEditable") == "false" && !isInElement($(".contextual_cropimage"), t)) { //If not is editing image (for crop from context menu)
                    me.imageOnEdit = "";
                }
            },
            colorSelectedElement: function(color)
            {
                if (me.selectedElement)
                {
                    me.selectedElement.css("color", color);
                }

            },
            addSlideThumb: function(uid) {
                thumb = slidethumb;
                thumb = thumb.split("slidethumb_^UID^").join("slidethumb_" + uid);
                $(".slidethumbholder").append(thumb);
                $("#slidethumb_" + uid).animate({opacity: 1}, 200);
            },
            addSlide: function()
            {
                uid = me.generateUID();
                me.addSlideThumb(uid);
                //$("#slidethumb_" + uid).attr("data-left", me.lastslideleftpos + "px");
                //$("#slidethumb_" + uid).attr("data-top", "0px");
                me.addSlideEvents();
                me.lastslideleftpos += 200;
                me.assignSlideNumbers(true);
                me.addFullsliderSlide(uid);
                $("#presentationmetatitle").html($("#titleinput").val());
                changeContent();//Event for undo redo
                addSlideList(uid);
            },
            
            deleteSlide: function(sl) {
	           slideid = $(sl).attr("id").split("_")[2];
               deleteSlideList(slideid);
	           p = $("#slidethumb_" + slideid);
	           var index = $("#slidethumb_" + slideid).index();
	           p.animate({opacity: 0}, 200, function(e){
		          $(this).remove();
		          $("#fullslider_slide_" + slideid).remove();
		          me.assignSlideNumbers();
		          var children = $(".slidethumbholder").children();
		          var newslideid;
		          if (children[index]) {
			         newslideid = $(children[index]).attr("id");
		          }
		          else {
			         ewslideid = $(children[index - 1]).attr("id");
		          }
		          newslideid = newslideid.split("_")[1];
		          me.selectSlide("#fullslider_slide_" + newslideid);
		          me.selectThumb(newslideid);
	           });
            },
            deleteIdSlide: function(id) {
	           p = $("#slidethumb_" + id);
	           var index = $("#slidethumb_" + id).index();
	           p.animate({opacity: 0}, 200, function(e){
		          $(this).remove();
		          $("#fullslider_slide_" + id).remove();
		          me.assignSlideNumbers();
		          var children = $(".slidethumbholder").children();
		          var newslideid;
		          if (children[index]) {
			         newslideid = $(children[index]).attr("id");
		          }
		          else {
			         ewslideid = $(children[index - 1]).attr("id");
		          }
		          newslideid = newslideid.split("_")[1];
		          me.selectSlide("#fullslider_slide_" + newslideid);
		          me.selectThumb(newslideid);
	           });
            },
            addSlideEvents: function()
            {
                $(".deletebtn").on("click", function(e)
                {
                    p = $("#" + $(this).attr("data-parent"));
                    slideid = $(this).attr("data-parent").split("_")[1];
                    var index = $("#slidethumb_" + slideid).index();
                    p.animate({opacity: 0}, 200, function(e)
                    {
                        $(this).remove();
                        $("#fullslider_slide_" + slideid).remove();
                        deleteSlideList(slideid);
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
                    changeContent();//Event for undo redo
                });
                $(".slidemask").on("click", function(e)
                {
//                    e.stopPropagation();
                    id = (e.target.id).split("_")[1];
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
                //me.addFullsliderTextMD("title", "Title Slide", "normal");

                //Slidenumbers
                $(me.selectedSlide).append(slidenumbers_snippet);
                me.setSlideNumbersDisplay();
                me.setSlideNumber();

                for (var i in me.patterns) {
                    $(me.selectedSlide).append(me.clonePatternElement(me.patterns[i]));
                }
                me.generateScaledSlide(me.selectedSlide);
            },
            addFullsliderSlideItem: function(template)
            {
                var id = "slidelement_" + me.generateUID();
                template = template.split("slidelement_id").join(id);
                $(me.selectedSlide).append(template);
                return (document.getElementById(id));
            },
            finishAddFile: function(element) {
                me.enableDrag();
                me.toSelectElement($(element)[0]);
                me.updateScaledSlide(me.selectedSlide);
            },
            addFullsliderText: function(type) {
                var mText = text_snippet.replace("Sample Text", "<div> Sample Text </div>");
                var element = me.addFullsliderSlideItem(mText);
                me.addTextStyle(element, type, "normal");
                me.finishAddFile($(element));
                addTextList(element.id, type);
            },
            addTextStyle: function(element, type, mode) {
                if(type == 'normal'){
                    var options = getOptions('text');
                }
                else{
                    var options = getOptions(type);
                }
                var size = "";
                var font = "";
                var color = "";
                switch (type) {
                    case "normal":
                        size = me.normalSize;
                        color = me.normalColor;
                        font = me.normalFont;
                        break;
                    case "title":
                        size = me.titleSize;
                        color = me.titleColor;
                        font = me.titleFont;
                        break;
                    case "subtitle":
                        size = me.subtitleSize;
                        color = me.subtitleColor;
                        font = me.subtitleFont;
                        break;
                    default:
                        size = "1.75vw";
                        color = "#000";
                        font = "'Montserrat', sans-serif";
                        break;
                }

                $(element).css("font-size", size + "vw");
                var text_value = $(element).text();
                switch(mode){
                    case "em":
                        $(element).children().html("<i><font color='" + color + "'>" + text_value + "</font></i>");
                        break;
                    case "normal":
                        $(element).children().html("<font color='" + color + "'>" + text_value + "</font>");
                        break;
                    case "strong":
                        $(element).children().html("<b><font color='" + color + "'>" + text_value + "</font></b>");
                        break;
                }
                $(element).css("font-family", font);


                $(element).css("position", "absolute");
                $(element).css("left", options.left + "vw");//24.6
                $(element).css("top", options.top + "vw");//5.66
                $(element).css("line-height", "initial", "important");
                //$(element).css("color", "#000");
                $(element).css("height", "initial");
                $(element).css("width", "auto");
                $(element).css("white-space", "normal");
                var maxwidth = calculateMaxWidth(element, $(".fullslider-slide-container"));
                var maxheight = calculateMaxHeight(element, $(".fullslider-slide-container"));
                $(element).css("max-width", maxwidth + "vw");
                $(element).css("max-height", maxheight + "vw");
                $(element).css("overflow", "hidden");
                $(element).css("word-break", "break-word", "important");
            },
            addFullsliderCode: function() {
                var element = me.addFullsliderSlideItem(code_snippet);
                me.addCodeStyle(element);
                hljs.highlightBlock($(element).find("code")[0]);
                me.finishAddFile($(element));
                addCodeList(element.id);
            },
            addCodeStyle: function(element) {
                var options = getOptions('code');
                $(element).css("font-size", "1.3vw");
                $(element).css("position", "absolute");
//                $(element).css("left", "24.6vw");
//                $(element).css("top", "5.66vw");
                $(element).css("left", options.left + "vw");
                $(element).css("top", options.top + "vw");
                $(element).css("line-height", "initial", "important");
                //$(element).css("color", "#000");
                $(element).css("height", "initial");
                $(element).css("width", "auto");
                $(element).css("white-space", "normal");
                var maxwidth = calculateMaxWidth(element, $(".fullslider-slide-container"));
                var maxheight = calculateMaxHeight(element, $(".fullslider-slide-container"));
                $(element).css("max-width", maxwidth + "vw");
                $(element).css("max-height", maxheight + "vw");
                $(element).css("overflow", "hidden");
                $(element).css("word-break", "break-word", "important");
            },
            prettifyCode: function() {
                $($(me.selectedforedit).find("code")[0]).removeClass();
                var line_list = $(me.selectedforedit).find("li");
                for (var i = 0; i < line_list.length; i++) {
                    $(line_list[i]).html($(line_list[i]).text());
                }
                hljs.highlightBlock($(me.selectedforedit).find("code")[0]);
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
                for (var i = 0; i < children.length; i++)
                {
                    child = children[i];
                    childid = "#" + child.id;
                    if (childid == id)
                    {
                        $(childid).css("z-index", 1);
                        me.selectedSlide = $(childid);
                    }
                    else
                    {
                        $(childid).css("z-index", -200 + (-(Math.round(Math.random() * 1000))));
                    }
                }
            },
            selectThumb: function(id)
            {
                $(".slidethumb").removeClass("currentselection");
                $("#slidethumb_" + id).addClass("currentselection");
            },
            assignSlideNumbers: function(noreset)
            {
                children = $(".slidethumbholder").children();
                for (var i = 0; i < children.length; i++)
                {
                    child = $(children[i]);
                    count = i;
                    $("#" + child[0].id).attr("data-slidenumber", ++count);
                    if (!noreset) {
                        me.resetSlideNumber(child[0].id);
                    }
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
            attachListeners: function() //On add event, add the same with off in removeListeners
            {
                $("html").on("click", me.manageGlobalClick);
                $(".settingsCancelBtn").on("click", me.onSettingsCancelClicked);
                $(".menuItemBtn").on("click", me.onMenuItemClicked);
                $(".slidelement").on("click", me.triggetElementEdit);
//                $(".slidelement").on("mouseup", me.createEditor);
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
                    me.fetchAndPreview($(this).attr("data-id"));
                });
                $("#saveconfiguration").on("click", function(e)
                {
                    me.updateConfig();
                    $(".modal").modal("hide");
                });
                $("#closeconfiguration").on("click", function(e) {
                    me.loadConfig();
                });
                $(".fontconfig li a").on("click", function(e) {
                    var value = extractValue(e);

                    var selected_font_link = $(e.target).closest("div").children("a");
                    selected_font_link.attr("data-font", value);

                    var value_name = get_font_name(value);

                    //update value on editor button
                    selected_font_link.find(".fontFamilySelected").html(value_name);
                });
                $(".createpresentation").on("click", function(e)
                {

                    if (me.mode == "create")
                    {
                        me.createNewPresentation();
                    }
                    else
                    {
                        $("#presentationmetatitle").html($("#titleinput").val());
                        me.currentPresentation.title = $("#titleinput").val();
                        me.savePresentation();
                    }
                    $(".modal").modal("hide");
                });
                $("#savepresentationbtn").on("click", function(e)
                {
                    me.savePresentationOnSession();
                });

                //Add Text buttons on click. 

                $("#addtextbtn,#normalTextBtn").on("click", function(e)
                {
                    e.stopPropagation();
                    me.addFullsliderText("normal");
                    changeContent();//Event for undo redo
                });
                $("#titleTextBtn").on("click", function(e)
                {
                    e.stopPropagation();
                    me.addFullsliderText("title");
                    changeContent();//Event for undo redo
                });
                $("#subtTextBtn").on("click", function(e)
                {
                    e.stopPropagation();
                    me.addFullsliderText("subtitle");
                    changeContent();//Event for undo redo
                });
                //End add text buttons on click

                $("#addcodebtn").on("click", function(e)
                {
                    e.stopPropagation();
                    me.addFullsliderCode();
                    changeContent();//Event for undo redo
                });

                $("#addimagebtn").on("click", function(e)
                {
                    $("#imagemodal").removeClass("hide");
                    $("#imagemodal").modal("show");
                    $("#urlimageinput").focus();
                });
                $("#graphicseditorbtn").on("click", function(e)
                {
                    $("#graphicsmodal").removeClass("hide");
                    $("#graphicsmodal").modal("show");
                });
                $(".newpresopanel").on("click", function(e)
                {
                    $(".modal").modal("hide");
                    $("#newpresentationmodal").removeClass("hide");
                    $("#newpresentationmodal").modal("show");
                    $("#titleinput").val("New Presentation");
                    $("#newpresoheader").html("Create New Presentation");
                    me.mode = "create";
                });
                $("#urlimageinput").on("blur keyup", function(e)
                {
                    var image = $(this).val();
                    $("#previewimg").attr("src", image);
                });
                $("#addslidebtn").on("click", function(e)
                {
                    me.addSlide();
                });
                $("#openpresentationsbtn").on("click", function(e)
                {
                    $(".previewpresobtn").on("click", function(e)
                    {
                        me.fetchAndPreview($(this).attr("data-id"));
                    });
                    $(".openpresobtn").on("click", function(e)
                    {
                        me.mode = "save";
                        me.openPresentationForEdit($(this).attr("data-id"));
                    });
                    $("#savedpresentationsmodal").removeClass("hide");
                    $("#savedpresentationsmodal").modal("show");
                });
                $("#openconfiguration").on("click", function(e)
                {
                    $("#configmodal").removeClass("hide");
                    $("#configmodal").modal("show");
                });
                $("#pdfbtn").on("click", function(e) {
                    if (!me.wait_s) { //Only one click
                        me.wait_s = true;
                        var slides = me.generateExportMarkup();
                        slides = me.correctListWidth(slides);
//                        slides = me.correctUserAgentTag(slides);

                        var title = me.getTitle();

                        $("body").css("cursor", "progress");
                        $("#pdfbtn").button('loading');
                        $("#pdfbtn").html('Generating PDF...');
                        var msg = "Generating pdf. Wait please...";
                        openAlert("info", msg);

                        $.post("/toPDF", {
                            'slides': btoa(encodeURIComponent(slides)),
                            'title': title
                        }, function(json) {
                            if (json.end_code == 0) { //If no error
                                // Opens the pdf download prompt
                                window.open("tmp_files/" + title + ".pdf");
                                $("#infoalert").fadeOut(0);
                            }
                            else {
                                $("#infoalert").fadeOut(0);
                                msg = "";
                                openAlert("danger", msg);
                            }
                            $("#pdfbtn").button('reset');
                            $("body").css("cursor", "default");
                            me.wait_s = false;
                        }, 'json');
                    }
                });

                $("#viewbtn").on("click", function(e)
                {
                    if (!me.wait_s) { //Only one click
                        me.wait_s = true;
                        $("body").css("cursor", "progress");
                        $("#viewbtntext").button('loading');
                        $("#viewbtntext").html('Wait...');
                        var slides = me.generateExportMarkup();
                        slides = me.correctListWidth(slides);
                        slides = me.correctUserAgentTag(slides);
                        me.generateView(slides);
                    }
                });
                $("#downloadpresbtn").on("click", function(e)
                {
                    if (!me.wait_s) { //Only one click
                        me.wait_s = true;
                        $("body").css("cursor", "progress");
                        $("#downloadbtntext").button('loading');
                        $("#downloadbtntext").html('Downloading...');
                        me.downloadFile(me.generateJsonFile(), me.getFileName());
                    }
                });
                $(".loadpresbtn").on("click", function(e)
                {
                    $("#inputFile").click();
                });
                $('#inputFile').change(function(e) {
                    $(".loadpresbtn").button('loading');
                    $(".loadpresbtn").html('Opening...');
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
                                    initializeUndoRedo();
                                    $("#welcomemodal").modal("hide");
                                }
                                $('input[name=openFile]').removeAttr('value');
                                $(".loadpresbtn").button('reset');
                            }
                            catch (e) {
                                var msg = "An error occurred while trying to open the file.";
                                openAlert("danger", msg);
                                me.resetSaveButtonText();
                            }
                        });
                        reader.readAsText(files[0]);
                        if (reader.readyState == 1) {
                            $(".loadpresbtn").button('reset');
                        }
                    }

                });

                $(".cancelimgedit").on("click", function(e) {
                    var element = me.imageOnEdit;
                    me.clearElementSelections();
                    me.selectElement(element);
                });
                //Upload image from url
                $("#addurlimgbtn").on("click", function(e)
                {
                    $("#urlimgform").submit();
                });

                $('#urlimgform').submit(function() {
                    $.post($(this).attr('action'), $(this).serialize(), function(json) {
//                        console.log(json);
//                       me.addImageToSlide(json);
                        //Clear input and preview image
                        $("#urlimageinput").val("");
                        $("#previewimg").removeAttr("src");

                        //Create image from returned json object of loadimage module
                        createImageFromJSONFile(json);
                        $("#imagemodal").modal("hide");
                    }, 'json');
                    return false;
                });

                //Add/cancel graphics
                $('#editEnd').on("click", function(e) {
                    e.stopPropagation();
                    editor.unselect();
                    me.addGraphics();
                    onEditEnd();
                    changeContent();
                });

                $('#cancelEdit').on("click", onEditEnd);

                $('#menu a').on('click', function() {
                    $('#menu').removeClass('open');
                });

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
            },
            removelisteners: function()
            {
                $(".settingsCancelBtn").off();
                $(".viewtogglebtn").off();


                $("html").off();
                $(".settingsCancelBtn").off();
                $(".menuItemBtn").off();
                $(".slidelement").off();
                $(".slidelement").off();
                $("#newstylepanel").off();
                $("#exportpresopanel").off();
                $("#editpresonamebtn").off();
                $(".previewpresobtn").off();
                $("#saveconfiguration").off();
                $("#closeconfiguration").off();
                $(".fontconfig li a").off();
                $(".createpresentation").off();
                $("#savepresentationbtn").off();

                //Add Text buttons on click. 
                $("#addtextbtn,#normalTextBtn").off();
                $("#titleTextBtn").off();
                $("#subtTextBtn").off();
                //End add text buttons on click

                $("#addimagebtn").off();
                $(".newpresopanel").off();
                $("#urlimageinput").off();
                $("#addslidebtn").off();
                $("#addurlimgbtn").off();
                $("#openpresentationsbtn").off();
                $("#openconfiguration").off();
                $("#viewbtn").off();
                $("#downloadpresbtn").off();
                $(".loadpresbtn").off();
                $('#inputFile').off();

                //Add/cancel graphics
                $('#editEnd').off();
                $('#cancelEdit').off();

                //Add code
                $("#addcodebtn").off();
                $("#pdfbtn").off();

                $('#menu a').off();
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
                me.saveItem(me.saveKey, JSON.stringify(presentations));
                var lastsaved = JSON.parse(me.getItem(me.lastSaved));
                if ((lastsaved !== null) && lastsaved.id == id)
                {
                    localStorage.removeItem(me.lastSaved);
                }
                presentations = me.getSavedPresentations();
                me.renderPresentations(presentations);
            },
            generateExportMarkup: function()
            {
                var children = $(".slidethumbholder").children();
                var outputcontainer = $(".fullslider-slide-container").clone();
                return (outputcontainer.html().toString());
            },
            correctListWidth: function(elements) {
                var tempelement = '<div id="tempslides" style="z-index: -50000000;" class="fullslider-slide-container"></div>';
                $(document.body).append(tempelement);
                $("#tempslides").html(elements);
                var ul_list = $("#tempslides").find(".slidelement > div > ul");
                var hasul;
                var value;
                for (var i = 0; i < ul_list.length; i++) {
                    hasul = $($(ul_list[i]).parent()).parent();
                    if ($(hasul).hasClass("slidelement")) {
                        value = hasul[0].getBoundingClientRect().width;
                        value = pxToVw(value) + 0.2;
                        $(hasul).css("width", value + "vw");
                    }
                }
                var slides = $("#tempslides").html();
                $("#tempslides").remove();
                return slides;
            },
            correctUserAgentTag: function(elements) {
                elements = elements.replace(/transform:/g, me.useragent_tag + "transform:");
                elements = elements.replace(/transform-origin/g, me.useragent_tag + "transform-origin");
                return elements;
            },
            cleanFullslider: function() {
                $(".slidethumbholder").html("");
                $(".fullslider-slide-container").html("");
            },
            createNewPresentation: function()
            {
                //Delete slides and slidethumbs
                me.cleanFullslider();
                //Clean all patterns
                me.patterns = {};
                //Load default config on Fullslider attributes
                me.loadDefaultConfig();
                //Load default configuration on Config panel
                me.loadConfig();

                var config = me.getConfigVariable();

                //add new slide
                me.addSlide();
                var presentation = {
                    id: Math.round(Math.random() * 201020),
                    title: $("#presentationmetatitle").text(),
                    contents: $(".fullslider-slide-container").html().toString(),
                    config: config

                };
                me.currentPresentation = presentation;
                initializeUndoRedo();
            },
            openPresentationForEdit: function(id)
            {
                for (var i = 0; i < me.mypresentations.length; i++)
                {
                    var presentation = me.mypresentations[i];
                    if (id == presentation.id)
                    {
                        me.loadPresentation(presentation);
                        initializeUndoRedo();
                        break;
                    }
                }
                $("#savedpresentationsmodal").modal("hide");
            },
            isFileCorrupted: function(presentation) {
                var id = (presentation.id === undefined || presentation.id === null);
                var title = (presentation.title === undefined || presentation.title === null);
                var contents = (presentation.contents === undefined || presentation.contents === null);
                var config = (presentation.config === undefined || presentation.config === null);
                var patterns = (presentation.patterns === undefined || presentation.patterns === null);

                var normalText = (presentation.config.normalText === undefined || presentation.config.normalText === null);
                var normalTextSize = (presentation.config.normalText.size === undefined || presentation.config.normalText.size === null);
                var normalTextFont = (presentation.config.normalText.font === undefined || presentation.config.normalText.font === null);
                var normalTextColor = (presentation.config.normalText.color === undefined || presentation.config.normalText.color === null);

                var titleText = (presentation.config.titleText === undefined || presentation.config.titleText === null);
                var titleTextSize = (presentation.config.titleText.size === undefined || presentation.config.titleText.size === null);
                var titleTextFont = (presentation.config.titleText.font === undefined || presentation.config.titleText.font === null);
                var titleTextColor = (presentation.config.titleText.color === undefined || presentation.config.titleText.color === null);

                var subtText = (presentation.config.subtText === undefined || presentation.config.subtText === null);
                var subtTextSize = (presentation.config.subtText.size === undefined || presentation.config.subtText.size === null);
                var subtTextFont = (presentation.config.subtText.font === undefined || presentation.config.subtText.font === null);
                var subtTextColor = (presentation.config.subtText.color === undefined || presentation.config.subtText.color === null);

                var boundTextOption = (presentation.config.boundTextOption === undefined || presentation.config.boundTextOption === null);
                var showSlideNumbers = (presentation.config.showSlideNumbers === undefined || presentation.config.showSlideNumbers === null);

                var error = (id || title || contents || config || patterns || normalText || normalTextSize || normalTextFont || normalTextColor || titleText ||
                        titleTextSize || titleTextFont || titleTextColor || subtText || subtTextSize || subtTextFont || subtTextColor || boundTextOption || showSlideNumbers);
                return error;
            },
            fetchAndPreview: function(id)
            {
                for (var i = 0; i < me.mypresentations.length; i++)
                {
                    presentation = me.mypresentations[i];
                    if (id == presentation.id)
                    {
                        $(".placeholder").html(presentation.contents);
                        $(".placeholder").find(".fullslider-slide").each(function(i, object)
                        {
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
                me.changesCounter = 0;
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

                var config = me.getConfigVariable();
                var o = {
                    id: tempid,
                    title: $("#presentationmetatitle").text(),
                    contents: $(".fullslider-slide-container").html().toString(),
                    config: config,
                    patterns: me.patterns
                };
                me.currentPresentation = o;
                $("#presentationmetatitle").html(me.currentPresentation.title);
                arr.push(o);
                me.saveItem(me.saveKey, JSON.stringify(arr));
//                    me.saveItem(me.lastSaved, JSON.stringify(o));
                presentations = me.getSavedPresentations();
                presentations.reverse();
                me.renderPresentations(presentations);
                $(".previewpresobtn").on("click", function(e)
                {
                    me.fetchAndPreview($(this).attr("data-id"));
                });
                $(".modal").modal("hide");

                setTimeout(me.resetSaveButtonText, 1000);
            },
            savePresentationOnSession: function() {
                if (me.currentPresentation)
                {
                    me.clearElementSelections();
                    $("#titleinput").val(me.currentPresentation.title);
                }
//                    $("#newpresentationmodal").removeClass("hide");
//                    $("#newpresentationmodal").modal("show");
                me.mode = "save";
                me.savePresentation();
            },
            resetSaveButtonText: function()
            {
                $("#savepresentationbtn").html('<i class="glyphicon glyphicon-ok-sign"></i>&nbsp;Save');
            },
            generateJsonFile: function() {
                var title = me.getTitle();
                var contents = me.generateExportMarkup();
                var id = me.currentPresentation.id;
                var config = me.getConfigVariable();

                var file = {
                    'id': id,
                    'title': title,
                    'contents': contents,
                    'config': config,
                    'patterns': me.patterns
                };
                return JSON.stringify(file);
            },
            generateFile: function() {
                var text = me.generateJsonFile();
                var blob = new Blob([text], {type: "application/json"});
                return blob;
            },
            setDownloadHref: function(content, filename) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    var save = document.getElementById("downloadpresbtn");
                    save.setAttribute("href", event.target.result);
                    save.setAttribute("target", '_blank');
                    save.setAttribute("download", (filename + ".fspf") || (me.generateUID() + '.fspf'));
                    (window.URL || window.webkitURL).revokeObjectURL(save.href);
                    window.open(event.target.result);
                };
                reader.readAsDataURL(content);
            },
            downloadFile: function(content, filename) {
                $.post("/downloadPres", {'file': content, 'name': filename + ".fspf"}, function(json) {
                    if (json.end_code == 0) { //If no error
                        window.open(json.file_url);
                    }
                    else {
                        msg = "";
                        openAlert("danger", msg);
                    }
                    $("#downloadbtntext").button('reset');
                    $("body").css("cursor", "default");
                    me.wait_s = false;
                }, 'json');
            },
            generateAllThumbs: function() {
                $(".slidethumbholder").html("");
                var thumb;
                var uid;
                $(".fullslider-slide").each(function(i, object)
                {
                    thumb = slidethumb;
                    uid = $(this).attr("id").replace("fullslider_slide_", "");
                    thumb = thumb.split("slidethumb_^UID^").join("slidethumb_" + uid);
                    $(".slidethumbholder").append(thumb);
                    $("#slidethumb_" + uid).animate({opacity: 1}, 200);
                    me.addSlideEvents();
                    me.lastslideleftpos += 200;
                    me.assignSlideNumbers();
                    me.selectSlide("#fullslider_slide_" + uid);
                    me.generateScaledSlide(me.selectedSlide);
                });

            },
            loadPresentation: function(presentation) {
                me.cleanFullslider();
                //Clean all patterns
                me.patterns = presentation.patterns;

                $(".fullslider-slide-container").html(presentation.contents);
                me.generateAllThumbs();

                var first_slide_id = $(".fullslider-slide-container").find(".fullslider-slide-element").attr("id");
                first_slide_id = first_slide_id.replace(/[^-\d\.]/g, '');
                me.selectSlide("#fullslider_slide_" + first_slide_id);
                me.selectThumb(first_slide_id);
                me.currentPresentation = presentation;
                $("#presentationmetatitle").html(me.currentPresentation.title);
                $("#savedpresentationsmodal").modal("hide");
                me.enableDrag();
                me.mode = "save";

                //Load design configuration
                me.updateConfigFromSaved(presentation.config);
                me.loadConfig();

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
            generatePreview: function(str) {
                sessionStorage.setItem('preview', str);
                sessionStorage.setItem('title', me.getTitle());
                window.open("app/components/reveal.js/index.html");
            },
            generateView: function(str)
            {
                sessionStorage.setItem('preview', true);
                sessionStorage.setItem('title', me.getTitle());
                $.post("/exportPres", {'slides': btoa(encodeURIComponent(str))}, function(json) {
                    if (json.end_code == 0) { //If no error
                        window.open("app/components/reveal.js/index.html");
                    }
                    else {
                        msg = "";
                        openAlert("danger", msg);
                    }
                    $("#viewbtntext").button('reset');
                    $("body").css("cursor", "default");
                    me.wait_s = false;
                }, 'json');

            },
            addImageToSlide: function(data)
            {
                var element = me.addFullsliderSlideItem(image_snippet);
                var id = $(element).attr("id");

                data.element = $("#" + id);
                me.addImageStyle(data);

                me.finishAddFile($("#" + id));
            },
            addImageStyle: function(data) {
                var element = data.element;

                var src = data.src;
                var im_width = data.width;
                var im_height = data.height;
                $(element).find("img").attr("src", src);
                element.css("position", "absolute");
                element.css("left", "15vw");
                element.css("top", "15vw");
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

                element.css("height", im_height + "vw");
                element.css("width", im_width + "vw");
            },
            addGraphics: function() {
                var graphic_list = $("#canvas").find("svg").children();
                var defs = $("#canvas").find("defs");
                var svgtype = "";
                
                for (var i = 0; i < graphic_list.length; i++) {
                    var graphic = graphic_list[i];
                    if (!$(graphic).is("defs")) {
                        var element = me.addFullsliderSlideItem(graphic_snippet);
                        svgtype = $(graphic).attr("data-svgtype");

                        //On resize svg, transform is defined an set to " " -> remove transform attr.
                        $(graphic).removeAttr('transform');
                        
                        $(element).find("svg").append($(graphic).clone());

                        switch (svgtype) {
                            case "arrow":
                                $(element).find("svg").prepend($(defs).clone()); //Prepend: Append in first position
                                break;
                            default:
                                break;
                        }

//                        me.addGraphicStyle(element, graphic);
                        if (manualFigure) {
                            me.addGraphicStyle(element, graphic);
                        }
                        else{
                            me.addGraphicStyleMD(element, graphic);
                        }

                        me.finishAddFile($(element));
                        
                        addFigureList(element.id, svgtype);
                        takeIdFigure(element.id);
                    }
                }
            },
            addGraphicStyle: function(element, graphic) {
                var svg_element = $(element).find("svg");
                var added_graphic = $(svg_element).children()[0];

//                var stroke_width = pxToVw(parseFloat(getNumericValue($("#strokewidth").val())));
                var stroke_width = pxToVw(parseFloat($(graphic).attr("stroke-width")));
                var is_arrow = false;

                if ($(added_graphic).is("defs")) { //If is arrow
                    is_arrow = true;
                    var last = $($(svg_element).children()).size() - 1;
                    var added_graphic = $(svg_element).children()[last];
                    stroke_width *= 3;
                }

                //After append, because before has relative modal values
                var width = parseFloat(pxToVw(graphic.getBBox().width));
                var height = parseFloat(pxToVw(graphic.getBBox().height));

                var left = graphic.getBBox().x;
                var top = graphic.getBBox().y;

                var left_translate = (left * -1);
                var top_translate = (top * -1);

                switch (true) {
                    case (height != 0 && width != 0):
                        if (width > height) {
                            var w_rel = (stroke_width + 0 * height / width);
                        }
                        else {
                            var w_rel = (stroke_width + 0 * width / height);
                        }
                        width += w_rel;
                        left_translate += vwToPx(w_rel / 2);
                        height += w_rel;
                        top_translate += vwToPx(w_rel / 2);
                        break;
                    case(height != 0 && width == 0):
                        width += stroke_width + 1;
                        left_translate += vwToPx((stroke_width + 1) / 2);
                        if (is_arrow) {
                            height += stroke_width + 1;
                            top_translate += vwToPx(stroke_width / 1.75);
                        }
                        break
                    case(height == 0 && width != 0):
                        height += stroke_width + 1;
                        top_translate += vwToPx((stroke_width + 1) / 2);
                        if (is_arrow) {
                            width += stroke_width + 1;
                            left_translate += vwToPx(stroke_width / 1.75);
                        }
                        break
                }

                $(added_graphic).attr("transform", "translate(" + left_translate + ", " + top_translate + ")");

                $(svg_element).css("width", width + "vw");
                $(svg_element).css("height", height + "vw");
                $(svg_element).css("position", "absolute");
                $(element).css("width", width + "vw");
                $(element).css("height", height + "vw");
                $(element).css("position", "absolute");
                $(element).css("left", pxToVw(left) + "vw");
                $(element).css("top", pxToVw(top) + "vw");


                //Javascript insteadof Jquery because attr("viewBox") set attribute "viewbox". Case Sensitive
                $(svg_element)[0].setAttribute('preserveAspectRatio', "xMinYMin meet");
                $(svg_element)[0].setAttribute('viewBox', "0 0 " + vwToPx(width) + " " + vwToPx(height));
                var maxwidth = calculateMaxWidth(element, $(".fullslider-slide-container"));
                var maxheight = calculateMaxHeight(element, $(".fullslider-slide-container"));
                $(element).css("max-width", maxwidth + "vw");
                $(element).css("max-height", maxheight + "vw");
            },
            removeSlide: function(el)
            {
                el.remove();
                clearInterval(me.deleteslideinterval);
            },
//            createEditor: function(e)
//            {
//                editor = $(e.target).clone();
//                //editor.attr("contentEditable", "true");
//            },
            triggetElementEdit: function(e)
            {
                //$(e.target).attr("contentEditable", true);
            },
            onSettingsCancelClicked: function(e)
            {
                me.animateSettingsPanel("left");
            },
            onMenuItemClicked: function(e)
            {
                $("#newpresentationmodal").removeClass("hide");
                $("#newpresentationmodal").modal("show");
                $("#newpresoheader").html("Create New Presentation");
                me.mode = "create";
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
            slideIdFromThumb: function(thumb)
            {
                var uid = thumb.attr("id").replace("slidethumb_", "");
                return "fullslider_slide_" + uid;
            },
            thumbIdFromSlide: function(slide)
            {
                var uid = slide.attr("id").replace("fullslider_slide_", "");
                return "slidethumb_" + uid;
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
            getSelectedSlide: function() {
	           return me.selectedSlide;
            },
            getSelectedForEdit: function() {
                return me.selectedforedit;
            },
            getClonedElement: function() {
                return me.clonedElement;
            },
            loadDefaultText: function() {
                me.normalSize = 1.75;
                me.titleSize = 3.5;
                me.subtitleSize = 2.75;

                me.normalFont = "'Montserrat', sans serif";
                me.titleFont = "'Montserrat', sans serif";
                me.subtitleFont = "'Montserrat', sans serif";

                me.normalColor = "#000";
                me.titleColor = "#000";
                me.subtitleColor = "#000";
            },
            loadConfig: function() {  //Load default configuration on Config panel
                $("#normal_text_size").attr("value", me.normalSize);
                $("#title_text_size").attr("value", me.titleSize);
                $("#subt_text_size").attr("value", me.subtitleSize);

                me.loadFont("normal");
                me.loadFont("title");
                me.loadFont("subtitle");

                me.loadColor("normal");
                me.loadColor("title");
                me.loadColor("subtitle");
                $("#" + me.boundTextOption).prop("checked", true);
                $("#" + me.showSlideNumbers).prop("checked", true);
            },
            loadFont: function(type) {
                var value = "";
                var element_id = "";

                switch (type) {
                    case "normal":
                        value = me.normalFont;
                        element_id = "#normal_text_font";
                        break;
                    case "title":
                        value = me.titleFont;
                        element_id = "#title_text_font";
                        break;
                    case "subtitle":
                        value = me.subtitleFont;
                        element_id = "#subt_text_font";
                        break;
                }

                $(element_id).children("a").attr("data-font", value);

                var value_name = get_font_name(value);

                //update value on button with selected font name
                var fontFamilySelected = $(element_id).find('.fontFamilySelected');
                fontFamilySelected.html(value_name);
            },
            loadColor: function(type) {
                var value = "";
                var element_id = "";

                switch (type) {
                    case "normal":
                        value = me.normalColor;
                        element_id = "#normal_text_color";
                        break;
                    case "title":
                        value = me.titleColor;
                        element_id = "#title_text_color";
                        break;
                    case "subtitle":
                        value = me.subtitleColor;
                        element_id = "#subt_text_color";
                        break;
                }

                $(element_id).find(".sp-preview-inner").css("background-color", value);
            },
            setSlideNumber: function() {
                var slidenum = $(me.selectedSlide).find(".slidenum")[0];
                var slide_id = $(me.selectedSlide).attr("id").split("_");
                slide_id = "#slidethumb_" + slide_id[2];
                $($(slidenum).find("font")[0]).html($(slide_id).attr("data-slidenumber"));
            },
            resetSlideNumber: function(thumb_id) {
                var slide_id = thumb_id.split("_");
                slide_id = "#fullslider_slide_" + slide_id[1];
                var slidenum = $(slide_id).find(".slidenum")[0];
                $($(slidenum).find("font")[0]).html($("#" + thumb_id).attr("data-slidenumber"));
            },
            setSlideNumbersDisplay: function() {
                var displaynum;
                if (me.showSlideNumbers == "showslidenumbersradio") {
                    displaynum = "block";
                }
                else {
                    displaynum = "none";
                }
                var slidenums = $(".fullslider-slide-container").children();
                for (var i = 0; i < slidenums.length; i++) {
                    var slidenum = $(slidenums[i]).find(".slidenum")[0];
                    $(slidenum).css("display", displaynum);
                }
            },
            updateConfig: function() {
                me.normalSize = parseFloat($("#normal_text_size").attr("value"));
                me.titleSize = parseFloat($("#title_text_size").attr("value"));
                me.subtitleSize = parseFloat($("#subt_text_size").attr("value"));

                me.normalFont = $("#normal_text_font").children("a").attr("data-font");
                me.titleFont = $("#title_text_font").children("a").attr("data-font");
                me.subtitleFont = $("#subt_text_font").children("a").attr("data-font");

                me.normalColor = rgbToHex($("#normal_text_color").find(".sp-preview-inner").css("background-color"));
                me.titleColor = rgbToHex($("#title_text_color").find(".sp-preview-inner").css("background-color"));
                me.subtitleColor = rgbToHex($("#subt_text_color").find(".sp-preview-inner").css("background-color"));

                me.boundTextOption = $("input[name='boundOption']:checked").attr("id");

                me.showSlideNumbers = $("input[name='showslidenumbers']:checked").attr("id");
                me.setSlideNumbersDisplay();
            },
            updateConfigFromSaved: function(config) {
                me.normalSize = parseFloat(config.normalText.size);
                me.titleSize = parseFloat(config.titleText.size);
                me.subtitleSize = parseFloat(config.subtText.size);

                me.normalFont = config.normalText.font;
                me.titleFont = config.titleText.font;
                me.subtitleFont = config.subtText.font;

                me.normalColor = config.normalText.color;
                me.titleColor = config.titleText.color;
                me.subtitleColor = config.subtText.color;

                me.boundTextOption = config.boundTextOption;
                me.showSlideNumbers = config.showSlideNumbers;
                me.setSlideNumbersDisplay();
            },
            getConfigVariable: function() {
                var normalText = {
                    'size': me.normalSize,
                    'font': me.normalFont,
                    'color': me.normalColor
                };
                var titleText = {
                    'size': me.titleSize,
                    'font': me.titleFont,
                    'color': me.titleColor
                };
                var subtitleText = {
                    'size': me.subtitleSize,
                    'font': me.subtitleFont,
                    'color': me.subtitleColor
                };

                var config = {
                    'normalText': normalText,
                    'titleText': titleText,
                    'subtText': subtitleText,
                    'boundTextOption': me.boundTextOption,
                    'showSlideNumbers': me.showSlideNumbers
                };
                return config;
            },
            addPattern: function(key, value) {
                me.patterns[key] = $(value)[0].outerHTML;
            },
            updatePattern: function(element_pattern) {
                var data_pattern = $(element_pattern).attr("data-pattern");
                var zindex = $(element_pattern).css("z-index");
                var pattern = $.parseHTML(me.patterns[data_pattern]);
                $(pattern).css("z-index", zindex);
                me.patterns[data_pattern] = $(pattern)[0].outerHTML;
            },
            removePattern: function(key) {
                delete me.patterns[key];
            },
            removeAllPatterns: function() {
                me.patterns = {};
            },
            copyTextToClipboard: function(element) {
                var value = element.selectionText; // <-- Selected text
                element.select();
                document.execCommand('copy', false, null);
            },
            cutTextToClipboard: function(element) {
                var value = element.selectionText; // <-- Selected text
                element.select();
                document.execCommand('cut', false, null);
            },
            pasteTextFromClipboard: function(element) {
                document.execCommand('paste', false, "asd");
            },
    
            //--------------------------- Markdown ---------------------------------------
    
            addSlideMD: function(){
                uid = me.generateUID();
                me.addSlideThumb(uid);
                //$("#slidethumb_" + uid).attr("data-left", me.lastslideleftpos + "px");
                //$("#slidethumb_" + uid).attr("data-top", "0px");
                me.addSlideEvents();
                me.lastslideleftpos += 200;
                me.assignSlideNumbers(true);
                me.addFullsliderSlideMD(uid);
                $("#presentationmetatitle").html($("#titleinput").val());
                changeContent();//Event for undo redo
                return uid;
            },
            addFullsliderSlideMD: function(id){
                islide = fullslider_slide;
                islide = islide.split("__slidenumber__").join("_" + id);
                $(".fullslider-slide-container").append(islide);
                $("#fullslider_slide_" + id).addClass("fullslider-slide-element");
                //$("#fullslider_slide_"+id).addClass(me.theme);
                me.selectSlide("#fullslider_slide_" + id);
                me.selectThumb(id);

                //Slidenumbers
                $(me.selectedSlide).append(slidenumbers_snippet);
                me.setSlideNumbersDisplay();
                me.setSlideNumber();

                for (var i in me.patterns) {
                    $(me.selectedSlide).append(me.clonePatternElement(me.patterns[i]));
                }
                me.generateScaledSlide(me.selectedSlide);
            },
            addFullsliderTextMD: function(type, text, mode) {
                text = text.split('\n');
                var futureText = '';
                for(p = 0; p < text.length; p++){
                    futureText += '<div> ' + text[p] + ' </div>' + '\n';
                }
                var mText = text_snippet.replace("Sample Text", futureText);
                var element = me.addFullsliderSlideItem(mText);
                me.addTextStyleMD(element, type, mode);
                me.finishAddFile($(element));
                return element.id;
            },
            addFullsliderListMD: function(text) {
                var mText = text_snippet.replace("Sample Text", text);
                var element = me.addFullsliderSlideItem(mText);
                me.addTextStyleMD(element, 'normal', 'normal', true);
                me.finishAddFile($(element));
                return element.id;
            },
            addFullsliderCodeMD: function(text) {
                var cText = code_snippet.replace("<li>function example(){</li><li>alert();</li><li>}</li>", text);
                var element = me.addFullsliderSlideItem(cText);
                me.addCodeStyle(element);
                hljs.highlightBlock($(element).find("code")[0]);
                me.finishAddFile($(element));
                return element.id;
            },
            addFullsliderTextIndexMD: function(text, position, range, current, long) {
                var mText = text_snippet.replace("Sample Text", '<div> ' + text + ' </div>');
                var element = me.addFullsliderSlideItem(mText);
                me.addIndexTextStyleMD(element, position, range, current, long);
                me.finishAddFile($(element));
                return element.id;
            },
            addIndexTextStyleMD: function(element, position, range, current, long) {
                var size = ""
                if(long >= 0 && long <= 10){
                    size = 2.5;
                }else if(long >= 11 && long <= 15){
                    size = 2;
                }
                var font = me.normalFont;
                var color = me.normalColor

                $(element).css("font-size", size + "vw");
                var text_value = $(element).text();
                if(current){
                    color = "#EC312E";
                    $(element).children().html("<b><font color='" + color + "'>" + text_value + "</font></b>");
                }
                else{
                    $(element).children().html("<font color='" + color + "'>" + text_value + "</font>");
                }
                $(element).css("font-family", font);

                $(element).css("position", "absolute");
                var leftSpace = 6.8 + range
                $(element).css("left", leftSpace + "vw");
                var topSpace = 4.50 + position;
                $(element).css("top", topSpace + "vw");
                $(element).css("line-height", "initial", "important");
                //$(element).css("color", "#000");
                $(element).css("height", "initial");
                $(element).css("width", "auto");
                $(element).css("white-space", "normal");
                var maxwidth = calculateMaxWidth(element, $(".fullslider-slide-container"));
                var maxheight = calculateMaxHeight(element, $(".fullslider-slide-container"));
                $(element).css("max-width", maxwidth + "vw");
                $(element).css("max-height", maxheight + "vw");
                $(element).css("overflow", "hidden");
                $(element).css("word-break", "break-word", "important");
            },
            addTextStyleMD: function(element, type, mode, list=false) {
                if(type == 'normal'){
                    var options = getOptions('text');
                }
                else{
                    var options = getOptions(type);
                }
                var size = "";
                var font = "";
                var color = "";
                switch (type) {
                    case "normal":
                        size = me.normalSize;
                        color = me.normalColor;
                        font = me.normalFont;
                        break;
                    case "title":
                        size = me.titleSize;
                        color = me.titleColor;
                        font = me.titleFont;
                        break;
                    case "subtitle":
                        size = me.subtitleSize;
                        color = me.subtitleColor;
                        font = me.subtitleFont;
                        break;
                    default:
                        size = "1.75vw";
                        color = "#000";
                        font = "'Montserrat', sans-serif";
                        break;
                }

                $(element).css("font-size", size + "vw");
                var text_value = $(element).text().split('\n');
                var h = 0;
                if(list){
//                    console.log($(element > ol).children());
//                    $(element > ol).children().each(function(){
//                        $(this).html("<font color='" + color + "'>" + text_value[h] + "</font>")
//                        h++;
//                    });
                }
                else{
                    switch(mode){
                        case "em":
                            $(element).children().each(function(){
                                $(this).html("<i><font color='" + color + "'>" + text_value[h] + "</font></i>")
                                h++;
                            });
                            break;
                        case "normal":
                            $(element).children().each(function(){
                                $(this).html("<font color='" + color + "'>" + text_value[h] + "</font>")
                                h++;
                            });
                            break;
                        case "strong":
                            $(element).children().each(function(){
                                $(this).html("<b><font color='" + color + "'>" + text_value[h] + "</font></b>")
                                h++;
                            });
                            break;
                    }
                }
                $(element).css("font-family", font);


                $(element).css("position", "absolute");
                $(element).css("left", options.left + "vw");
                $(element).css("top", options.top + "vw");
                $(element).css("line-height", "initial", "important");
                //$(element).css("color", "#000");
                $(element).css("height", "initial");
                $(element).css("width", "auto");
                $(element).css("white-space", "normal");
                var maxwidth = calculateMaxWidth(element, $(".fullslider-slide-container"));
                var maxheight = calculateMaxHeight(element, $(".fullslider-slide-container"));
                $(element).css("max-width", maxwidth + "vw");
                $(element).css("max-height", maxheight + "vw");
                $(element).css("overflow", "hidden");
                $(element).css("word-break", "break-word", "important");
            },
            addGraphicStyleMD: function(element, graphic) {
                var svg_element = $(element).find("svg");
                var added_graphic = $(svg_element).children()[0];
                
                var options = getOptions('figure');

                var stroke_width = pxToVw(parseFloat($(graphic).attr("stroke-width")));
                var is_arrow = false;

                if ($(added_graphic).is("defs")) { //If is arrow
                    is_arrow = true;
                    var last = $($(svg_element).children()).size() - 1;
                    var added_graphic = $(svg_element).children()[last];
                    stroke_width *= 3;
                }

                //After append, because before has relative modal values
                var width = parseFloat(pxToVw(graphic.getBBox().width));
                var height = parseFloat(pxToVw(graphic.getBBox().height));

                var left = graphic.getBBox().x;
                var top = graphic.getBBox().y;

                var left_translate = (left * -1);
                var top_translate = (top * -1);

                switch (true) {
                    case (height != 0 && width != 0):
                        if (width > height) {
                            var w_rel = (stroke_width + 0 * height / width);
                        }
                        else {
                            var w_rel = (stroke_width + 0 * width / height);
                        }
                        width += w_rel;
                        left_translate += vwToPx(w_rel / 2);
                        height += w_rel;
                        top_translate += vwToPx(w_rel / 2);
                        break;
                    case(height != 0 && width == 0):
                        width += stroke_width + 1;
                        left_translate += vwToPx((stroke_width + 1) / 2);
                        if (is_arrow) {
                            height += stroke_width + 1;
                            top_translate += vwToPx(stroke_width / 1.75);
                        }
                        break
                    case(height == 0 && width != 0):
                        height += stroke_width + 1;
                        top_translate += vwToPx((stroke_width + 1) / 2);
                        if (is_arrow) {
                            width += stroke_width + 1;
                            left_translate += vwToPx(stroke_width / 1.75);
                        }
                        break
                }

                $(added_graphic).attr("transform", "translate(" + left_translate + ", " + top_translate + ")");

//                width = options.width;
//                height = options.height;
                left = options.left;
                top = options.top;
                
                $(svg_element).css("width", width + "vw");
                $(svg_element).css("height", height + "vw");
                $(svg_element).css("position", "absolute");
                $(element).css("width", width + "vw");
                $(element).css("height", height + "vw");
                $(element).css("position", "absolute");
                $(element).css("left", left + "vw");
                $(element).css("top", top + "vw");


                //Javascript insteadof Jquery because attr("viewBox") set attribute "viewbox". Case Sensitive
                $(svg_element)[0].setAttribute('preserveAspectRatio', "xMinYMin meet");
                $(svg_element)[0].setAttribute('viewBox', "0 0 " + vwToPx(width) + " " + vwToPx(height));
                var maxwidth = calculateMaxWidth(element, $(".fullslider-slide-container"));
                var maxheight = calculateMaxHeight(element, $(".fullslider-slide-container"));
                $(element).css("max-width", maxwidth + "vw");
                $(element).css("max-height", maxheight + "vw");
            },
        };
