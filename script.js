const conves = document.querySelector('.conv')

const ctx = conves.getContext('2d', { willReadFrequently: true })

const pix = 10


ctx.lineWidth = 2
// for (let x = pix; x < conves.width; x+=pix) {
//     ctx.moveTo(x, 0)
//     ctx.lineTo(x, conves.height)
//     ctx.moveTo(0, x)
//     ctx.lineTo(conves.width, x)
// }


const draw = (x, y)=> ctx.fillRect(x, y, pix, pix)



draw(160, 160)
draw(170, 160)
draw(170, 150)
draw(180, 160)

draw(100, 100)
draw(110, 100)
draw(120, 100)


draw(220, 160)
draw(230, 160)
draw(240, 160)
draw(230, 150)

ctx.stroke();

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
    let near = data.data.filter(el=>el == 255).length / 100

    
    if(ctx.getImageData(x+pix/2, y+pix/2, pix/2, pix/2).data.filter(el=>el == 255).length) {
        near-=1
        if(near <= 1 || near > 3) kill.push([x,y])
    }else{
        if(near == 3) revive.push([x,y])
    }
}

const Start = setInterval(()=>{
    const w = conves.width
    const h = conves.height
    for (let x = 0; x < w; x+=pix) {
        for (let y = 0; y < h; y+=pix) {
            check(x, y)
        }
    }
    dead_AND_life()
    
}, 300)


// document.addEventListener('keypress', ()=>Start())