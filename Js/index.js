let firstPageNumber = 1;
let secondPageNumber = 1;
const cardDefault = $(".preview-box__content");
const standartControls = $(".control-form__standart-mode-controls");
const negativeControls = $(".control-form__negative-mode-controls");
const opacity = $(".control-form__negative-opacity-slider");
const firstDiv = $(".preview-box__first-card");
const secondDiv = $(".preview-box__second-card");
const resolt = $(".result-box");
const firstFileInput = $(".control-form__first-file-input");
const secondFileInput = $(".control-form__second-file-input");
const compare = $(".compare-button");
const color = $(".control-form__color-input");
const radio = $(".control-form__radio-block-item>input");
radio.on("change", (e) => { console.log(e.target.value); })
// console.log($(radio[0]).is(":checked"))
console.log(radio.filter(":checked").val())
const radioFirst = $(".control-form__radio-first-mode");
const radioSecond = $(".control-form__radio-second-mode");
const radioThird = $(".control-form__radio-third-mode");
const range = $(".control-form__accuracy-slider");
const canvas1 = document.createElement('canvas');
const canvas2 = document.createElement('canvas');
const canvasRes = document.createElement('canvas');
const firstPageInput = $(".page-control__first-page-input");
const secondPageInput = $(".page-control__second-page-input");
const lower1Arow = $(".page-control__lower-first-arrow-box");
const higher1Arow = $(".page-control__higher-first-arrow-box");
const lower2Arow = $(".page-control__lower-second-arrow-box");
const higher2Arow = $(".page-control__higher-second-arrow-box");
// const cardDefault = document.querySelector(".preview-box__content")
// const standartControls = document.querySelector(".control-form__standart-mode-controls")
// const negativeControls = document.querySelector(".control-form__negative-mode-controls")
// const opacity = document.querySelector(".control-form__negative-opacity-slider")
// const firstDiv = document.querySelector(".preview-box__first-card");
// const secondDiv = document.querySelector(".preview-box__second-card");
// const resolt = document.querySelector(".result-box");
// const firstFileInput = document.querySelector(".control-form__first-file-input");
// const secondFileInput = document.querySelector(".control-form__second-file-input");
// const compare = document.querySelector(".compare-button");
// const color = document.querySelector(".control-form__color-input");
// const radio = document.querySelectorAll(".control-form__radio-block-item>input");
// const range = document.querySelector(".control-form__accuracy-slider");
// const canvas1 = document.createElement('canvas');
// const canvas2 = document.createElement('canvas');
// const canvasRes = document.createElement('canvas');
// const firstPageInput = document.querySelector(".page-control__first-page-input");
// const secondPageInput = document.querySelector(".page-control__second-page-input");
// const lower1Arow = document.querySelector(".page-control__lower-first-arrow-box");
// const higher1Arow = document.querySelector(".page-control__higher-first-arrow-box");
// const lower2Arow = document.querySelector(".page-control__lower-second-arrow-box");
// const higher2Arow = document.querySelector(".page-control__higher-second-arrow-box");

$(document).on('keypress', function (e) {
    if (e.key === 'Enter') {
        compare.click();
    }
});

radioThird.on("change", () => {
    standartControls.addClass("control-form__standart-mode-controls_shifted");
    negativeControls.toggleClass("control-form__negative-mode-controls_shifted");

});
radioSecond.on("change", () => {
    standartControls.removeClass("control-form__standart-mode-controls_shifted");
    negativeControls.addClass("control-form__negative-mode-controls_shifted");
});

radioFirst.on("change", () => {
    standartControls.removeClass("control-form__standart-mode-controls_shifted");
    negativeControls.addClass("control-form__negative-mode-controls_shifted");
});

let allLoaded = 0;

const addLoader = (target) => {
    target.innerHTML = '';
};

const pdfHendler = async (canvas, pageNum, file) => {
    const pdf = await pdfjsLib.getDocument(file).promise;
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
    // let value;
    // radio.forEach(i => {
    //     if (i.checked) {
    //         value = i.value;
    //     };
    // });
    return radio.filter(":checked").val();
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
        target.html('');
        target.append(cardDefault.cloneNode(true));
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
        image.classList.add("preview-box__img")
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

        target.html('');
        target.append(image);
        // image.src = canvas.toDataURL();
        // resolt.appendChild(image);
        // target.appendChild(canvas);
    };

    reader.readAsDataURL(file);

    if (allLoaded < 2) {
        allLoaded += 1;
    };
};

