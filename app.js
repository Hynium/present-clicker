
/*
	Present clicker project
	By Sam Peeters 2016

	For my dad.
*/

/*
	GLOBAL VARIABLES
*/

//var time = Date.now(); /* {Any} Date for delta time. */

var presentRotationDirection = 1; /* {Number} Direction of the present rotation. */
var presentCounter = 0; /* {Number} Amount of clicks. */

var presentIcon; /* {Any} Present icon next to the counter. */

var fallingPresents = []; /* {Array<Object>} List of falling presents. */

/*
	MATH VARIABLES
*/

var to_radians = Math.PI / 180; /* {Number} Degrees to radians conversion. */


/*
	GAME VARIABLES
*/

/**
* Info about the window dimentions.
*
* @type {Object}
**/
var GameWindow = {
	Width:  null, /* {Number} Width of the window. */
	Height: null  /* {Number} Height of the window. */
};

var canvas, /* {Object} Drawable canvas element. */
	ctx;    /* {Any} Context of the canvas. */

/**
* Handler for mouse input.
*
* @type {Object}
**/
var MouseHandler = {

	x: null, /* {Number} X value of the mouse position. */
	y: null, /* {Number} Y value of the mouse position. */

	/**
    * Gets the position of the mouse.
    *
    * @param {Event} evt Mouse event.
    * @return {Object} position with x and y coördinates.
    **/
    getMousePosition: function (evt) {
        var bounds = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - bounds.left,
            y: evt.clientY - bounds.top
        };
    },

    /**
	* Sets the position of the mouse.
	*
	* @param {Event} evt Mouse event.
    **/
    setMousePosition: function (evt) {
    	var position = this.getMousePosition(evt);

    	this.x = position.x;
    	this.y = position.y;
    },

    /**
	* Handler for mouse click event.
	*
	* @param {Event} evt Mouse event.
    **/
    mouseClicked: function (evt){
    	this.setMousePosition(evt);

    	if (this.x > ClickablePresent.x - ClickablePresent.sprite.width / 2 &&
    		this.x < ClickablePresent.x + ClickablePresent.sprite.width / 2 &&
    		this.y > ClickablePresent.y - ClickablePresent.sprite.width / 2 &&
    		this.y < ClickablePresent.y + ClickablePresent.sprite.height / 2){
    		ClickablePresent.clicked();
    	}
    }

}

/**
* Falling presents when clicked.
*
* @type {Object}
**/
var FallingPresent = {

	x: null, /* {Number} X value of the position. */
	y: null, /* {Number} Y value of the position. */

	sprite: null, /* {Any} Drawable image. */
	scale: 0.25,		 /* {Number} Scale of the sprite. */
	rotation: 0,		 /* {Number} Rotation of the sprite. */
	rotationSpeed: 0,	 /* {Number} Speed of the rotation. */

	fallSpeed: 0, /* {Number} Acceleration of fall. */

	/**
	* Rotate object with its rotation speed.
	**/
	rotate: function () {
		this.rotation += this.rotationSpeed;
	},

	/**
	* Increases object y value and its fallspeed.
	**/
	fall: function () {
		this.fallSpeed += 0.981;
		this.y += this.fallSpeed;
	},

	/**
	* Draw the object.
	**/
	draw: function () {
		ctx.save();

		// Translate to object position
		ctx.translate(this.x, this.y);
		// Rotate
		ctx.rotate(this.rotation * to_radians);
		// Draw image
		ctx.drawImage(this.sprite, -(this.sprite.width / 2) * this.scale, -(this.sprite.height / 2) * this.scale,
		 this.scale * this.sprite.width , this.scale * this.sprite.height);

		ctx.restore();
	}

};

