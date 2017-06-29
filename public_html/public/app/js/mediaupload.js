function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}


function createImageFromDataUrl(data_url, url=undefined) {
    var i = new Image();
    i.onload = function() {
        me.addImageToSlide({src: this.src, width: this.width, height: this.height}, url);
        changeContent();//Event for undo redo 
    };
    i.src = data_url;
}

function blobAsDataUrl(blob, func, url=undefined) {
    var reader = new FileReader();
    reader.onloadend = function() {
        func(reader.result, url);
    };

    reader.readAsDataURL(blob);
}

function createImageFromBlob(blob, url=undefined) {
    blobAsDataUrl(blob, createImageFromDataUrl, url);
}

function fileAsDataUrl(file, func) {
    var reader = new FileReader();
    reader.onloadend = function() {
        func(reader.result);
    };
    reader.readAsBinaryString(file);
}

function createImageFromFile(file) {
    fileAsDataUrl(file, createImageFromBlob);
}

//JSON File is defined in loadimage.js module
function createImageFromJSONFile(json) {
    var blob = b64toBlob(json.file, json.type);
    createImageFromBlob(blob, json.url);
}

function SvgToDataUrl(svg) {
    var url = 'data:image/svg+xml;base64,' + btoa(svg);
    return url;
}