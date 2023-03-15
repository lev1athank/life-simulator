const conves = document.querySelector('.conv')

const ctx = conves.getContext('2d', { willReadFrequently: true })

const pix = 20

ctx.beginPath();
ctx.lineWidth = 2
for (let x = pix; x < conves.width; x+=pix) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, conves.height)
    ctx.moveTo(0, x)
    ctx.lineTo(conves.width, x)
}
function draw(x, y) {
    ctx.fillStyle = 'blue'
    ctx.lineWidth = 1
    ctx.rect(x, y, pix, pix)
    ctx.fill()
}

draw(20, 20)
ctx.stroke();

for (let x = 0; x < conves.width; x+=pix) {
    for (let y = 0; y < conves.height; y+=pix) {
        let data = ctx.getImageData(x, y, pix, pix)
        for (let index = 0; index < data.data.length; index++) {
            console.log(data.data[index] === 0);
            
        }
        
}}




