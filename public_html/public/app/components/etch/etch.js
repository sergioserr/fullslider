function initializeTextColorChooser(color) {
    document.execCommand('foreColor', false, color.toHexString());
}

(function() {
    'use strict';

    var models = {},
            views = {},
            collections = {},
            etch = {};

    // versioning as per semver.org
    etch.VERSION = '0.6.2';

    etch.config = {
        // selector to specify editable elements   
        selector: '.editable',
        // Named sets of buttons to be specified on the editable element
        // in the markup as "data-button-class"   
        buttonClasses: {
            'default': ['save'],
            'all': ['bold', 'italic', 'underline', 'list-ul', 'list-ol', 'link', 'eraser', 'save'],
            'title': ['bold', 'italic', 'underline', 'save'],
            'text': ['bold', 'italic', 'underline', 'align-left', 'align-center', 'align-right', 'list-ul', 'list-ol', "less-spacing", "more-spacing", "less-letter-spacing", "more-letter-spacing", 'link', 'eraser', 'font-size', 'font-size-down', 'font-size-up', 'font-family', 'color', 'backgroundcolor'],
            'code': ['shownumbers', 'codestyle'],
            'graphic': ["strokewidth", 'strokecolor', 'fillcolor', 'fillopacity'],
        }
    };

    models.Editor = Backbone.Model;

    views.Editor = Backbone.View.extend({
        initialize: function() {
            this.$el = $(this.el);

            // Model attribute event listeners:
            _.bindAll(this, 'changeButtons', 'changePosition', 'changeEditable', 'insertImage');
            this.model.bind('change:buttons', this.changeButtons);
            this.model.bind('change:position', this.changePosition);
            this.model.bind('change:editable', this.changeEditable);

            // Init Routines:
            this.changeEditable();
        },
        events: {
            'click .etch-bold': 'toggleBold',
            'click .etch-italic': 'toggleItalic',
            'click .etch-underline': 'toggleUnderline',
            'click .etch-heading': 'toggleHeading',
            'click .etch-list-ul': 'toggleUnorderedList',
            'click .etch-align-left': 'justifyLeft',
            'click .etch-align-center': 'justifyCenter',
            'click .etch-align-right': 'justifyRight',
            'click .etch-list-ol': 'toggleOrderedList',
            'click .etch-link': 'toggleLink',
            'click .etch-image': 'getImage',
            'click .etch-save': 'save',
            'click .etch-eraser': 'clearFormatting',
            'click [data-option="fontSize"]': 'setFontSize',
            'click [data-option="fontFamily"]': 'setFontFamily',
            'click .etch-undo': 'toggleUndo',
            'click .etch-redo': 'toggleRedo',
            'click [data-option="codestyle"]': 'setCodeStyle',
            'click .etch-shownumbers': 'shownumbers',
            'click .etch-more-spacing': 'moreSpacing',
            'click .etch-less-spacing': 'lessSpacing',
            'click .etch-more-letter-spacing': 'moreLetterSpacing',
            'click .etch-less-letter-spacing': 'lessLetterSpacing',
            'click .etch-font-size-up': 'fontSizeUp',
            'click .etch-font-size-down': 'fontSizeDown',
        },
        changeEditable: function() {
            this.setButtonClass();
            // Im assuming that Ill add more functionality here
        },
        setButtonClass: function() {
            // check the button class of the element being edited and set the associated buttons on the model
            var editorModel = this.model;
            var buttonClass = editorModel.get('editable').attr('data-button-class') || 'default';
            editorModel.set({buttons: etch.config.buttonClasses[buttonClass]});
        },
        changeButtons: function() {
            // render the buttons into the editor-panel
            this.$el.empty();
            var view = this;
            var buttons = this.model.get('buttons');

            // hide editor panel if there are no buttons in it and exit early
            if (!buttons.length) {
                $(this.el).hide();
                return;
            }

            _.each(this.model.get('buttons'), function(button) {
                switch (button) {
                    case "font-size":
                        var buttonEl = $(font_size_selector);
                        break;
                    case "font-family":
                        var buttonEl = $(etch_font_family_selector);
                        $(buttonEl).find("ul").attr("data-option", "fontFamily");
                        break;
                    case "color":
                        var buttonEl = $(color_selector);
                        $(buttonEl).addClass("etch-color");
                        $(buttonEl).attr("id", "text-color");
                        $(buttonEl).removeClass("col-sm-2");
                        $(buttonEl).prepend('<span class="etch-label palette-bright-army">Color:</span>');
                        break;
                    case "fillcolor":
                        var buttonEl = $(color_selector);
                        $(buttonEl).addClass("etch-fill-color");
                        $(buttonEl).attr("id", "edit-fill-color");
                        $(buttonEl).removeClass("col-sm-2");
                        break;
                    case "strokecolor":
                        var buttonEl = $(color_selector);
                        $(buttonEl).addClass("etch-stroke-color");
                        $(buttonEl).attr("id", "edit-stroke-color");
                        $(buttonEl).removeClass("col-sm-2");
                        break;
                    case "strokewidth":
                        var buttonEl = $('<div class="etch-stroke-width"><input id="edit-stroke-width" type="number" min="1" max="44" value="5"><a href="#" id="edit-stroke-width-btn" class="etch-editor-button btn btn-info" title="Change stroke width"><span class="is-etch-button"><i class="glyphicon glyphicon-ok-sign"></i></span></a></div>');
                        $(buttonEl).prepend("<span class='etch-label palette-bright-army'>Stroke:</span>");
                        break;
//                    case "strokeopacity":
//                        var buttonEl = $('<div class="etch-stroke-opacity"><select id="edit-stroke-opacity">' + opacity_selector + '</select></div>');
//                        break;
                    case "fillopacity":
                        var buttonEl = $('<div class="etch-fill-opacity"><select id="edit-fill-opacity">' + opacity_selector + '</select></div>');
                        break;
                    case "codestyle":
                        var buttonEl = $(code_style_selector);
                        break;
                    case "shownumbers":
                        var buttonEl = $('<a href="#" class="etch-editor-button etch-' + button + ' btn btn-info" title="Show/hide numbers"><span class="is-etch-button"><i class="icon icon-sort-numeric-outline"></i></span></a>');
                        break;
                    case "more-spacing":
                        var buttonEl = $('<a href="#" class="etch-editor-button etch-' + button + ' btn btn-info" title="Line spacing +"><span class="is-etch-button"><i class="fa fa-plus"></i><i class="fa fa-text-height"></i></span></a>');
                        break;
                    case "less-spacing":
                        var buttonEl = $('<a href="#" class="etch-editor-button etch-' + button + ' btn btn-info" title="Line spacing -"><span class="is-etch-button"><i class="fa fa-minus"></i><i class="fa fa-text-height"></i></span></a>');
                        break;
                    case "more-letter-spacing":
                        var buttonEl = $('<a href="#" class="etch-editor-button etch-' + button + ' btn btn-info" title="Letter spacing +"><span class="is-etch-button"><i class="fa fa-plus"></i><i class="fa fa-text-width"></i></span></a>');
                        break;
                    case "less-letter-spacing":
                        var buttonEl = $('<a href="#" class="etch-editor-button etch-' + button + ' btn btn-info" title="Letter spacing -"><span class="is-etch-button"><i class="fa fa-minus"></i><i class="fa fa-text-width"></i></span></a>');
                        break;
                    case "font-size-up":
                        var buttonEl = $('<a href="#" class="etch-editor-button etch-' + button + ' btn btn-info" title="Font size +"><span class="is-etch-button"><i class="fa fa-plus"></i><i class="icon icon-text-ico"></i></span></a>');
                        break;
                    case "font-size-down":
                        var buttonEl = $('<a href="#" class="etch-editor-button etch-' + button + ' btn btn-info" title="Font size -"><span class="is-etch-button"><i class="fa fa-minus"></i><i class="icon icon-text-ico"></i></span></a>');
                        break;
                    case "borderwidth":
                        var buttonEl = $('<div class="etch-border-width"><input id="edit-border-width" type="number" min="0" max="20" value="2"><a href="#" id="edit-border-width-btn" class="etch-editor-button btn btn-info" title="Change border width"><span class="is-etch-button"><i class="glyphicon glyphicon-ok-sign"></i></span></a></div>');
                        $(buttonEl).prepend("<span class='etch-label palette-bright-army'>Border:</span>");
                        break;
                    case "bordercolor":
                        var buttonEl = $(color_selector);
                        $(buttonEl).addClass("etch-border-color");
                        $(buttonEl).attr("id", "edit-border-color");
                        $(buttonEl).removeClass("col-sm-2");
                        break;
                    case "backgroundcolor":
                        var buttonEl = $(color_selector);
                        $(buttonEl).addClass("etch-background-color");
                        $(buttonEl).attr("id", "edit-background-color");
                        $(buttonEl).removeClass("col-sm-2");
                        $(buttonEl).prepend('<span class="etch-label palette-bright-army">Backg:</span>');
                        break;
                    default:
                        var buttonEl = $('<a href="#" class="etch-editor-button etch-' + button + ' btn btn-info" title="' + button.replace('-', ' ') + '"><span class="is-etch-button"><i class="fa fa-' + button + '"></i></span></a>');
                }
                view.$el.append(buttonEl);
            });

            $(this.el).show('fast');
            var colorChooser = setupColorPicker($("#text-color"), initializeTextColorChooser);

            setupColorPicker($("#edit-stroke-color"), changeStrokeColor, getCurrentGraphicColor("stroke"));
            setupColorPicker($("#edit-fill-color"), changeFillColor, getCurrentGraphicColor("fill"));
            $("#edit-fill-color").prepend("<span class='etch-label palette-bright-army'>Fill: </span>");

            $("#edit-stroke-width-btn").on("click", function() {
                changeStrokeWidth();
            });

//            $("#edit-stroke-opacity").change(changeStrokeOpacity);
            $("#edit-fill-opacity").change(changeFillOpacity);

            $("#edit-border-width-btn").on("click", function() {
                changeBorderWidth();
            });

            setupColorPicker($("#edit-border-color"), changeBorderColor, getCurrentEtchBorderColor());
            setupColorPicker($("#edit-background-color"), changeBackgroundColor, getCurrentEtchBackgroundColor());


            var $toggle = this.$el.find('.dropdown-toggle');
            $toggle.dropdown();
            this.$fontSizeReadout = this.$el.find('.fontSizeReadout');
            this.$colorChooser = colorChooser;
            this.$fontFamilyReadout = this.$el.find('.fontFamilyBtn > .text');
        },
        changePosition: function() {
            // animate editor-panel to new position
            var pos = this.model.get('position');
            this.$el.animate({'top': pos.y, 'left': pos.x}, {queue: false});
        },
        wrapSelection: function(selectionOrRange, elString, cb) {
            // wrap current selection with elString tag
            var range = selectionOrRange === Range ? selectionOrRange : selectionOrRange.getRangeAt(0);
            var el = document.createElement(elString);
            range.surroundContents(el);
        },
        clearFormatting: function(e) {
            e.preventDefault();
            document.execCommand('removeFormat', false, null);
            changeContent();//Event for undo redo
        },
        toggleBold: function(e) {
            e.preventDefault();
            document.execCommand('bold', false, null);
            var element = me.selectedforedit;
            if(element != ''){
                var textEdit = element.getElementsByTagName('div');
                modifyTextText(textEdit, element.getAttribute('id'));
            }
            changeContent();//Event for undo redo
        },
        toggleItalic: function(e) {
            e.preventDefault();
            document.execCommand('italic', false, null);
            var element = me.selectedforedit;
            if(element != ''){
                var textEdit = element.getElementsByTagName('div');
                modifyTextText(textEdit, element.getAttribute('id'));
            }
            changeContent();//Event for undo redo
        },
        toggleUnderline: function(e) {
            e.preventDefault();
            document.execCommand('underline', false, null);
            changeContent();//Event for undo redo
        },
        toggleHeading: function(e) {
            e.preventDefault();
            var range = window.getSelection().getRangeAt(0);
            var wrapper = range.commonAncestorContainer.parentElement;
            if ($(wrapper).is('h3')) {
                $(wrapper).replaceWith(wrapper.textContent);
                return;
            }
            var h3 = document.createElement('h3');
            range.surroundContents(h3);
            changeContent();//Event for undo redo
        },
        urlPrompt: function(callback) {
            // This uses the default browser UI prompt to get a url.
            // Override this function if you want to implement a custom UI.

            var url = prompt('Enter a url', 'http://');

            // Ensure a new link URL starts with http:// or https:// 
            // before it's added to the DOM.
            //
            // NOTE: This implementation will disallow relative URLs from being added
            // but will make it easier for users typing external URLs.
            if (/^((http|https)...)/.test(url)) {
                callback(url);
            } else {
                callback("http://" + url);
            }
        },
        toggleLink: function(e) {
            e.preventDefault();
            var range = window.getSelection().getRangeAt(0);

            // are we in an anchor element?
            if (range.startContainer.parentNode.tagName === 'A' || range.endContainer.parentNode.tagName === 'A') {
                // unlink anchor
                document.execCommand('unlink', false, null);
            } else {
                // promt for url and create link
                this.urlPrompt(function(url) {
                    document.execCommand('createLink', false, url);
                });
            }
            changeContent();//Event for undo redo
        },
        toggleUnorderedList: function(e) {
            e.preventDefault();
            document.execCommand('insertUnorderedList', false, null);
            var element = me.selectedforedit;
            if(element != ''){
                var textEdit = element.getElementsByTagName('div');
                modifyTextText(textEdit, element.getAttribute('id'));
            }
            changeContent();//Event for undo redo
        },
        toggleOrderedList: function(e) {
            e.preventDefault();
            document.execCommand('insertOrderedList', false, null);
            var element = me.selectedforedit;
            if(element != ''){
                var textEdit = element.getElementsByTagName('div');
                modifyTextText(textEdit, element.getAttribute('id'));
            }
            changeContent();//Event for undo redo
        },
        toggleUndo: function(e) {
            e.preventDefault();
            document.execCommand('undo', false, null);
        },
        toggleRedo: function(e) {
            e.preventDefault();
            document.execCommand('redo', false, null);
        },
        justifyLeft: function(e) {
            e.preventDefault();
            document.execCommand('justifyLeft', false, null);
            changeContent();//Event for undo redo
        },
        justifyCenter: function(e) {
            e.preventDefault();
            document.execCommand('justifyCenter', false, null);
            changeContent();//Event for undo redo
        },
        justifyRight: function(e) {
            e.preventDefault();
            document.execCommand('justifyRight', false, null);
            changeContent();//Event for undo redo
        },
        getImage: function(e) {
            e.preventDefault();

            // call startUploader with callback to handle inserting it once it is uploded/cropped
            this.startUploader(this.insertImage);
            changeContent();//Event for undo redo
        },
        startUploader: function(cb) {
            // initialize Image Uploader
            var model = new models.ImageUploader();
            var view = new views.ImageUploader({model: model});

            // stash a reference to the callback to be called after image is uploaded
            model._imageCallback = function(image) {
                view.startCropper(image, cb);
            };


            // stash reference to saved range for inserting the image once its 
            this._savedRange = window.getSelection().getRangeAt(0);

            // insert uploader html into DOM
            $('body').append(view.render().el);
        },
        insertImage: function(image) {
            // insert image - passed as a callback to startUploader
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(this._savedRange);

            var attrs = {
                'editable': this.model.get('editable'),
                'editableModel': this.model.get('editableModel')
            };

            _.extend(attrs, image);

            var model = new models.EditableImage(attrs);
            var view = new views.EditableImage({model: model});
            this._savedRange.insertNode($(view.render().el).addClass('etch-float-left')[0]);
        },
        save: function(e) {
            e.preventDefault();
            var editableModel = this.model.get('editableModel');
            editableModel.trigger('save');
            changeContent();//Event for undo redo
        },
        shownumbers: function(e) {
            var elementToChange = getElementEditing();
            var ol = $($(elementToChange).find("ol"));
            if (ol.css("list-style-type") == "decimal") {
                ol.css("list-style-type", "none");
                modifyCodes(elementToChange, 'numbers', 'false');
            }
            else {
                ol.css("list-style-type", "decimal");
                modifyCodes(elementToChange, 'numbers', 'true');
            }
            changeContent();//Event for undo redo
        },
        moreSpacing: function(e) {
            var elementToChange = getElementEditing();
            var spacing = pxToVw(getFloatValue($(elementToChange).css("line-height")));
            if (spacing) {
                spacing += 0.5;
            }
            else {
                spacing = 2.5;
            }
            if (spacing >= 12) {
                spacing = 11.5;
            }
            $(elementToChange).css("line-height", spacing + "vw", "important");
        },
        lessSpacing: function(e) {
            var elementToChange = getElementEditing();
            var spacing = pxToVw(getFloatValue($(elementToChange).css("line-height")));
            if (spacing) {
                spacing -= 0.5;
            }
            else {
                spacing = 2;
            }
            if (spacing <= 1) {
                spacing = 1.5;
            }
            $(elementToChange).css("line-height", spacing + "vw", "important");
        },
        moreLetterSpacing: function(e) {
            var elementToChange = getElementEditing();
            var spacing = pxToVw(getFloatValue($(elementToChange).css("letter-spacing")));
            if (spacing) {
                spacing += 0.2;
            }
            else {
                spacing = 0.2;
            }
            if (spacing >= 9) {
                spacing = 8.8;
            }
            $(elementToChange).css("letter-spacing", spacing + "vw", "important");
        },
        lessLetterSpacing: function(e) {
            var elementToChange = getElementEditing();
            var spacing = pxToVw(getFloatValue($(elementToChange).css("letter-spacing")));
            if (spacing || spacing == 0) {
                spacing -= 0.2;
            }
            else {
                spacing = 0.2;
            }
            if (spacing < 0) {
                spacing = 0;
            }
            $(elementToChange).css("letter-spacing", spacing + "vw", "important");
        },
        fontSizeUp: function(e) {
            var elementToChange = getElementEditing();
            var current_fontsize = parseFloat(pxToVw(getFontSize(elementToChange)));
            var new_fontsize = current_fontsize + 0.10;

            $(elementToChange).css("font-size", new_fontsize + "vw");
            var fontSizeReadout = document.getElementsByClassName('fontSizeReadout')[0];
            fontSizeReadout.innerHTML = new_fontsize.toFixed(2) + " vw";
            modifyElementSize(elementToChange);
        },
        fontSizeDown: function(e) {
            var elementToChange = getElementEditing();
            var current_fontsize = parseFloat(pxToVw(getFontSize(elementToChange))).toFixed(2);
            var new_fontsize = 1;

            if (current_fontsize >= 1.25) {
                new_fontsize = current_fontsize - 0.10;
            }

            $(elementToChange).css("font-size", new_fontsize + "vw");
            var fontSizeReadout = document.getElementsByClassName('fontSizeReadout')[0];
            fontSizeReadout.innerHTML = new_fontsize.toFixed(2) + " vw";
            modifyElementSize(elementToChange);
        },
        setCodeStyle: function(e) {
            e.preventDefault();
            var elementToChanger = getElementEditing();
            elementToChange = $(elementToChanger.find("pre"));

            var current = elementToChange.attr("data-class");
            var value = extractValue(e);
            elementToChange.removeClass(current);
            elementToChange.addClass(value);
            elementToChange.attr("data-class", value);
            var codestyle = document.getElementsByClassName('codeStyleReadout')[0];
            codestyle.innerHTML = value;
            me.prettifyCode();
            modifyCodes(elementToChanger, 'style', value);
            changeContent();//Event for undo redo
        },
        setFontFamily: function(e) {

            var value = extractValue(e);
            //document.execCommand('fontName', false, value);
            var elementToChange = getElementEditing();
            elementToChange.css("font-family", value);

            var value_name = get_font_name(value);

            //update value on editor button
            var fontFamilyReadout = document.getElementsByClassName('fontFamilyReadout');
            fontFamilyReadout[0].innerHTML = value_name;

            Backbone.trigger('etch:state', {
                face: value_name
            });
            modifyCode(elementToChange, 'format', value)
            changeContent();//Event for undo redo
        },
        setFontSize: function(e) {
            //Extract selected value
            var value = extractValue(e);
            var fontSizeReadout = this.$el.find(".fontSizeReadout");
            var elementToChange = getElementEditing();

            //Update element font-size value
            elementToChange.css("font-size", value + "vw");

            //update value on editor button
            fontSizeReadout.text(parseFloat(value).toFixed(2) + " vw");


            Backbone.trigger('etch:state', {
                size: value
            });
            modifyElementSize(elementToChange);
            changeContent();//Event for undo redo
        }

    });


    // tack on models, views, etc... as well as init function
    _.extend(etch, {
        models: models,
        views: views,
        collections: collections,
        // This function is to be used as callback to whatever event
        // you use to initialize editing 
        editableInit: function(e) {
            e.stopPropagation();
            var target = e.target || e.srcElement;
            var $editable = $(target).etchFindEditable();
            var fontSizeReadout;
            var fontFamilyReadout;
            var codestyle;
//            $(".slidelement").attr("contentEditable", "false");
//            $editable.attr('contenteditable', true);

            // if the editor isn't already built, build it
            var $editor = $('.etch-editor-panel');
            var editorModel = $editor.data('model');
            var alreadyDisplay = false;

            if ($editor.css("display") == "block") {
                alreadyDisplay = true;
            }

            //this.$fontSizeReadout.text($editable.css("font-size"));
            if (!$editor.size()) {
                $editor = $('<div class="etch-editor-panel">');
                var editorAttrs = {editable: $editable, editableModel: this.model};
                document.body.appendChild($editor[0]);
                $editor.etchInstantiate({classType: 'Editor', attrs: editorAttrs});
                editorModel = $editor.data('model');
                $editor.css("overflow", "initial");
                $editor.draggable();
                $editor.draggable({autoscroll: false, containment: "#body-editor", scroll: false});
                if ($("#etch-panel-move")) {
                    $("#etch-panel-move").remove();
                }
                $editor.append(etch_panel_move);
                // check if we are on a new editable
            } else if ($editable[0] !== editorModel.get('editable')[0]) {
                // set new editable
                editorModel.set({
                    editable: $editable,
                    editableModel: this.model
                });
                $editor.css("display", "block");
                $editor.css("overflow", "initial");
                if ($("#etch-panel-move")) {
                    $("#etch-panel-move").remove();
                }
                $editor.append(etch_panel_move);

            } else {
                $editor.css("display", "block");
                $editor.css("overflow", "initial");
            }
            switch ($editable.attr('data-button-class')) {
                case "text":
                    //initialize value of font-size etch-editor-button with selected element value
                    fontSizeReadout = document.getElementsByClassName('fontSizeReadout')[0];
                    fontSizeReadout.innerHTML = parseFloat(pxToVw(getFontSize($editable))).toFixed(2) + " vw";

                    //initialize value of font-family etch-editor-button with selected element value
                    fontFamilyReadout = document.getElementsByClassName('fontFamilyReadout');
                    var value = $editable.css("font-family");
                    if (value[0] === "'") {
                        value = value.substr(value.indexOf("'") + 1, value.lastIndexOf("'") - 1);
                    }
                    else {
                        if (value[0] === "\"") {
                            value = value.substr(value.indexOf("\"") + 1, value.lastIndexOf("\"") - 1);
                        } else {
                            value = value.substr(0, value.lastIndexOf(","));
                        }
                    }
                    fontFamilyReadout[0].innerHTML = value;
                    updateCurrentColor($("#edit-background-color"), getCurrentEtchBackgroundColor());
                    break;

                case "code":
                    var codevalue = $($($editable).find("pre")).attr("data-class");
                    codestyle = document.getElementsByClassName('codeStyleReadout')[0];
                    codestyle.innerHTML = codevalue;
//                    updateCurrentBorderWidth();
//                    updateCurrentColor($("#edit-border-color"), getCurrentEtchBorderColor());
                    break;
                case "graphic":
                    updateCurrentColor($("#edit-fill-color"), getCurrentGraphicColor("fill"));
                    updateCurrentColor($("#edit-stroke-color"), getCurrentGraphicColor("stroke"));
                    updateCurrentStrokeWidth();
                    updateCurrentOpacity($("#edit-fill-opacity"), "fill-opacity");
//                    updateCurrentOpacity($("#edit-stroke-opacity"), "stroke-opacity");
                    break;
            }

            // Firefox seems to be only browser that defaults to `StyleWithCSS == true`
            // so we turn it off here. Plus a try..catch to avoid an error being thrown in IE8.
            try {
                document.execCommand('StyleWithCSS', false, false);
            }
            catch (err) {
                // expecting to just eat IE8 error, but if different error, rethrow
                if (err.message !== "Invalid argument.") {
                    throw err;
                }
            }

            if (models.EditableImage) {
                // instantiate any images that may be in the editable
                var $imgs = $editable.find('img');
                if ($imgs.size()) {
                    var attrs = {editable: $editable, editableModel: this.model};
                    $imgs.each(function() {
                        var $this = $(this);
                        if (!$this.data('editableImageModel')) {
                            var editableImageModel = new models.EditableImage(attrs);
                            var editableImageView = new views.EditableImage({model: editableImageModel, el: this, tagName: this.tagName});
                            $this.data('editableImageModel', editableImageModel);
                        }
                    });
                }
            }

            // listen for mousedowns that are not coming from the editor
            // and close the editor
            $('body').bind('mousedown.editor', function(e) {
                // check to see if the click was in an etch tool
                var target = e.target || e.srcElement;
                if ($(target).not('.etch-editor-panel, .etch-editor-panel *, .etch-image-tools, .etch-image-tools *, .elementediting, .elementediting *,.sp-container *, .colorpicker *, #colorpickerbtn, #textToolsm, #textTools *,.contextmenu-textEditing *').size()) {
                    // remove editor
                    $editor.css("display", "none");

                    if (models.EditableImage) {
                        // unblind the image-tools if the editor isn't active
                        $editable.find('img').unbind('mouseenter');

                        // remove any latent image tool model references
                        $(etch.config.selector + ' img').data('editableImageModel', false);
                    }

                    // once the editor is removed, remove the body binding for it
                    $(this).unbind('mousedown.editor');
                }
            });

            this.model.trigger('change:size', this.model, this.model.get('size'), {});

            //if not already display, move to position, else nothing
            if (!alreadyDisplay) {
                if (e.pageX === 0) {
                    editorModel.set({position: {x: $editable.offset().left - 80, y: $editable.offset().top - 115}});
                } else {
                    editorModel.set({position: {x: e.pageX - 80, y: e.pageY - 115}});
                }
            }
        }
    });

    // jquery helper functions
    $.fn.etchInstantiate = function(options, cb) {
        return this.each(function() {
            var $el = $(this);
            options || (options = {});

            var settings = {
                el: this,
                attrs: {}
            };

            _.extend(settings, options);

            var model = new models[settings.classType](settings.attrs, settings);

            // initialize a view is there is one
            if (_.isFunction(views[settings.classType])) {
                var view = new views[settings.classType]({model: model, el: this, tagName: this.tagName});
            }

            // stash the model and view on the elements data object
            $el.data({model: model});
            $el.data({view: view});

            if (_.isFunction(cb)) {
                cb({model: model, view: view});
            }
        });
    };

    $.fn.etchFindEditable = function() {
        // function that looks for the editable selector on itself or its parents
        // and returns that el when it is found
        var $el = $(this);
        return $el.is(etch.config.selector) ? $el : $el.closest(etch.config.selector);
    };

    window.etch = etch;
})();
