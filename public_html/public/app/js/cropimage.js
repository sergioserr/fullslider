window.onload = function() {

    'use strict';

    var Cropper = window.Cropper;
    var console = window.console || {log: function() {
        }};
    var container = document.querySelector('.img-container');
    var image = container.getElementsByTagName('img').item(0);

    var options = {
        aspectRatio: 16 / 9,
        preview: '.img-preview',
        build: function() {
        },
        built: function() {
        },
        cropstart: function(data) {
        },
        cropmove: function(data) {
        },
        cropend: function(data) {
        },
        crop: function(data) {
        },
        zoom: function(data) {
        }
    };
    var cropper = new Cropper(image, options);

    function isUndefined(obj) {
        return typeof obj === 'undefined';
    }

    function preventDefault(e) {
        if (e) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        }
    }


    // Tooltip
    $('[data-toggle="tooltip"]').tooltip();


    // Buttons
    if (!document.createElement('canvas').getContext) {
        $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
    }

    if (typeof document.createElement('cropper').style.transition === 'undefined') {
        $('button[data-method="rotate"]').prop('disabled', true);
        $('button[data-method="scale"]').prop('disabled', true);
    }



    // Options
    actions.querySelector('.docs-toggles').onclick = function(event) {
        var e = event || window.event;
        e.preventDefault();
        e.stopPropagation();

        var target = e.target || e.srcElement;
        var cropBoxData;
        var canvasData;
        var isCheckbox;
        var isRadio;
        if (!cropper) {
            return;
        }

        if (target.tagName.toLowerCase() === 'span') {
            target = target.parentNode;
        }

        if (target.tagName.toLowerCase() === 'label') {
            target = target.getElementsByTagName('input').item(0);
        }

        isCheckbox = target.type === 'checkbox';
        isRadio = target.type === 'radio';

        if (isCheckbox || isRadio) {
            if (isCheckbox) {
                options[target.name] = target.checked;
                cropBoxData = cropper.getCropBoxData();
                canvasData = cropper.getCanvasData();

                options.built = function() {
                    cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
                };
            } else {
                options[target.name] = target.value;
                options.built = function() {
                };
            }

            // Restart
            cropper.setAspectRatio(target.value);
        }
    };


    // Methods
    function docsButtonsHandler(event) {
        var e = event || window.event;

        e.preventDefault();
        e.stopPropagation();

        var target = this;
        var result;
        var input;
        var data;

        if (!cropper) {
            return;
        }

        data = {
            method: target.getAttribute('data-method'),
            target: target.getAttribute('data-target'),
            option: target.getAttribute('data-option'),
            secondOption: target.getAttribute('data-second-option')
        };

        if (data.method) {
            if (typeof data.target !== 'undefined') {
                input = document.querySelector(data.target);

                if (!target.hasAttribute('data-option') && data.target && input) {
                    try {
                        data.option = JSON.parse(input.value);
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            }

            if (data.method === 'getCroppedImg') {
                data.option = JSON.parse(data.option);
                result = cropper.getCroppedCanvas();
            }
            else {
                result = cropper[data.method](data.option, data.secondOption);
            }


            switch (data.method) {
                case 'scaleX':
                case 'scaleY':
                    target.setAttribute('data-option', -data.option);
                    break;

                case 'getCroppedImg':
                    if (result) {
                        me.saveEditImage(result.toDataURL());
                    }

                    break;

                case 'destroy':
                    cropper = null;
                    break;
            }

            if (typeof result === 'object' && result !== cropper && input) {
                try {
                    input.value = JSON.stringify(result);
                } catch (e) {
                    console.log(e.message);
                }
            }

        }
    }
    ;

    $(".doc-button").on("click", docsButtonsHandler);

    document.body.onkeydown = function(event) {
        var e = event || window.event;

        if (!cropper || this.scrollTop > 300) {
            return;
        }  
    };


    // Change image
    var blobURL;

    $('#image-crop').change(function() {
        blobURL = $('#image-crop').attr("src");
        cropper.reset().replace(blobURL);
    });
};