const image1 = document.querySelector(".first > img");
const image2 = document.querySelector(".second > img");
const resolt = document.querySelector(".resolt");
const firstImage = document.querySelector("#first-image");
const secondImage = document.querySelector("#second-image");
const compare = document.querySelector(".compare");
const color = document.querySelector("#color");
const radio = document.querySelectorAll("input[name='chack-type']");
const range = document.querySelector("#range");

const canvas1 = document.createElement('canvas');
const canvas2 = document.createElement('canvas');
const canvasRes = document.createElement('canvas');
const reader1 = new FileReader();
const reader2 = new FileReader();
let allLoaded = 0;

const radioValue = () => {
    let value;
    radio.forEach(i => {
        if (i.checked) {
            value = i.value;
        }
    })
    console.log(value);
    return value;

}

image1.addEventListener("loaded", () => { console.log("loaded the 1"); });
image2.addEventListener("loaded", () => { console.log("loaded the 2"); });

const drawPixel = (context, x, y, color) => {
    context.fillStyle = color || '#000';
    context.fillRect(x, y, 1, 1);
}

const getCanvasData = (canvas, image) => {
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    return { imageData, context };
};

secondImage.addEventListener('change', (event) => {
    if (!!event.target.files.length) {

        const fileList = event.target.files;
        image2.file = fileList[0]
        reader2.addEventListener('load', (event) => {
            image2.src = event.target.result;
            console.log("image2 loaded");

            if (allLoaded < 2) {
                allLoaded += 1;
            };
        });
        reader2.readAsDataURL(fileList[0]);

    } else {
        allLoaded -= 1;
    };
});

firstImage.addEventListener('change', (event) => {

    if (!!event.target.files.length) {
        const fileList = event.target.files;
        image1.file = fileList[0]
        reader1.addEventListener('load', (event) => {
            image1.src = event.target.result;
            console.log("image1 loaded");
            if (allLoaded < 2) {
                allLoaded += 1;
            };
        });
        reader1.readAsDataURL(fileList[0]);
    } else {
        allLoaded -= 1;
    };

});

const definedXY = ({ index, width }) => {
    let x = Math.floor((index / 4) % width + 1);
    let y = Math.floor(((index / 4) / width));
    return { x, y };
};

const isPixelSimular = ({ r1, r2, g1, g2, b1, b2, a1, a2, accuracy }) => {

    return (r1 < r2 - accuracy || r1 > r2 + accuracy
        || g1 < g2 - accuracy || g1 > g2 + accuracy
        || b1 < b2 - accuracy || b1 > b2 + accuracy
        || a1 < a2 - accuracy || a1 > a2 + accuracy
    );

};

const comparation = () => {
    if (allLoaded === 2) {

        const { imageData: imageData1 } = getCanvasData(canvas1, image1);
        const { imageData: imageData2, context: context2 } = getCanvasData(canvas2, image2);


        for (let index = 0; index < (canvas1.width * canvas1.height * 4); index += 4) {

            if (isPixelSimular(
                {
                    r1: imageData1.data[index],
                    r2: imageData2.data[index],
                    g1: imageData1.data[index + 1],
                    g2: imageData2.data[index + 1],
                    b1: imageData1.data[index + 2],
                    b2: imageData2.data[index + 2],
                    a1: imageData2.data[index + 3],
                    a2: imageData2.data[index + 3],
                    accuracy: 255 - range.value,
                }
            )
            ) {

                let x = definedXY({ index, width: canvas1.width }).x;
                let y = definedXY({ index, width: canvas1.width }).y;

                drawPixel(context2, x, y, color.value);

            }


        }
        resolt.appendChild(canvas2);
        console.log(allLoaded);
    };
    console.log(allLoaded);

};

compare.addEventListener("click", comparation)
