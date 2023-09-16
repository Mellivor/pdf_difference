let firstPageNumber = 1;
let secondPageNumber = 1;
let mainWidth = null;
let mainHeight = null;


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
// radio.on("change", (e) => { console.log(e.target.value); })
// console.log(radio.filter(":checked").val())
const radioFirst = $(".control-form__radio-first-mode");
const radioSecond = $(".control-form__radio-second-mode");
const radioThird = $(".control-form__radio-third-mode");
const range = $(".control-form__accuracy-slider");
const firstPageInput = $(".page-control__first-page-input");
const secondPageInput = $(".page-control__second-page-input");
const lower1Arow = $(".page-control__lower-first-arrow-box");
const higher1Arow = $(".page-control__higher-first-arrow-box");
const lower2Arow = $(".page-control__lower-second-arrow-box");
const higher2Arow = $(".page-control__higher-second-arrow-box");

const canvas1 = document.createElement('canvas');
const canvas2 = document.createElement('canvas');
const resultCanvas = document.createElement('canvas');

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

const addLoader = (target) => {
    target.html('<div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>');
};

const settMainHeightWidth = ({ width, height, canvas }) => {
    if (!mainWidth) {
        mainWidth = width;
        mainHeight = height;
    };
    canvas.width = mainWidth;
    canvas.height = mainHeight;
};

const pdfHendler = async (canvas, pageNum, file) => {
    const pdf = await pdfjsLib.getDocument(file).promise;
    if (pdf._pdfInfo.numPages < pageNum) { pageNum = pdf._pdfInfo.numPages };
    if (pageNum < 1) { pageNum = pdf._pdfInfo.numPages };
    const pdfPage = await pdf.getPage(parseInt(pageNum, 10));
    const context = canvas.getContext('2d', { willReadFrequently: true }, { antialias: false, depth: false });
    const viewport = pdfPage.getViewport({ scale: 2 });
    settMainHeightWidth({ width: viewport.width, height: viewport.height, canvas: canvas })
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    // canvas.width = mainWidth;
    // canvas.height = mainHeight;
    // canvas.style.width = mainWidth; + "px";
    // canvas.style.height = mainHeight + "px";

    // viewport.width = mainWidth
    // viewport.height = mainHeight
    const renderContext = {
        canvasContext: context,
        transform: false,
        viewport: viewport
    };
    await pdfPage.render(renderContext).promise;
};

const isFileValid = (file) => {
    const acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    return file && acceptedTypes.includes(file['type'])
}

const radioValue = () => {
    return radio.filter(":checked").val();
}

const drawPixel = (context, x, y, color) => {
    context.fillStyle = color || '#000';
    context.fillRect(x, y, 1, 1);
}

const getCanvasData = (canvas) => {
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    return { imageData, context };
};

const readFile = (file, target, canvas, pageNum) => {

    addLoader(target);

    if (!file) {
        target.html('');
        target.append(cardDefault[0].cloneNode(true));
        compare.removeClass("compare-button_active")
        return;
    };

    if (!isFileValid(file)) {
        console.log('File is not an image.', file.type, file);
        return;
    };

    const reader = new FileReader();

    reader.onloadend = async (event) => {
        const image = new Image()
        image.classList.add("preview-box__img")

        if (file.type.startsWith('application/pdf')) {
            await pdfHendler(canvas, pageNum, event.target.result);
            image.src = canvas.toDataURL();
            canvas.width = mainWidth;
            canvas.height = mainHeight;
            image.onload = () => {
                canvas.getContext('2d').drawImage(image, 0, 0, mainWidth, mainHeight);
            };
        } else {
            image.src = event.target.result;
            image.onload = () => {
                settMainHeightWidth({ width: image.naturalWidth, height: image.naturalHeight, canvas: canvas })
                getCanvasData(canvas).context.drawImage(image, 0, 0, mainWidth, mainHeight);
            };
        };

        target.html('');
        target.append(image);
    };

    reader.readAsDataURL(file);

    if (!(secondFileInput[0].files[0] && firstFileInput[0].files[0])) {
        compare.removeClass("compare-button_active")
    }

    if (secondFileInput[0].files[0] && firstFileInput[0].files[0]) { compare.addClass("compare-button_active") };
};

