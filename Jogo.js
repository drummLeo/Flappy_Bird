const sprites = new Image()
sprites.src = './sprites.png'

const hitSound = new Audio('efeitos_hit.wav')
const jumpSound = new Audio("efeitos_pulo.wav")
const scoreSound = new Audio("efeitos_ponto.wav")

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

let frames = 0

function doCollision(flappyBird, floor){
    const flappyBirdY = flappyBird.y + flappyBird.height
    const floorY = floor.y

    return flappyBirdY >= floorY;
}

function createFlappyBird(){
    const flappyBird = {
        movements: [
            {spriteX: 0, spriteY: 0},
            {spriteX: 0, spriteY: 26},
            {spriteX: 0, spriteY: 52}
        ],
        width: 33,
        height: 24,
        x:10,
        y: 50,
        gravity: 0.25,
        speed: 0,
        jumpHeight: 4.6,

        update(){
            if(doCollision(flappyBird, globals.floor)){
                hitSound.play()

                setTimeout(() => {
                    setScreen(screens.GAMEOVER)
                }, 500)

                return
            }

            this.speed += this.gravity
            this.y += this.speed
        },

        currentFrame: 0,

        updateCurrentFrame(){
            const framesInterval = 10
            const intervalHasPassed = frames % framesInterval === 0

            if(intervalHasPassed) {
                const incrementBase = 1
                const increment = incrementBase + this.currentFrame
                const repeatBase = this.movements.length
                this.currentFrame = increment % repeatBase
            }
        },

        draw(){
            this.updateCurrentFrame()
            const { spriteX, spriteY } = this.movements[this.currentFrame]

            context.drawImage(
                sprites,
                spriteX, spriteY, //sprite x and sprite y
                this.width, this.height, //size of sprite slice
                this.x, this.y,
                this.width, this.height
            )
        },
        jump(){
            jumpSound.play()
            this.speed = -this.jumpHeight
        }
    }
    return flappyBird
}

function createFloor() {
    return {
        spriteX: 0,
        spriteY: 610,
        width: 224,
        height: 112,
        x: 0,
        y: canvas.height - 112,
        draw() {
            context.drawImage(
                sprites,
                this.spriteX, this.spriteY, //sprite x and sprite y
                this.width, this.height, //size of sprite slice
                this.x, this.y,
                this.width, this.height
            )

            context.drawImage(
                sprites,
                this.spriteX, this.spriteY, //sprite x and sprite y
                this.width, this.height, //size of sprite slice
                (this.x + this.width), this.y,
                this.width, this.height
            )
        },
        update() {
            const floorMovement = 1
            const repeatIn = this.width / 2
            const movement = this.x - floorMovement

            this.x = movement % repeatIn
        }
    }
}

function createPipe(){
    const pipe = {
        width: 52,
        height: 400,
        floor: {
            spriteX: 0,
            spriteY: 169
        },
        sky: {
            spriteX: 52,
            spriteY: 169
        },
        space: 80,
        draw(){

            pipe.pairs.forEach(
                function(pair) {
                const yRandom = pair.y
                const gap = 90

                const skyPipeX = pair.x
                const skyPipeY = yRandom

                context.drawImage(
                    sprites,
                    pipe.sky.spriteX, pipe.sky.spriteY,
                    pipe.width, pipe.height,
                    skyPipeX, skyPipeY,
                    pipe.width, pipe.height
                )

                const floorPipeX = pair.x
                const floorPipeY = pipe.height + gap + yRandom

                context.drawImage(
                    sprites,
                    pipe.floor.spriteX, pipe.floor.spriteY,
                    pipe.width, pipe.height,
                    floorPipeX, floorPipeY,
                    pipe.width, pipe.height
                )
                pair.skyPipe = {
                    x: skyPipeX,
                    y: pipe.height + skyPipeY
                }
                pair.floorPipe = {
                    x: floorPipeX,
                    y: floorPipeY
                }
            })
            },

        pairs: [],

        collideWithFlappyBird(pair){
            const flappyHead = globals.flappyBird.y
            const flappyFoot = globals.flappyBird.y + globals.flappyBird.height

            return globals.flappyBird.x >= pair.x - globals.flappyBird.width
                && (flappyHead <= pair.skyPipe.y
                    || flappyFoot >= pair.floorPipe.y);
        },

        update(){
            const hundredFrames = frames % 100 === 0
            if(hundredFrames){
                pipe.pairs.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                })
            }
            pipe.pairs.forEach(function (pair){
                pair.x -= 2

                if (pipe.collideWithFlappyBird(pair)) {
                    hitSound.play()
                    setTimeout(() => {
                        setScreen(screens.GAMEOVER)
                    }, 100)
                }

                if(pair.x + pipe.width <= 0){
                    pipe.pairs.shift()
                }
            })
        }
    }
    return pipe
}

