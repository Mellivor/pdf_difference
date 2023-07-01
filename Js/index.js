const image1 = document.querySelector(".first > img");
const image2 = document.querySelector(".second > img");
const resolt = document.querySelector(".resolt");
const firstImage = document.querySelector("#first-image");
const secondImage = document.querySelector("#second-image");
const compare = document.querySelector(".compare")
const color = document.querySelector("#color")


const canvas1 = document.createElement('canvas');
const canvas2 = document.createElement('canvas');
const canvasRes = document.createElement('canvas');
const reader1 = new FileReader();
const reader2 = new FileReader();



secondImage.addEventListener('change', (event) => {
    const fileList = event.target.files;
    image2.file = fileList[0]
    // console.log(fileList);
    reader1.addEventListener('load', (event) => {
        image2.src = event.target.result;
    });
    reader1.readAsDataURL(fileList[0]);
});

firstImage.addEventListener('change', (event) => {
    const fileList = event.target.files;
    image1.file = fileList[0]
    // console.log(fileList);
    reader2.addEventListener('load', (event) => {
        image1.src = event.target.result;
    });
    reader2.readAsDataURL(fileList[0]);

});

function drawPixel(context, x, y, color) {
    let roundedX = Math.round(x);
    let roundedY = Math.round(y);
    context.fillStyle = color || '#000';
    context.fillRect(roundedX, roundedY, 1, 1);
}

const isPixelSimular = ({ r1, r2, g1, g2, b1, b2, a1, a2, accuracy }) => {

    return (r1 < r2 - accuracy || r1 > r2 + accuracy
        || g1 < g2 - accuracy || g1 > g2 + accuracy
        || b1 < b2 - accuracy || b1 > b2 + accuracy
        || a1 < a2 - accuracy || a1 > a2 + accuracy
    );

};

const comparation = () => {
    // image2.addEventListener("load", () => {
    canvas1.width = image1.width;
    canvas1.height = image1.height;

    canvas2.width = image1.width;
    canvas2.height = image1.height;

    canvasRes.width = image1.width;
    canvasRes.height = image1.height;

    const context1 = canvas1.getContext('2d');
    context1.drawImage(image1, 0, 0);
    const context2 = canvas2.getContext('2d');
    context2.drawImage(image2, 0, 0);
    const contextRez = canvasRes.getContext('2d');


    const imageData1 = context1.getImageData(0, 0, canvas1.width, canvas1.height);
    const imageData2 = context2.getImageData(0, 0, canvas2.width, canvas2.height);
    const RezData2 = contextRez.getImageData(0, 0, canvasRes.width, canvasRes.height);

    resolt.appendChild(canvasRes);


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
                accuracy: 15,
            }
        )
        ) {
            let x = Math.floor((index / 4) % canvas1.width + 1);
            let y = Math.floor(((index / 4) / canvas1.width));
            drawPixel(contextRez, x, y, color.value);
            // console.log(`   X = ${x}
            //     Y =${y}
            //     index=${index}
            //     (index / 4) % canvas1.width +1 = ${(index / 4) % canvas1.width + 1}
            //     (index / 4) / canvas1.width) = ${(index / 4) / canvas1.width}`);

        }


    }

    // });
};

compare.addEventListener("click", comparation)