firstFileInput.on('change', (event) => { readFile(event.target.files[0], firstDiv, canvas1, firstPageNumber) });
secondFileInput.on('change', (event) => { readFile(event.target.files[0], secondDiv, canvas2, secondPageNumber) });

const reRender = (file) => {
    readFile(file, secondDiv, canvas2, secondPageNumber)
};

firstPageInput.on('change', () => {
    firstPageNumber = firstPageInput.val();
    if (firstFileInput[0].files[0]) {
        readFile(firstFileInput[0].files[0], firstDiv, canvas1, firstPageNumber);
    };
});

secondPageInput.on('change', () => {
    secondPageNumber = secondPageInput.val();
    if (secondFileInput[0].files[0]) {
        readFile(secondFileInput[0].files[0], secondDiv, canvas2, secondPageNumber);
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
    event.originalEvent.stopPropagation();
    event.originalEvent.preventDefault();
    event.originalEvent.dataTransfer.dropEffect = 'copy';
    if (!event.currentTarget.classList.contains('drag-target')) {
        $(event.currentTarget).addClass('drag-target')
    }
};

const dropHendler = (event, targetDiv, canvas, pageNum, inputFile) => {
    event.originalEvent.stopPropagation();
    event.originalEvent.preventDefault();

    const fileList = event.originalEvent.dataTransfer.files;

    const dT = new DataTransfer();
    dT.items.add(fileList[0]);
    inputFile.files = dT.files;

    console.log(inputFile.files[0]);
    readFile(inputFile.files[0], targetDiv, canvas, pageNum);
};

firstDiv.on('dragover', dragHendler);
firstDiv.on('click', () => { firstFileInput.click() });
firstDiv.on('dragleave', (event) => { event.currentTarget.classList.remove('drag-target') });
firstDiv.on('drop', (event) => { dropHendler(event, firstDiv, canvas1, firstPageNumber, firstFileInput[0]) });

secondDiv.on('dragover', dragHendler);
secondDiv.on('click', () => { secondFileInput.click() });
secondDiv.on('dragleave', (event) => { event.currentTarget.classList.remove('drag-target') });
secondDiv.on('drop', (event) => { dropHendler(event, secondDiv, canvas2, secondPageNumber, secondFileInput[0]) });

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

const comparison = () => {

    resolt.html('');

    if (secondFileInput[0].files[0] && firstFileInput[0].files[0]) {

        // console.log(window.scrollY < 400);
        // console.log(window.scrollY);
        // console.log(window.pageYOffset);
        // if (window.scrollY < 400) {

        //     $([document.documentElement, document.body]).animate({
        //         scrollTop: $(resolt).offset().top
        //     }, 2000);
        //     resolt.get(0).scrollIntoView({ behavior: 'smooth' });
        //     addLoader(resolt);

        // };

        // console.log(window.scrollY);

        const { imageData: imageData1 } = getCanvasData(canvas1);
        const { imageData: imageData2 } = getCanvasData(canvas2);

        if (radioValue() == 2) {
            resolt.html('');
            resolt.append(canvas1);
            $(canvas2).addClass("result-box__negative");
            canvas2.style.opacity = `${opacity[0].value / 100}`;
            resolt.append(canvas2);
            opacity.on('change', () => { canvas2.style.opacity = `${opacity[0].value / 100}` });
            return;
        }

        resultCanvas.width = mainWidth;
        resultCanvas.height = mainHeight;
        const { context: resultContext } = getCanvasData(resultCanvas);

        if (radioValue() == 1) {
            resultContext.fillStyle = "#ffff";
            resultContext.fillRect(0, 0, mainWidth, mainHeight);
        } else {
            resultContext.drawImage(canvas1, 0, 0, mainWidth, mainHeight);
        };


        for (let index = 0; index < (mainWidth * mainHeight * 4); index += 4) {

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
                    accuracy: 255 - range[0].value,
                }
            )

            ) {

                let x = definedXY({ index, width: mainWidth }).x;
                let y = definedXY({ index, width: mainWidth }).y;
                drawPixel(resultContext, x, y, color[0].value);

            };

        }
        resolt.html(resultCanvas);
        // }, 10);
        // addLoader(resolt);

    };

};

compare.on("click", comparison)
