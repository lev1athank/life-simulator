const conves = document.querySelector('.conv')
document.addEventListener('contextmenu', event => event.preventDefault());
const ctx = conves.getContext('2d', { willReadFrequently: true })

const [birth, survival] = document.querySelectorAll('.settingGame input') //body > div.setting > div.tool.settingGame > div.WH.config-size > input[type=number]

console.log(birth.value.split(''), survival.value.split(''));

let width
let height
let pix

let colorBack = [255, 255, 255, 255]
let colorPix = [0, 0, 0, 255]
let colorCell = [50, 50, 50, 255]


function drawCells() {
    ctx.beginPath();
    ctx.lineWidth = 1
    console.log(`rgb(${colorCell[0]},${colorCell[1]},${colorCell[2]})`);
    ctx.strokeStyle = `rgb(${colorCell[0]},${colorCell[1]},${colorCell[2]})`
    for (let x = pix; x < width; x += pix) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)

    }
    for (let x = pix; x < height; x += pix) {
        ctx.moveTo(0, x)
        ctx.lineTo(width, x)
    }
    ctx.stroke();
}

let basePix = []

const hexToR = (h) => parseInt((cutHex(h)).substring(0, 2), 16)
const hexToG = (h) => parseInt((cutHex(h)).substring(2, 4), 16)
const hexToB = (h) => parseInt((cutHex(h)).substring(4, 6), 16)
const cutHex = (h) => (h.charAt(0) == "#") ? h.substring(1, 7) : h

const RgbSplit = (rgb) => {
    return [hexToR(rgb), hexToG(rgb), hexToB(rgb), 255]
}

const [w_I, h_I, p_I] = document.querySelectorAll('input[type="number"]')
const [Cb, Cp, Cc] = document.querySelectorAll('input[type="color"]')
console.log(Cb, w_I);
function setSetting() {
    stopLife()
    console.log(RgbSplit(Cc.value));
    conves.width = w_I.value - w_I.value % p_I.value
    conves.height = h_I.value - h_I.value % p_I.value
    width = conves.width
    height = conves.height
    pix = Number(p_I.value)
    colorBack = conves.style.backgroundColor = Cb.value
    colorPix = RgbSplit(Cp.value)
    colorCell = RgbSplit(Cc.value)
    basePix = []
    drawCells()
}

[w_I, h_I, p_I, Cb, Cp, Cc].forEach(el => el.addEventListener('change', setSetting))




const draw = (x, y) => {
    ctx.beginPath();
    ctx.fillStyle = `rgb(${colorPix[0]},${colorPix[1]},${colorPix[2]})`
    ctx.fillRect(x, y, pix, pix)
    ctx.stroke();
}


let revive = []
let kill = []

function dead_AND_life() {
    ctx.beginPath();
    kill.forEach(([x, y]) => ctx.clearRect(x, y, pix, pix))
    revive.forEach(([x, y]) => draw(x, y))
    ctx.stroke();
    revive = []
    kill = []
}





function check(x, y) {

    data = ctx.getImageData(x - pix, y - pix, pix * 3, pix * 3)
    //ctx.strokeRect(x-pix, y-pix, pix*3, pix*3); //del
    // let near = data.data.filter(el => el == 255).length / (pix * pix)
    let near = 0
    let dataPix = data.data
    for (let pos = 0; pos < dataPix.length; pos += 4) {
        if (dataPix[pos] == colorPix[0] && dataPix[pos + 1] == colorPix[1] && dataPix[pos + 2] == colorPix[2])
            near++
    }
    near /= 100
    if (ctx.getImageData(x + pix / 2, y + pix / 2, pix / 2, pix / 2).data.filter(el => el > 0).length) {
        near -= 1
        if (survival.value.split('').indexOf(near.toString()) == -1) kill.push([x, y])
    } else {
        if (birth.value.split('').indexOf(near.toString()) >= 0) revive.push([x, y])
    }
}


let startInter
let Islife = false




function clearConvas() {
    ctx.clearRect(0, 0, width, height)
    clearInterval(startInter)
    basePix.forEach(([x, y]) => draw(x, y))
    life = 0
    renderLifeText()
}


function data_cleaning() {
    basePix = []
    clearConvas()
}



function restart() {
    data_cleaning()
    drawCells()
    startANDstop_Btn.innerText = 'старт'
}





let speed = 1

const speedText = document.querySelector('.sp')
const setSpeed = sp => {
    speed = sp
    speedText.innerText = sp
    if (life) {
        clearInterval(startInter)
        startLife()
    }

}


let life = 0

const lifeText = document.querySelector('.life')

const renderLifeText = () => lifeText.innerText = 'прошло жизней:' + life

function startLife() {
    startANDstop_Btn.innerText = "стоп"

    startInter = setInterval(() => {
        for (let x = 0; x < width; x += pix) {
            for (let y = 0; y < height; y += pix) {
                check(x, y)
            }
        }
        dead_AND_life()
        life++
        renderLifeText()

    }, 1000 / speed)

}

function stopLife() {
    startANDstop_Btn.innerText = 'старт'
    clearConvas()
    drawCells()

}

const startANDstop_Btn = document.querySelector('.start_or_stop')
function start_or_stop() {
    if (startANDstop_Btn.innerText == 'старт') {
        clearConvas()
        startLife()
    }
    else {
        stopLife()
    }
}
startANDstop_Btn.onclick = start_or_stop


function createPix(el, IdDel = false) {
    let x = Math.floor(el.offsetX / pix) * pix
    let y = Math.floor(el.offsetY / pix) * pix

    const id = basePix.map(el => JSON.stringify(el)).indexOf(JSON.stringify([x, y]))
    if (id >= 0 && IdDel) {
        basePix.splice(id, 1)
        ctx.clearRect(x, y, pix, pix)

    } else if (!IdDel) {
        basePix.push([x, y])
        draw(x, y)
    }
    clearConvas()
    drawCells()

}

let IsMove = false


conves.addEventListener('mousedown', (el) => {
    if (life > 0) return
    if (el.which == 1) {
        createPix(el)
    } else {
        createPix(el, true)
    }
    IsMove = true
})

conves.addEventListener('mousemove', (el) => {
    if (!IsMove) return
    console.log(el.which);
    if (el.which == 1) {
        createPix(el)
    } else {
        createPix(el, true)
    }
})

conves.addEventListener('mouseup', () => {
    IsMove = false
})

setSetting()

const btnsPlus = document.querySelectorAll('#config-plus')
const btnsMinus = document.querySelectorAll('#config-minus')
const inpts = document.querySelectorAll('.tool.config > .WH > input')

for (let i = 0; i < 3; i++) {
    btnsPlus[i].onclick = function () { inpts[i].value = (Number(inpts[i].value) + (i == 2 ? 10 : pix)); setSetting() }

    btnsMinus[i].onclick = function () { inpts[i].value = (Number(inpts[i].value) - (i == 2 ? 10 : pix)); setSetting() }
}













