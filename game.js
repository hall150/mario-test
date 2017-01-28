var game = new Phaser.Game(256, 224, Phaser.AUTO, '', { preload: preload, create: create, update: update }, false, false, null);

var score = 0;
var scoreText;

function preload() {

	game.load.image('sky', 'assets/maps/images/yoshis-island/yoshis-island-1.png');
	game.load.image('ground', 'assets/tutorial/platform.png');
	game.load.image('star', 'assets/tutorial/star.png');
	game.load.atlasJSONArray('mario', 'assets/sprites/images/mario/mario.png', 'assets/sprites/images/mario/mario.json');


  // SCALING
  // scale the game 4x
  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
  game.scale.setUserScale(4, 4);

  // enable crisp rendering
  game.renderer.renderSession.roundPixels = false;
  Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)
}

function create() {
	// Enable physics
	game.physics.startSystem(Phaser.Physics.ARCADE);

	// Sky background
	game.add.sprite(0,0,'sky');

	// Platforms
	platforms = game.add.group();
	platforms.enableBody = true;

	// Ground
	var ground = platforms.create(0, game.world.height - 64, 'ground');
	ground.scale.setTo(2,2);
	ground.body.immovable = true;

	// Ledges
	var ledge = platforms.create(400, 400, 'ground');
	ledge.body.immovable = true;
	ledge = platforms.create(-150, 250, 'ground');
	ledge.body.immovable = true;

	/*
	********************************************
	PLAYER
	********************************************
	*/

	player = game.add.sprite(32, game.world.height - 150, 'mario');
	game.physics.arcade.enable(player);
	player.body.bounce.y = 0;
	player.body.gravity.y = 300;
	player.body.collideWorldBounds = true;
  player.direction = 'right';
	player.animations.add('left', [0,3], 10, true);
  player.animations.add('right', [7,4], 10, true);
  // player.animations.add('up', [15], 1, true);

	/*
	********************************************
	STARS
	********************************************
	*/

	stars = game.add.group();

	stars.enableBody = true;

	for (var i = 0; i < 12; i++){
		var star = stars.create(i*70,0,'star');
		star.body.gravity.y = 6;
		star.body.bounce.y = 0.7 + Math.random() * 0.2;
	}

	/*
	*******************************************
	CONTROLS
	*******************************************
	*/
	// Load arrow key controls
	cursors = game.input.keyboard.createCursorKeys();

	/*
	*******************************************
	SCORE
	*******************************************
	*/
	scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000'});

}

function update() {
	var hitPlatform = game.physics.arcade.collide(player, platforms);

	player.body.velocity.x = 0;
	if (cursors.left.isDown){
		player.body.velocity.x = -150;
		player.animations.play('left');
    player.direction = 'left';
	}
	else if (cursors.right.isDown)
	{
		player.body.velocity.x = 150;
		player.animations.play('right');
    player.direction = 'right';
	}
	else
	{
		player.animations.stop();
    if (player.direction === 'left'){
      player.frame = 3;
    } else if (player.direction === 'right'){
		  player.frame = 4;
    }
	}

	if (cursors.up.isDown && player.body.touching.down && hitPlatform)
	{
		player.body.velocity.y = -350;
    // player.animations.play('up');
	}

	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.overlap(player, stars, collectStar, null, this);

}

function collectStar(player, star) {
	star.kill();

	score += 10;
	scoreText.text = 'Score: ' + score;
}