const background = {
    spriteX: 390,
    spriteY: 0,
    width: 275,
    height: 204,
    x: 0,
    y: canvas.height - 204,
    draw(){
        context.fillStyle = '#70c5ce'
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.drawImage(
            sprites,
            this.spriteX, this.spriteY, //sprite x and sprite y
            this.width, this.height, //size of sprite slice
            this.x, this.y,
            this.width, this.height
        )

        context.drawImage(
            sprites,
            this.spriteX, this.spriteY, //sprite x and sprite y
            this.width, this.height, //size of sprite slice
            (this.x + this.width), this.y,
            this.width, this.height
        )
    }
}

const globals = {}

const titleScreen = {
    spriteX: 134,
    spriteY: 0,
    width: 174,
    height: 152,
    x: canvas.width/2 - 174/2,
    y: 50,
    draw() {
        context.drawImage(
            sprites,
            this.spriteX, this.spriteY, //sprite x and sprite y
            this.width, this.height, //size of sprite slice
            this.x, this.y,
            this.width, this.height
        )
    }
}

const gameOverScreen = {
    spriteX: 134,
    spriteY: 153,
    width: 226,
    height: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50,
    draw(){
        context.drawImage(
            sprites,
            this.spriteX, this.spriteY,
            this.width, this.height,
            this.x, this.y,
            this.width, this.height
        )
        context.font = '24px "VT323"'
        context.textAlign = 'center'
        context.fillStyle = "white"
        context.fillText(
            `${globals.score.scored}`,
            221, 142
        )
    }
}

let activeScreen = {}
function setScreen(newScreen){
    activeScreen = newScreen
    if(activeScreen.init){
        activeScreen.init()
    }
}

function createScore(){
    const score = {
        scored: 0,
        draw(){
            context.font = '35px "VT323"'
            context.textAlign = 'right'
            context.fillStyle = "white"
            context.fillText(`Score: ${score.scored}`, canvas.width - 10, 35)
        },
        update(){
            const framesInterval = 108
            const intervalHasPassed = frames > 104 ? frames % framesInterval === 0:false
            if(intervalHasPassed){
                    scoreSound.play()
                    score.scored++
            }
        }
    }
    return score
}

const screens = {
    INIT: {
        init(){
            globals.flappyBird = createFlappyBird()
            globals.floor = createFloor()
            globals.pipe = createPipe()
        },
        draw(){
            background.draw()
            globals.floor.draw()
            globals.flappyBird.draw()
            globals.pipe.draw()
            titleScreen.draw()
        },
        update(){
            globals.floor.update()
            //globals.pipe.update()
        },
        click(){
            setScreen(screens.GAME)
        }
    }
}

screens.GAME = {
    init(){
        frames = 0
      globals.score = createScore()
    },
    draw(){
        background.draw()
        globals.pipe.draw()
        globals.floor.draw()
        globals.flappyBird.draw()
        globals.score.draw()
    },
    update(){
        globals.floor.update()
        globals.flappyBird.update()
        globals.pipe.update()
        globals.score.update()
    },
    click() {
        globals.flappyBird.jump()

    }
}

screens.GAMEOVER = {
    draw(){
        gameOverScreen.draw()
    },
    update(){

    },
    click(){
        location.reload()
    }
}

function loop(){
    activeScreen.update()
    activeScreen.draw()

    frames++

    requestAnimationFrame(loop)
}

addEventListener(
    'click',
    function (){
        if(activeScreen.click){
            activeScreen.click()
        }
    }
)

setScreen(screens.INIT)
loop()