const opacity = document.querySelector("#opacity")
const targets = document.querySelectorAll(".target");
const firstDiv = document.querySelector(".first");
const secondDiv = document.querySelector(".second");
const resolt = document.querySelector(".resolt");
const firstImageInput = document.querySelector("#first-image");
const secondImageInput = document.querySelector("#second-image");
const compare = document.querySelector(".compare");
const color = document.querySelector("#color");
const radio = document.querySelectorAll("input[name='chack-type']");
const range = document.querySelector("#range");

const canvas1 = document.createElement('canvas');
const canvas2 = document.createElement('canvas');
const canvasRes = document.createElement('canvas');


let allLoaded = 0;

const radioValue = () => {
    let value;
    radio.forEach(i => {
        if (i.checked) {
            value = i.value;
        }
    })
    return value;
}

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

const readImage = (file, target) => {

    if (file.type && !file.type.startsWith('image/')) {
        console.log('File is not an image.', file.type, file);
        allLoaded -= 1;
        return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', (event) => {
        const image = new Image()
        image.src = event.target.result;
        target.appendChild(image);
        console.log(111);
    });

    reader.readAsDataURL(file);

    if (allLoaded < 2) {
        allLoaded += 1;
    };
};

firstImageInput.addEventListener('change', (event) => { readImage(event.target.files[0], firstDiv) });
secondImageInput.addEventListener('change', (event) => { readImage(event.target.files[0], secondDiv) });

targets.forEach((e) => {
    e.addEventListener('dragover', (event) => {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        console.log(event.target);
        event.target.classList.add('drag-target')
    });

    e.addEventListener('dragleave', (event) => { event.target.classList.remove('drag-target') });

    e.addEventListener('drop', (event) => {
        event.stopPropagation();
        event.preventDefault();
        const fileList = event.dataTransfer.files;
        console.log(fileList);
        readImage(fileList[0], e);
    });
})


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

        const imgae1 = new Image();
        imgae1.src = firstDiv.querySelector("img").src
        const imgae2 = new Image();
        imgae2.src = secondDiv.querySelector("img").src

        const { imageData: imageData1 } = getCanvasData(canvas1, imgae1);
        const { imageData: imageData2, context: context2 } = getCanvasData(canvas2, imgae2);

        if (radioValue() == 2) {
            resolt.innerHTML = "";
            resolt.appendChild(canvas1);
            canvas2.classList.add("negative")
            console.log(opacity.value);
            canvas2.style.opacity = `${opacity.value / 100}`
            resolt.appendChild(canvas2);
            opacity.addEventListener('change', () => { canvas2.style.opacity = `${opacity.value / 100}` })
            return
            // resolt.innerHTML = "";
            // resolt.appendChild(imgae1);
            // imgae2.classList.add("negative")
            // console.log(opacity.value);
            // imgae2.style.opacity = `${opacity.value / 100}`
            // resolt.appendChild(imgae2);
            // opacity.addEventListener('change', () => { imgae2.style.opacity = `${opacity.value / 100}` })
            // return
        }

        if (radioValue() == 1) {
            context2.fillStyle = "#ffff";
            context2.fillRect(0, 0, canvas1.width, canvas1.height);
        };


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

            };


        }
        resolt.innerHTML = "";
        resolt.appendChild(canvas2);

    };

};

compare.addEventListener("click", comparation)
