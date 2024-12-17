document.addEventListener("DOMContentLoaded", function() {
    const generateBtn = document.getElementById('generateFaviconBtn');
    const faviconText = document.getElementById('faviconText');
    const textColor = document.getElementById('textColor');
    const bgColor = document.getElementById('bgColor');
    const fontSelect = document.getElementById('fontSelect');
    const boldText = document.getElementById('boldText');
    const italicText = document.getElementById('italicText');
    const customSizeSelect = document.getElementById('customSizeSelect');
    const customSizeInputSection = document.getElementById('customSizeInputSection');
    const customSizeInput = document.getElementById('customSize');
    const textShadow = document.getElementById('textShadow');
    const iconPreviews = document.getElementById('iconPreviews');
    const htmlCodeArea = document.getElementById('htmlCode');
    const downloadLinksContainer = document.getElementById('downloadLinksContainer');
    const downloadZipLink = document.getElementById('downloadZipLink');
    const iconShapeSelect = document.getElementById('iconShapeSelect');
    const backgroundMode = document.getElementById('backgroundMode');
    const sizeOptions = ['16x16', '32x32', '96x96', '180x180', '512x512', '300x300'];

    // Display custom size input when selected
    customSizeSelect.addEventListener('change', () => {
        if (customSizeSelect.value === 'custom') {
            customSizeInputSection.classList.remove('hidden');
        } else {
            customSizeInputSection.classList.add('hidden');
        }
    });

    // Enable button when all necessary inputs are filled
    function enableGenerateButton() {
        if (faviconText.value && (customSizeSelect.value !== 'custom' || customSizeInput.value)) {
            generateBtn.disabled = false;
        } else {
            generateBtn.disabled = true;
        }
    }

    // Update generated HTML code
    function updateHTMLCode(faviconData) {
        const htmlCode = `
<!-- Favicon Links -->
<link rel="icon" type="image/png" sizes="16x16" href="${faviconData['16x16']}">
<link rel="icon" type="image/png" sizes="32x32" href="${faviconData['32x32']}">
<link rel="icon" type="image/png" sizes="96x96" href="${faviconData['96x96']}">
<link rel="icon" type="image/png" sizes="180x180" href="${faviconData['180x180']}">
<link rel="icon" type="image/png" sizes="512x512" href="${faviconData['512x512']}">
`;
        htmlCodeArea.value = htmlCode;
    }

    // Generate favicon based on user input
    function generateFavicon() {
        const text = faviconText.value;
        const textColorValue = textColor.value;
        const bgColorValue = bgColor.value;
        const font = fontSelect.value;
        const isBold = boldText.checked;
        const isItalic = italicText.checked;
        const shadow = textShadow.checked;
        const iconShape = iconShapeSelect.value;
        const size = customSizeSelect.value === 'custom' ? customSizeInput.value : customSizeSelect.value;

        // Create canvas for rendering favicon
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const sizes = ['16x16', '32x32', '96x96', '180x180', '512x512', '300x300'];
        const faviconData = {};

        sizes.forEach(size => {
            const [width, height] = size.split('x').map(Number);
            canvas.width = width;
            canvas.height = height;

            // Set background color based on selected mode
            ctx.fillStyle = bgColorValue;
            ctx.fillRect(0, 0, width, height);

            // Set text style
            ctx.fillStyle = textColorValue;
            const baseFontSize = Math.min(width, height) * 0.6; // Dynamic font size based on image size
            ctx.font = `${isBold ? 'bold' : ''} ${isItalic ? 'italic' : ''} ${baseFontSize}px ${font}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Apply text shadow if enabled
            if (shadow) {
                ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                ctx.shadowBlur = 2;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
            }

            // Draw text in the center of the canvas
            ctx.fillText(text, width / 2, height / 2);

            // Convert canvas to image
            const dataURL = canvas.toDataURL('image/png');
            faviconData[size] = dataURL;
        });

        updateHTMLCode(faviconData);

        // Update preview area
        iconPreviews.innerHTML = '';
        sizes.forEach(size => {
            const img = document.createElement('img');
            img.src = faviconData[size];
            img.alt = `Preview ${size}`;
            img.width = 50;
            iconPreviews.appendChild(img);
        });

        // Enable download button and generate download link
        downloadLinksContainer.classList.remove('hidden');
        downloadZipLink.addEventListener('click', function() {
            const zip = new JSZip();
            sizes.forEach(size => {
                const imgData = faviconData[size];
                zip.file(`${size}.png`, imgData.split(',')[1], {base64: true});
            });

            // Generate ZIP and allow the user to download it
            zip.generateAsync({ type: "blob" }).then(function(content) {
                saveAs(content, "favicons.zip");
            });
        });
    }

    // Add event listeners to inputs
    [faviconText, textColor, bgColor, fontSelect, boldText, italicText, customSizeSelect, customSizeInput, textShadow, iconShapeSelect, backgroundMode].forEach(el => {
        el.addEventListener('input', enableGenerateButton);
    });

    // Initially disable button until inputs are valid
    enableGenerateButton();

    // Generate favicon when button is clicked
    generateBtn.addEventListener('click', generateFavicon);
});