firstFileInput.on('change', (event) => { readFile(event.target.files[0], firstDiv, canvas1, firstPageNumber) });
secondFileInput.on('change', (event) => { readFile(event.target.files[0], secondDiv, canvas2, secondPageNumber) });

const reRender = (file) => {
    readFile(file, secondDiv, canvas2, secondPageNumber)
};

firstPageInput.on('change', () => {
    firstPageNumber = firstPageInput.value;
    if (firstFileInput.files[0]) {
        readFile(firstFileInput.files[0], firstDiv, canvas1, firstPageNumber);
    };
});

secondPageInput.on('change', () => {
    secondPageNumber = secondPageInput.value;
    if (secondFileInput.files[0]) {
        readFile(secondFileInput.files[0], secondDiv, canvas2, secondPageNumber);
    };
});

lower1Arow.on("click", () => {
    firstPageInput[0].stepDown()
    firstPageNumber = firstPageInput.val();
    if (firstFileInput[0].files[0]) {
        readFile(firstFileInput[0].files[0], firstDiv, canvas1, firstPageNumber);
    };
});

lower2Arow.on("click", () => {
    secondPageInput[0].stepDown()
    secondPageNumber = secondPageInput.val();
    if (secondFileInput[0].files[0]) {
        readFile(secondFileInput[0].files[0], secondDiv, canvas2, secondPageNumber);
    };
});

higher1Arow.on("click", () => {
    firstPageInput[0].stepUp()
    firstPageNumber = firstPageInput.val();
    if (firstFileInput[0].files[0]) {
        readFile(firstFileInput[0].files[0], firstDiv, canvas1, firstPageNumber);
    };
});

higher2Arow.on("click", () => {
    secondPageInput[0].stepUp()
    secondPageNumber = secondPageInput.val();
    if (secondFileInput[0].files[0]) {
        readFile(secondFileInput[0].files[0], secondDiv, canvas2, secondPageNumber);
    };
});


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

firstDiv.on('dragover', dragHendler);
firstDiv.on('click', () => { firstFileInput.click() });
firstDiv.on('dragleave', (event) => { event.target.classList.remove('drag-target') });
firstDiv.on('drop', (event) => { dropHendler(event, firstDiv, canvas1, firstPageNumber) });
// firstDiv.on('drop', (event) => {
//     const fileList = event.dataTransfer.files[0];
//     debugger;
//     firstFileInput.files[0] = fileList
//     console.log(fileList);
//     console.log(firstFileInput.files);
//     console.log(firstFileInput.files[0]);
// });
secondDiv.on('dragover', dragHendler);
secondDiv.on('click', () => { secondFileInput.click() });
secondDiv.on('dragleave', (event) => { event.target.classList.remove('drag-target') });
secondDiv.on('drop', (event) => { dropHendler(event, secondDiv, canvas2, secondPageNumber) });

// targets.forEach((e) => {
//     e.on('dragover', (event) => {
//         event.stopPropagation();
//         event.preventDefault();
//         event.dataTransfer.dropEffect = 'copy';
//         console.log(event.target);
//         event.target.classList.add('drag-target')
//     });

//     e.on('dragleave', (event) => { event.target.classList.remove('drag-target') });

//     e.on('drop', (event) => {
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
    resolt.innerHTML = "";

    canvas2.classList.remove("result-box__negative");
    canvas2.style.opacity = 1;

    console.log(allLoaded);
    if (allLoaded === 2) {

        const { imageData: imageData1 } = getCanvasData(canvas1);
        const { imageData: imageData2, context: context2 } = getCanvasData(canvas2);

        if (radioValue() == 2) {
            resolt.innerHTML = "";
            resolt.appendChild(canvas1);
            canvas2.classList.add("result-box__negative");
            console.log(opacity.value);
            canvas2.style.opacity = `${opacity.value / 100}`;
            resolt.appendChild(canvas2);
            opacity.on('change', () => { canvas2.style.opacity = `${opacity.value / 100}` });
            return;
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
        resolt.html("");
        resolt.append(canvas2);

    };

};

compare.on("click", comparation)
