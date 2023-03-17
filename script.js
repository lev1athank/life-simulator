const conves = document.querySelector('.conv')

const ctx = conves.getContext('2d', { willReadFrequently: true })
ctx.lineWidth = 1

let width
let height
let pix


function drawCells() {
    ctx.beginPath();
    ctx.lineWidth = 1
    ctx.strokeStyle = 'gray'
    for (let x = pix; x < width; x+=pix) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.moveTo(0, x)
        ctx.lineTo(width, x)
    }
    ctx.stroke();
}


const [w_I, h_I, p_I] = document.querySelectorAll('input[type="number"]')
function setSetting() {
    conves.width = w_I.value-w_I.value%p_I.value
    conves.height = h_I.value-h_I.value%p_I.value
    width = conves.width 
    height = conves.height
    pix = Number(p_I.value)
    drawCells()
}

[w_I, h_I, p_I].forEach(el=>el.addEventListener('change', ()=>setSetting()))

console.log(conves.width, conves.height);

let basePix = []


const draw = (x, y)=> {
    ctx.beginPath();
    ctx.fillRect(x, y, pix, pix)
    ctx.stroke();
}


let revive = []
let kill = []

function dead_AND_life() {
    ctx.beginPath();
    kill.forEach(([x, y])=> ctx.clearRect(x, y, pix, pix))
    revive.forEach(([x, y])=> draw(x, y))
    ctx.stroke();
    revive = []
    kill = []
}





function check(x, y) {
    
    data = ctx.getImageData(x-pix, y-pix, pix*3, pix*3)
    //ctx.strokeRect(x-pix, y-pix, pix*3, pix*3); //del
    let near = data.data.filter(el=>el == 255).length / (pix*pix)
    
    console.log(near);
    if(ctx.getImageData(x+pix/2, y+pix/2, pix/2, pix/2).data.filter(el=>el > 0).length) {
        near-=1
        if(near <= 1 || near > 3) kill.push([x,y])
    }else{
        if(near == 3) revive.push([x,y])
    }
}


let startInter  
let Islife = false

function creatPix(x, y) {
    if (!Islife) {
        basePix.push(x,y)
        draw(x,y)
    }
}

function clearConv() {
    ctx.clearRect(0,0,width,height)
    life = 0
    renderLifeText()
    basePix.forEach(([x,y])=>draw(x,y))
}










let speed = 1

const speedText = document.querySelector('.sp')
const setSpeed = sp=> {
    speed = sp
    speedText.innerText = sp
    if(life) {
        clearInterval(startInter)
        startLife()
    }
    
}


let life = 0

const lifeText = document.querySelector('.life')

const renderLifeText = ()=>lifeText.innerText = 'прошло жизней:' + life

function startLife() {
    
    startInter = setInterval(()=>{
        for (let x = 0; x < width; x+=pix) {
            for (let y = 0; y < height; y+=pix) {
                check(x, y)
            }
        }
        console.log(kill);
        console.log(revive);
        dead_AND_life()
        life++
        renderLifeText()
        
    }, 1000 / speed)
    
}

function stopLife() {
    clearInterval(startInter)
    clearConv()
    drawCells()
    
}
const startANDstop_Btn = document.querySelector('.start_or_stop')
function start_or_stop() {
    if(startANDstop_Btn.innerText=='старт'){
        startANDstop_Btn.innerText = "стоп"
        clearConv()
        startLife()
    }
    else{
        startANDstop_Btn.innerText = 'старт'
        stopLife()
    }
}
startANDstop_Btn.onclick = start_or_stop

function clearConvas() {
    ctx.clearRect(0,0,width,height)
    drawCells()
    basePix = []
    life = 0
    renderLifeText()
    clearInterval(startInter)
    startANDstop_Btn.innerText = 'старт'
}

conves.addEventListener('click', (el)=>{
    let x = Math.floor(el.offsetX/pix) * pix
    let y = Math.floor(el.offsetY/pix) * pix

    basePix.push([x, y])
    draw(x, y)
})


setSetting(300, 300, 20)
drawCells()
// document.addEventListener('keypress', ()=>Start())