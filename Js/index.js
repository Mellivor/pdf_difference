let firstPageNumber = 1;
let secondPageNumber = 1;
const opacity = document.querySelector("#opacity")
const targets = document.querySelectorAll(".target");
const firstDiv = document.querySelector(".first");
const secondDiv = document.querySelector(".second");
const resolt = document.querySelector(".result");
const firstFileInput = document.querySelector("#first-file");
const secondFileInput = document.querySelector("#second-file");
const compare = document.querySelector(".compare");
const color = document.querySelector("#color");
const radio = document.querySelectorAll("input[name='chack-type']");
const range = document.querySelector("#range");
const canvas1 = document.createElement('canvas');
const canvas2 = document.createElement('canvas');
const canvasRes = document.createElement('canvas');
const firstPageInput = document.querySelector("#page_doc_1");
const secondPageInput = document.querySelector("#page_doc_2");
const lower1Arow = document.querySelector(".lower1");
const lower2Arow = document.querySelector(".lower2");
const higher1Arow = document.querySelector(".higher1");
const higher2Arow = document.querySelector(".higher2");

let allLoaded = 0;

const addLoader = (target) => {
    target.innerHTML = '';
};

const pdfHendler = async (canvas, pageNum, file) => {
    const pdf = await pdfjsLib.getDocument(file).promise;
    console.log(pageNum);
    // const pdfPage = await pdf.getPage(pageNum);
    const pdfPage = await pdf.getPage(parseInt(pageNum, 10));
    const context = canvas.getContext('2d');
    const viewport = pdfPage.getViewport({ scale: 2 });
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    canvas.style.width = Math.floor(viewport.width) + "px";
    canvas.style.height = Math.floor(viewport.height) + "px";

    const renderContext = {
        canvasContext: context,
        transform: false,
        viewport: viewport
    };
    await pdfPage.render(renderContext).promise;
};

const isFileValid = (file) => {
    const acceptedTypes = ['image/gif', 'image/jpeg', 'image/png', 'application/pdf'];

    return file && acceptedTypes.includes(file['type'])
}

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

const getCanvasData = (canvas) => {
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    return { imageData, context };
};

const readFile = (file, target, canvas, pageNum) => {

    addLoader(target);

    if (!file) {
        allLoaded -= 1;
        target.innerHTML = '<i class="fa-sharp fa-solid fa-file-pdf"></i>';
        return;
    };


    // if (file.type && !file.type.startsWith('image/', 'pdf/')) {
    if (!isFileValid(file)) {
        console.log('File is not an image.', file.type, file);
        allLoaded -= 1;
        return;
    }


    // if (file.type.startsWith('application/pdf')) {

    //     pdfHendler(canvas2.getContext('2d'), 1, file);
    //     allLoaded -= 1;
    //     return;
    // }

    const reader = new FileReader();
    console.log(pageNum);
    reader.onloadend = async (event) => {
        const image = new Image()
        if (file.type.startsWith('application/pdf')) {
            console.log(pageNum);
            // const somthing = await pdfHendler(canvas, pageNumber, event.target.result);
            await pdfHendler(canvas, pageNum, event.target.result);
            // setTimeout(() => {
            //     image.src = canvas.toDataURL();
            //     console.log(canvas.toDataURL())

            // }, 600);
            image.src = canvas.toDataURL();

            // console.log(dataUrl)
            // target.appendChild(canvas);
            // target.appendChild(canvas1);
        } else {
            image.src = event.target.result;
        };

        target.innerHTML = '';
        target.appendChild(image);
        // image.src = canvas.toDataURL();
        // resolt.appendChild(image);
        // target.appendChild(canvas);
    };

    reader.readAsDataURL(file);

    if (allLoaded < 2) {
        allLoaded += 1;
    };
};

firstFileInput.addEventListener('change', (event) => { readFile(event.target.files[0], firstDiv, canvas1, firstPageNumber) });
secondFileInput.addEventListener('change', (event) => { readFile(event.target.files[0], secondDiv, canvas2, secondPageNumber) });
firstPageInput.addEventListener('change', () => {
    firstPageNumber = firstPageInput.value;
});
secondPageInput.addEventListener('change', () => {
    secondPageNumber = secondPageInput.value;
});

lower1Arow.addEventListener("click", () => { firstPageInput.stepDown() });
lower2Arow.addEventListener("click", () => { secondPageInput.stepDown() });
higher1Arow.addEventListener("click", () => { firstPageInput.stepUp() });
higher2Arow.addEventListener("click", () => { secondPageInput.stepUp() });


const dragHendler = (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    event.target.classList.add('drag-target')
};

const dropHendler = (event, targetDiv, canvas, pageNum) => {
    event.stopPropagation();
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    readFile(fileList[0], targetDiv, canvas, pageNum);
};

firstDiv.addEventListener('dragover', dragHendler);
firstDiv.addEventListener('click', () => { firstFileInput.click() });
firstDiv.addEventListener('dragleave', (event) => { event.target.classList.remove('drag-target') });
firstDiv.addEventListener('drop', (event) => { dropHendler(event, firstDiv, canvas1, firstPageNumber) });
// firstDiv.addEventListener('drop', (event) => {
//     const fileList = event.dataTransfer.files[0];
//     debugger;
//     firstFileInput.files[0] = fileList
//     console.log(fileList);
//     console.log(firstFileInput.files);
//     console.log(firstFileInput.files[0]);
// });
secondDiv.addEventListener('dragover', dragHendler);
secondDiv.addEventListener('click', () => { secondFileInput.click() });
secondDiv.addEventListener('dragleave', (event) => { event.target.classList.remove('drag-target') });
secondDiv.addEventListener('drop', (event) => { dropHendler(event, secondDiv, canvas2, secondPageNumber) });

// targets.forEach((e) => {
//     e.addEventListener('dragover', (event) => {
//         event.stopPropagation();
//         event.preventDefault();
//         event.dataTransfer.dropEffect = 'copy';
//         console.log(event.target);
//         event.target.classList.add('drag-target')
//     });

//     e.addEventListener('dragleave', (event) => { event.target.classList.remove('drag-target') });

//     e.addEventListener('drop', (event) => {
//         event.stopPropagation();
//         event.preventDefault();
//         const fileList = event.dataTransfer.files;
//         console.log(e);
//         readFile(fileList[0], e, canvas1);
//     });
// })


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
    console.log(allLoaded);
    if (allLoaded === 2) {

        const { imageData: imageData1 } = getCanvasData(canvas1);
        const { imageData: imageData2, context: context2 } = getCanvasData(canvas2);

        if (radioValue() == 2) {
            resolt.innerHTML = "";
            resolt.appendChild(canvas1);
            canvas2.classList.add("negative")
            console.log(opacity.value);
            canvas2.style.opacity = `${opacity.value / 100}`;
            resolt.appendChild(canvas2);
            opacity.addEventListener('change', () => { canvas2.style.opacity = `${opacity.value / 100}` })
            return
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
