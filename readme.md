Fullslider
=======
![fullslider capture](https://cloud.githubusercontent.com/assets/6854006/15613027/b6fe531e-2431-11e6-9d9e-6c54d20c6900.png)

#### A multiplatform tool to create presentations####

You can create presentations and view it, using Reveal.js. You can check out the Reveal.JS demo presentation: http://lab.hakim.se/reveal-js/

## Browser Compatibility ##
Fullslider works in Chrome, Mozilla Firefox and Opera browsers.


## How to install?##

### With Docker Image ###
First, you need to have installed Docker. 
You can see how to install it here: https://docs.docker.com/engine/installation/

Once Docker has been installed, continue with following steps:

#### Linux ####
1. Open shell
2. Download Fullslider image

	```
	sudo docker pull edujg/fullslider:v0.3
	```
3. Run image

	```
	sudo docker run -p 8888:8888 edujg/fullslider:v0.3
	```
4. Open your browser and write url: 

	```
	localhost:8888
	```
5. You can already work with Fullslider!

#### Windows and Mac OSX ####
1. Open Docker Quickstart Terminal
2. Download Fullslider image

	```
	docker pull edujg/fullslider:v0.3
	```
3. Run image

	```
	docker run -p 8888:8888 edujg/fullslider:v0.3
	```
4. Get docker machine ip
	
	```
	docker-machine ip default
	```
5. Open your browser and write url: 

	```
	dockerip:8888 (for example 192.168.99.100:8888)
	```
6. You can already work with Fullslider!

### With NodeJS ###

First, you need to have installed Node JS. If you have already installed go to "Common steps", if not install it:

#### Linux: ####
Open shell and type the following commands:
```
sudo apt-get install nodejs
```

```
sudo apt-get install npm
```

```
sudo ln -s /usr/bin/nodejs /usr/bin/node
```

#### Mac OSX ####
Open shell and type the following commands:

```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash
```	

```
nvm
```	

```
nvm install stable
```	

```
nvm ls
```	

```
nvm use stable
```	

```
nvm ls-remote
```	

```
nvm alias default stable
```

#### Windows ####
Download NodeJS installer from:
https://nodejs.org/en/


##### Common steps #####
Once NodeJS has been installed, continue with following steps:

1. Click on "Download Zip" button.
2. Unpack it.
3. On console, go to unpacked folder and open "public_html" folder
4. Type command:

	```
	node init.js 
	```
5. Open your browser and write url: 

	```
	localhost:8888
	```
6. You can already work with Fullslider!


## Fullslider Presentation File (.fspf) ##
Presentations created with Fullslider can be downloaded as file to edit later. 
When user click on Download button, a file with .fspf extension is automatically generated. This file contains the following information:
 - Presentation ID
 - Presentation title
 - Presentation content (slides)
 - Configuration parameters
 - Patterns applied to the presentation.

## Release Notes

###### v0.3 - With Fullslider, you can do: ######
 - Create new presentations.
 - Download presentation as .fspf file (FullSlider Presentation File).
 - Open downloaded presentations from Fullslider, with .fspf extension.
 - Export to PDF
 - Add/remove slides.
 - Add/remove text element
 - Edit text element: change color, font, size, align, rotate, skew, add link, add bold, italic, underline and list format.
 - Add Image from:
	*URL
	*Local file
	*Clipboard
 - Edit uploaded images (resize, rotate and crop)
 - Create graphics with Graphic editor
 - Edit already created graphics
 - Add and Edit code
 - Change presentation title
 - Reorder slides
 - Duplicate slides
 - Copy and paste elements
 - Set element as a pattern. This element repeats on all slides
 - Configure default values of text (color, font, etc.)
 - Save presentation on session storage
 - Open recent presentations.
 - And view presentation!

## Quick Guide ##

1 Select New Presentation.

![welcome](https://cloud.githubusercontent.com/assets/6854006/15626732/12bcecec-24cd-11e6-89f8-8c7ace9eb301.PNG)

2 Enter a title.

![title](https://cloud.githubusercontent.com/assets/6854006/15626729/12b12830-24cd-11e6-9f6e-0cb9d91d322b.PNG)


3 For edit text element:

	*One click: select it and shows buttons for delete, rotate and resize.

![selected](https://cloud.githubusercontent.com/assets/6854006/15626731/12b65dbe-24cd-11e6-9a6e-74f0e8ef08d1.PNG)

	*Double click: select for edit. You can write text, change size, colour, font, etc.

![edit](https://cloud.githubusercontent.com/assets/6854006/15626730/12b11214-24cd-11e6-883a-120d33d3cf13.PNG)

## Text-editor guide ##

* Slide without title --> #
* Slide with title --> #Title
* Subslide without title --> ##
* Subslide with title --> ##Title
* Create automatic index --> You starts the text with \[indexp\] (one slide for the index) or \[indexf\] (several slides for the index)
* Title --> -Title-
* Subtitle --> --Subtitle--
* Paragraph --> Text
* Bold paragraph --> \*\*Text\*\* or \_\_Text\_\_
* Italic paragraph --> \*Text\* or \_Text\_
* Code --> \`Code\`
* Square --> >
* Line --> >>
* Ellipse --> >>>
* Arrow --> >>>>
* Image --> !\[Alternate text\](url)

## Credits ##

* Impressionist https://github.com/harish-io/Impressionist
* RevealJS https://github.com/hakimel/reveal.js/
* Spectrum https://github.com/bgrins/spectrum
* Etch http://etchjs.com/
* Bootstrap http://getbootstrap.com/
* JQuery http://jquery.com/
* Fontawesome http://fontawesome.io
* Bootstrap File-input https://github.com/kartik-v/bootstrap-fileinput
* CropperJS https://github.com/fengyuanchen/cropperjs
* Fontello http://fontello.com/
* jQuery ContextMenu https://github.com/swisnl/jQuery-contextMenu
* JSVectorEditor https://code.google.com/archive/p/jsvectoreditor/
* Simple-Undo https://github.com/mattjmattj/simple-undo/
* NodeJS https://nodejs.org/en/
* Docker https://www.docker.com/
* Highlight.js https://highlightjs.org
* PhantomJS phantomjs.org
* Decktape https://github.com/astefanutti/decktape
* Markdown-js https://github.com/evilstreak/markdown-js

## License ##
Fullslider is licensed under Apache license 2.0
