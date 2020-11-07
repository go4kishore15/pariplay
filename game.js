// create a new scene
let gameScene =  new Phaser.Scene('Game');

// Load Assests
gameScene.preload = function()
{
    this.load.image('background','assests/Poseidon-05.jpg')
    this.load.image('frame','assests/slot.png')
    this.load.image('panel','assests/RibbionLayout.png')
    this.load.image('sym01','assests/001.png')
    this.load.image('sym02','assests/002.png')
    this.load.image('sym03','assests/003.png')
    this.load.image('sym04','assests/004.png')
    this.load.image('sym05','assests/005.png')
    this.load.image('sym06','assests/006.png')
    this.load.image('sym07','assests/007.png')
    this.load.image('sym08','assests/008.png')
    this.load.image('sym09','assests/009.png')
    this.load.image('sym010','assests/0010.png')
    this.load.image('sym0011','assests/011.png')
    
    this.load.image('btn_spin','assests/SpinButton.png');
    this.load.image('symbol','assests/symbols.png')
    this.load.image('symbolblur','assests/symbols_blur.png')
    this.load.image('mask','assests/Mask.png')
}

// Called once after the preload
gameScene.create = function()
{    
    let total_slot = 10;
    // let slot_size = 134;
    let slot_size = 550;
    let space_size = 170;
    let slot_height = slot_size*total_slot;
    let self = this;
    let slot = [];
    let stop_at = [];
    let spin_delay = 300;
    let reel_size = 1;
    //let fix = {
    //    x: config.width/2-game_config.main.width/2,
    //    y: game_config.main.height/2,
    //};
    // let start_x = 301+fix.x;
    // let start_y = 858;
    let start_x = 550;
    let start_y = 80;
    let is_spinning = false;
    
    let state = 'play';
    let timer;



    let gameW = this.sys.game.config.width
    let gameH = this.sys.game.config.height
    // console.log(gameW, gameH)
    // place the sprice in the center using the setPosition()
    this.add.sprite(0, 0, 'background').setPosition(gameW/2,gameH/2)

    this.add.sprite(0,0,"frame").setPosition(gameW/2,gameH/2-50)

    this.add.sprite(0,0,"panel").setPosition(gameW/2,gameH/2)

    this.add.sprite(0,0,"spinBtn").setPosition(gameW-100, gameH-100)
    let b_spin = draw_button(gameW-100, gameH-100,'spin',this);
    
    let img_mask = this.add.sprite(gameW/2, gameH/2-50, 'mask').setVisible(false);
    let mask = new Phaser.Display.Masks.BitmapMask(this, img_mask);
    for(let i=0; i<reel_size; i++){
        let rand = Math.round(Math.random()*7);
        
        let o = this.add.tileSprite(start_x+(space_size*i),start_y+(rand*slot_size),slot_size,slot_height*3,'symbol'); //B7L

        o.id = i;
        o.setMask(mask);
        slot.push(o);
        stop_at.push(Math.floor(Math.random()*total_slot)); 
    } 

//   var particles;
//    var rect = new Phaser.Geom.Rectangle(0, 0, slot_size-40, slot_size-40);
    this.input.on('gameobjectdown', function(pointer, obj){
        if(obj.button){
            console.log("Objbutton")        
            if(state === 'play'){
                console.log('state === play')            
                if(obj.name === 'spin'){
                     let_spin();
                    console.log('Spin Button pressed')
                }
            }            
        }
    }, this);


    function let_spin(){
        if(!is_spinning && state === 'play'){            
            if(timer){
                clearInterval(timer);
            }
            is_spinning = true;
            state = 'spin';
            spin();
        }
    }

    function spin(){
        generate_result();
        let index = 0;
        let timer = setInterval(function(){
            spin_start(slot[index]);
            index++;
            if(index >= reel_size){
                clearInterval(timer);
            }
        }, spin_delay);
    }
    
    function spin_start(obj){
        self.tweens.add({
            targets: obj,
            y: slot_height+slot_size,
            duration: 800,
            ease: 'Back.easeIn',
            onComplete(){
                spin_long(obj);
            }
        });
    }

    function spin_long(obj){
        obj.y = slot_size;
        obj.setTexture('symbolblur');
        self.tweens.add({
            targets: obj,
            y: slot_height+slot_size,
            duration: 500,
            ease: 'Linear',
            loop: 2,
            onComplete(){
                spin_end(obj);
            }
        });
    }
 
    function spin_end(obj){
        obj.y = get_stop('start', obj.id);
        obj.setTexture('symbol');
        self.tweens.add({
            targets: obj,
            y: get_stop('end', obj.id),
            duration: 800,
            ease: 'Back.easeOut',
            onComplete(){
                if(obj.id === reel_size - 1){                    
                    is_spinning = false;
                    state = 'play';
                }
            }
        });
    }

    

    function get_stop(e,i){
        if(e === 'start'){
            return -((slot_size*stop_at[i])+start_y);
        } else {
            return start_y-(slot_size*stop_at[i]);
        }
    }

    function generate_result(){
        for(let i=0; i<reel_size; i++){
            stop_at[i] = Math.floor(Math.random()*total_slot); //Initial result
        }
    }

    function draw_button(x, y, id, scope){
        var o = scope.add.sprite(x, y, 'btn_'+id).setInteractive();
        o.button = true;
        o.name = id;
        return o;
    }

}

// set the configuraiton of the game
let config = {
    type: Phaser.AUTO,
    width: 1980,
    height: 1080,
    scene: gameScene
}


// create a new gamew, pass the configuration
let game = new Phaser.Game(config)