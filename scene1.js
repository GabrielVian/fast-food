class Scene1 extends Phaser.Scene{
    
    constructor(){
        var config = {
            type: Phaser.AUTO,
            width: window.screen.width,
            height: window.screen.height,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 400 },
                    debug: true
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update  
            }
        };
    }

    

    var player;
    var stars;
    var bombs;
    var platforms;
    var cursors;
    var score = 0;
    var gameOver = false;
    var scoreText;

    let halfWindowHeight = window.screen.availHeight/2;
    let halfWindowWidth = window.screen.availWidth/2;



    var game = new Phaser.Game(config);

    preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ldude', 'assets/little_dude.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('ground2', 'assets/platform2.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('forest', 'assets/forest.png');
        this.load.image('brocolis', 'assets/brocolis.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('hamburger', 'assets/hamburger.png');
        this.load.image('ground1', 'assets/chao.png');
        this.load.image('sky2', 'assets/mont.jpg');
        this.load.image('boost', 'assets/boost.png');
        this.load.audio("death", ["assets/effect1.mp3"]);
        this.load.audio("starSound", ["assets/effect2.mp3"]);
        this.load.audio("jump", ["assets/jump.mp3"]);
        this.load.spritesheet('dude', 
        'assets/no_hb_little_dude.png',
        { frameWidth: 48, frameHeight: 88 }
        );
    }

    create ()
    {
        
        
        death = this.sound.add("death", { loop: false });
        starSound = this.sound.add("starSound", {volume: 0.1}, { loop: false }, {allowMultiple: true});
        jump = this.sound.add("jump", {volume: 0.1}, { loop: false });
        this.add.image(halfWindowWidth, halfWindowHeight, 'forest');
        platforms = this.physics.add.staticGroup();
        boost = this.physics.add.staticGroup();
        
        //chao
        platforms.create(900, 1000, 'ground2').refreshBody();

        
        // let platAmount = 10
        // while(platAmount > 0){
        //     var randPos1 = Phaser.Math.Between(400, 1300);
        //     var randPos2 = Phaser.Math.Between(500, 900);
            
        //     platforms.create(randPos1, randPos2, 'ground');
        //     platAmount--;
        // }

        //plataformas
        platforms.create(600, 800, 'ground');
        platforms.create(50, 750, 'ground');
        platforms.create(750, 520, 'ground');

        

        boost.create(1400, 700, 'boost');
        

        //JOGADOR E CURSOR..
        cursors = this.input.keyboard.createCursorKeys();

        player = this.physics.add.sprite(100, 400, 'dude');
        //player bounce
        //player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 8 }),
            frameRate: 13,
            repeat: -1
        });

        //idle
        this.anims.create({
            key: 'turn',
            frames: this.anims.generateFrameNumbers('dude', { start: 9, end: 10 }),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 11, end: 19}),
            frameRate: 13,
            repeat: -1
        });

        // this.anims.create({
        //     key: 'down',
        //     frames: [ { key: 'dude', frame: 9 } ],
        //     frameRate: 10,
        // });
        this.physics.add.collider(player, platforms);
        

        


        //stars/brocolis...


        stars = this.physics.add.group({
            key: 'brocolis',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.3));

        });

        this.physics.add.collider(stars, platforms);

        this.physics.add.overlap(player, boost, boostJump, null, this);
        this.physics.add.overlap(player, stars, collectStar, null, this);
        let overlapBooster = false
        function boostJump(player, boost){

                if(!overlapBooster){
                    boost.setTint(0xff0000);
                    player.setVelocityY(-730)
                }
                
                overlapBooster = true
        }

        //SCORE
        var score = 0;
        var scoreText;
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        function collectStar (player, star)
        {
            //Barulho da estrela...
            starSound.play()
            star.disableBody(true, true);
            score += 10;
            scoreText.setText('Score: ' + score);
            
            
            if (stars.countActive(true) === 0)
            {
                stars.children.iterate(function (child) {

                    child.enableBody(true, child.x, 0, true, true);

                });

                var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

                var bomb = bombs.create(x, 16, 'hamburger');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

            }
        }


        //BOMBAS....
        bombs = this.physics.add.group();

        this.physics.add.collider(bombs, platforms);

        this.physics.add.collider(player, bombs, hitBomb, null, this);
        
        function hitBomb (player, bomb)
        {
            
            death.play()
            this.physics.pause();

            player.setTint(0xff0000);
            player.anims.play('turn');

            //gameOver = true;
            
            setTimeout(function(){
                
            },25000);
            alert("Fim de jogo");
            location.reload();
        }
    }

    update ()
    {
        if (cursors.left.isDown)
        {
            player.setVelocityX(-200);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(200);

            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('turn', true);
        }

        if (cursors.up.isDown)
        {
            player.setVelocityY(-530);
            jump.play();
        }
        else if (cursors.down.isDown && !player.body.touching.down)
        {
            player.setVelocityY(530);
        }
    }
}