/**
* Represents the clickable object
*
* @type {Object}
**/
var ClickablePresent = {

	x: null, /* {Number} X value of the position. */
	y: null, /* {Number} Y value of the position. */

	sprite: null, /* {Any} Drawable image. */
	scale: 1,	  /* {Number} Scale of the sprite. */
	rotation: 0,  /* {Number} Rotation of the sprite. */

	/**
	* Loads the image.
	**/
	load: function () {
		this.sprite = new Image();
		this.sprite.src = "img/present.png";
	},

	/**
	* Rotates the sprite.
	*
	* @param {Number} degrees Amount
	**/
	rotate: function (degrees) {
		this.rotation += degrees;
	},

	/**
	* Click on the object.
	**/
	clicked: function () {
		this.scale = 1.5;
		presentCounter++;

		// Drop a present
		var p = FallingPresent;
		p.x = Math.random() * (GameWindow.Width - 20) + 10;
		p.y = 0;

		p.sprite = presentIcon;

		p.rotationSpeed = Math.random() * 3;
		p.fallSpeed = 0;

		fallingPresents.push(p);
	},

	/**
	* Draws the object on canvas.
	**/
	draw: function () {

		// Save origin point
		ctx.save();

		// Translate to object position
		ctx.translate(this.x, this.y);
		// Rotate
		ctx.rotate(this.rotation * to_radians);
		// Draw image
		ctx.drawImage(this.sprite, -(this.sprite.width / 2) * this.scale, -(this.sprite.height / 2) * this.scale,
		 this.scale * this.sprite.width , this.scale * this.sprite.height);

		// Restore origin and rotation
		ctx.restore();

	}

};

/*
	MAIN FUNCTION
*/
(function () {

	// Getting window width and height from the browser
	GameWindow.Width  = Math.min(document.documentElement.clientWidth , window.innerWidth  || 0);
	GameWindow.Height = Math.min(document.documentElement.clientHeight, window.innerHeight || 0);

	// Creating the canvas
	canvas = document.createElement('canvas');
	canvas.width  = GameWindow.Width;
	canvas.height = GameWindow.Height;

	// Getting context from canvas
	ctx = canvas.getContext('2d');

	document.body.appendChild(canvas);

	// Set events
	document.addEventListener('resize', function (){
		GameWindow.Width  = Math.min(document.documentElement.clientWidth , window.innerWidth  || 0);
		GameWindow.Height = Math.min(document.documentElement.clientHeight, window.innerHeight || 0);
	}, false);

	document.addEventListener('click', function (evt){
		MouseHandler.mouseClicked(evt);
	}, false);

	// Initialize
	Init();

	// Loop function
	var loop = function () {

		Update();
		Draw();

		window.requestAnimationFrame(loop, canvas);

	}

	window.requestAnimationFrame(loop, canvas);

})();

/*
	GAME FUNCTIONS
*/

/**
* Initialization of the game.
**/
function Init() {

	ClickablePresent.load();
	ClickablePresent.x = GameWindow.Width / 2;
	ClickablePresent.y = GameWindow.Height / 2;

	presentIcon = new Image();
	presentIcon.src = "img/present.png"

}

/**
* Updating the game every frame.
**/
function Update() {

	ClickablePresent.rotate(0.5 * presentRotationDirection);
	if (ClickablePresent.rotation >= 35 || ClickablePresent.rotation <= -35) {
		presentRotationDirection *= -1;
	}

	if (ClickablePresent.scale > 1) {
		ClickablePresent.scale -= 0.025;
	}

	if (ClickablePresent.scale < 1) {
		ClickablePresent.scale = 1;
	}

	//for (var i = 0; i < fallingPresents.length; i++) {
	//	fallingPresents[i].rotate();
	//	fallingPresents[i].fall();

	//	if (fallingPresents[i].y >= GameWindow.Height)
	//		fallingPresents.splice(i, 1);
	//}

}

/**
* Drawing elements on canvas every frame.
**/
function Draw() {

	ctx.clearRect(0, 0, GameWindow.Width, GameWindow.Height);

	//for (var i = 0; i < fallingPresents.length; i++) {
	//	fallingPresents[i].draw();
	//}

	ctx.font = "bold 40pt Arial";
	ctx.fillText(presentCounter, GameWindow.Width / 2 - 40, GameWindow.Height / 4);

	ctx.drawImage(presentIcon, GameWindow.Width / 2 - 90, GameWindow.Height / 4 - 40, 40, 40);

	ClickablePresent.draw();

}