var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 2000 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('sky', 'js/assets/background2.png');
  this.load.image('block', 'js/assets/block2.png');
  this.load.image('ball', 'js/assets/ball.png');
}

var block;
var ball;
var blockDraggable;
let startMoving = false;

function create ()
{
  this.add.image(400, 300, 'sky');
  block = this.physics.add.staticGroup();

  let holes = [3, 7, 10]; // Кол-во препятсвий

  for (let i = 0; i < 17; i += 1) {
     if (!holes.includes(i)) block.create(i*50, 400, 'block'); //Генерация блоков и препятсвий
  }

  for (let i = 1; i < holes.length+1; i += 1) {
    //Генерация перетаскиваемых блоков через create, для чего нужно создать группу из blockDraggable. Но тогда на обьекты группы не распространяются параметры, заданные ниже.
  }

//-----------------------------------
  blockDraggable = this.physics.add.image(100, 500, 'block').setInteractive();
  blockDraggable.body.setAllowGravity(false).setImmovable();
  this.input.setDraggable(blockDraggable);
//-----------------------------------

  ball = this.physics.add.image(50, 100, 'ball').setInteractive().setBounce(0.3);
  this.physics.add.collider(ball, block);
  this.physics.add.collider(ball, blockDraggable);

}

function update ()
{
  ball.on('pointerdown', () => {startMoving = true;});
  if (startMoving) ball.x += 2;
  if (ball.y > 800) {
    startMoving = false;
    ball.x = 50;
    ball.y = -50;
  }

  if (ball.x > 825) {
    startMoving = false;
    // Следующий уровень
    ball.x = 50;
    ball.y = -50;
  }

  this.input.on('drag', function (pointer, gameObject, dragX, dragY) {gameObject.x = dragX; gameObject.y = dragY;});
  blockDraggable.on('pointerup', (pointer) => {
    if (pointer.leftButtonReleased()) {
        blockDraggable.x = Phaser.Math.Snap.To(blockDraggable.x, 50);
        blockDraggable.y = Phaser.Math.Snap.To(blockDraggable.y, 50);
      }
  });

}
