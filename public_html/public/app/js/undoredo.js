'use strict';

function variables() {
    this.id_slides_list = [];
    this.slides_list = [];
    this.modeIndex = '';
    this.elements_list = {};
    this.spaceLines = [];
    this.max_line = 0;
    this.optionsLines = [];
    this.typeElements = {};
    this.slideNumElements = {};
}

var copiesTextEditor = [];
var futureCopiesTextEditor = [];
var presentTextEditor = '';
var copiesVariables = [];
var futureCopiesVariables = [];
var presentVariables = cloneVariables();
var change = true;
var old_slides = [];

function changeContent() {
    if(change){
        me.changesCounter++;
        $("#deck").change();
    }
}

function changeTextEditor(){
    cloneEditorChange();
    futureCopiesTextEditor = [];
    futureCopiesVariables = [];
}

function updateButtons(history) {
    $('.undo').attr('disabled', !history.canUndo());
    $('.redo').attr('disabled', !history.canRedo());
}

function initEvents() {
    me.removelisteners();
    me.attachListeners();
    me.enableDrag();
    me.addSlideEvents();
    me.enableSort();
    resetGraphicsEditor();
    allowEdit();
    playInit();
    //Click on slide. It works with this form
    var thumbId = me.thumbIdFromSlide(me.selectedSlide);
    var slidemask = document.getElementsByClassName('slidemask')
    launchEvent("click", slidemask[0]);
}

function setEditorContents(contents) {
    $('#deck').html(contents);
    initEvents();
}

function cloneVariables(){
    var v = new variables();
    v.id_slides_list = id_slides_list.slice();
    v.slides_list = slides_list.slice();
    v.modeIndex = modeIndex;
    v.elements_list = JSON.parse(JSON.stringify(elements_list));
    v.spaceLines = spaceLines.slice();
    v.max_line = max_line;
    v.optionsLines = optionsLines.slice();
    v.typeElements = JSON.parse(JSON.stringify(typeElements));
    v.slideNumElements = JSON.parse(JSON.stringify(slideNumElements));
    return v;
}

function asVariables(va){
    id_slides_list = va.id_slides_list.slice();
    slides_list = va.slides_list.slice();
    modeIndex = va.modeIndex;
    elements_list = JSON.parse(JSON.stringify(va.elements_list));
    spaceLines = va.spaceLines.slice();
    max_line = va.max_line;
    optionsLines = va.optionsLines.slice();
    typeElements = JSON.parse(JSON.stringify(va.typeElements));
    slideNumElements = JSON.parse(JSON.stringify(va.slideNumElements));
}

function cloneEditorChange(){
    if(presentTextEditor != ''){
        if(copiesTextEditor.length >= 15){
            copiesTextEditor.splice(0,1);
            copiesVariables.splice(0,1);
            copiesTextEditor.push(presentTextEditor);
            copiesVariables.push(presentVariables);
        }
        else{
            copiesTextEditor.push(presentTextEditor);
            copiesVariables.push(presentVariables);
        }
        presentTextEditor = $('#markdown-text').val();
        presentVariables = cloneVariables();
    }
    else{
        presentTextEditor = $('#markdown-text').val();
        presentVariables = cloneVariables();
    }
}

function cloneEditorFuture(){
    if(futureCopiesTextEditor.length >= 15){
        futureCopiesTextEditor.splice(0,1);
        futureCopiesVariables.splice(0,1);
        futureCopiesTextEditor.push(presentTextEditor);
        futureCopiesVariables.push(presentVariables);
    }
    else{
        futureCopiesTextEditor.push(presentTextEditor);
        futureCopiesVariables.push(presentVariables);
    }
}

function cloneEditorPast(){
    if(futureCopiesTextEditor.length >= 5){
        copiesTextEditor.splice(0,1);
        copiesVariables.splice(0,1);
        copiesTextEditor.push(presentTextEditor);
        copiesVariables.push(presentVariables);
    }
    else{
        copiesTextEditor.push(presentTextEditor);
        copiesVariables.push(presentVariables);
    }
}

function undoEditor(){
    cloneEditorFuture();
    var textEditor = copiesTextEditor.pop();
    var variables = copiesVariables.pop();
    presentTextEditor = textEditor;
    presentVariables = variables;
    $('#markdown-text').val(textEditor);
    asVariables(presentVariables);
}

function redoEditor(){
    cloneEditorPast();
    var textEditor = futureCopiesTextEditor.pop();
    var variables = futureCopiesVariables.pop();
    presentTextEditor = textEditor;
    presentVariables = variables;
    $('#markdown-text').val(textEditor);
    asVariables(presentVariables);
}

function initializeUndoRedo() {
    copiesTextEditor = [];
    futureCopiesTextEditor = [];
    presentTextEditor = $('#markdown-text').val();
    copiesVariables = [];
    futureCopiesVariables = [];
    presentVariables = cloneVariables();
    me.changesCounter = 0;
    $(function() {
        var history = new SimpleUndo({
            maxLength: 75,
            provider: function(done) {
                done($('#deck').html());
            },
            onUpdate: function() {
                //onUpdate is called in constructor, making history undefined
                if (!history)
                    return;

                updateButtons(history);
            },
        });

        history.initialize($('#deck').html());

        $('.undo').off();
        $('.redo').off();

        $('.undo').click(function(e) {
            e.stopPropagation();
            undoEditor();
            me.changesCounter--;
            history.undo(setEditorContents);
            for(var psa = 0; psa < old_slides.length; psa++){
                Impressionist.prototype.deleteIdSlide(old_slides[psa]);
            }
        });
        $('.redo').click(function(e) {
            e.stopPropagation();
            redoEditor();
            me.changesCounter++;
            history.redo(setEditorContents);
        });
        $('#deck').change(function() {
            history.save();
        });

        updateButtons(history);

        key('ctrl+z', function(e) {
            me.changesCounter--;
            undoEditor();
            history.undo(setEditorContents);
        });

        key('ctrl+shift+z', function(e) {
            me.changesCounter++;
            redoEditor();
            history.redo(setEditorContents);
        });
    });
}