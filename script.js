document.addEventListener('DOMContentLoaded', () => {
    const generateFaviconBtn = document.getElementById('generateFaviconBtn');
    const saveToLocalBtn = document.getElementById('saveToLocalBtn');
    const faviconTextInput = document.getElementById('faviconText');
    const customSizeSelect = document.getElementById('customSizeSelect');
    const customSizeInputSection = document.getElementById('customSizeInputSection');
    const customSizeInput = document.getElementById('customSize');
    const iconShapeSelect = document.getElementById('iconShapeSelect');
    const textColorInput = document.getElementById('textColor');
    const bgColorInput = document.getElementById('bgColor');
    const fontSelect = document.getElementById('fontSelect');
    const boldTextCheckbox = document.getElementById('boldText');
    const italicTextCheckbox = document.getElementById('italicText');
    const textShadowCheckbox = document.getElementById('textShadow');
    const backgroundModeSelect = document.getElementById('backgroundMode');
    const iconPreviewsContainer = document.getElementById('iconPreviews');
    const downloadLinksContainer = document.getElementById('downloadLinksContainer');
    const downloadZipLink = document.getElementById('downloadZipLink');
    const htmlCodeTextarea = document.getElementById('htmlCode');

    // Enable/Disable buttons based on input
    function updateButtonsState() {
        const isTextValid = faviconTextInput.value.trim() !== '';
        const isSizeValid = customSizeSelect.value !== 'custom' || customSizeInput.value.trim() !== '';
        generateFaviconBtn.disabled = !isTextValid || !isSizeValid;
        saveToLocalBtn.disabled = !isTextValid || !isSizeValid;
    }

    // Show/hide custom size input
    customSizeSelect.addEventListener('change', () => {
        if (customSizeSelect.value === 'custom') {
            customSizeInputSection.classList.remove('hidden');
        } else {
            customSizeInputSection.classList.add('hidden');
        }
        updateButtonsState();
    });

    // Update buttons state when input changes
    faviconTextInput.addEventListener('input', updateButtonsState);
    customSizeInput.addEventListener('input', updateButtonsState);

    // Function to draw a favicon on canvas
    function generateFaviconCanvas(text, bgColor, textColor, font, bold, italic, size, shape, textShadow) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const [width, height] = size.split('x').map(Number);

        // Set canvas size based on selected size
        canvas.width = width;
        canvas.height = height;

        // Background color
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Shape: Circle or Square
        if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
            ctx.clip(); // Apply circular clip path
        }

        // Text styling
        ctx.fillStyle = textColor;
        ctx.font = `${bold ? 'bold' : ''} ${italic ? 'italic' : ''} 48px ${font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Optional text shadow
        if (textShadow) {
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
        }

        // Draw the text
        ctx.fillText(text, width / 2, height / 2);

        return canvas;
    }

    // Function to generate all the favicons
    function generateFavicons() {
        const text = faviconTextInput.value.trim();
        const bgColor = bgColorInput.value;
        const textColor = textColorInput.value;
        const font = fontSelect.value;
        const bold = boldTextCheckbox.checked;
        const italic = italicTextCheckbox.checked;
        const textShadow = textShadowCheckbox.checked;
        const shape = iconShapeSelect.value;
        const selectedSize = customSizeSelect.value === 'custom' ? customSizeInput.value : customSizeSelect.value;

        const sizes = selectedSize.split(',');
        const generatedFiles = [];

        // Generate the favicon(s)
        sizes.forEach((sizeStr) => {
            const size = sizeStr.trim();
            const canvas = generateFaviconCanvas(text, bgColor, textColor, font, bold, italic, size, shape, textShadow);
            const faviconDataUrl = canvas.toDataURL('image/png');

            // Display preview
            const img = document.createElement('img');
            img.src = faviconDataUrl;
            img.alt = `Preview of ${size}`;
            img.width = 50;
            img.height = 50;
            iconPreviewsContainer.appendChild(img);

            // Add file for download
            generatedFiles.push({ size, dataUrl: faviconDataUrl });
        });

        // Enable download of the favicons as a ZIP file
        downloadZipLink.addEventListener('click', () => {
            const zip = new JSZip();
            generatedFiles.forEach((file) => {
                const [width, height] = file.size.split('x');
                zip.file(`favicon-${width}x${height}.png`, file.dataUrl.split(',')[1], { base64: true });
            });
            zip.generateAsync({ type: 'blob' }).then((blob) => {
                saveAs(blob, 'favicons.zip');
            });
        });

        // Show HTML code to link the favicon
        const htmlCode = `
        <link rel="icon" href="data:image/png;base64,${generatedFiles[0].dataUrl.split(',')[1]}" sizes="16x16" type="image/png">
        <link rel="icon" href="data:image/png;base64,${generatedFiles[0].dataUrl.split(',')[1]}" sizes="32x32" type="image/png">
        <link rel="icon" href="data:image/png;base64,${generatedFiles[0].dataUrl.split(',')[1]}" sizes="96x96" type="image/png">
        <link rel="icon" href="data:image/png;base64,${generatedFiles[0].dataUrl.split(',')[1]}" sizes="180x180" type="image/png">
        <link rel="icon" href="data:image/png;base64,${generatedFiles[0].dataUrl.split(',')[1]}" sizes="512x512" type="image/png">`;

        htmlCodeTextarea.value = htmlCode;
        downloadLinksContainer.classList.remove('hidden');
    }

    // Add event listener to generate favicon button
    generateFaviconBtn.addEventListener('click', () => {
        iconPreviewsContainer.innerHTML = ''; // Clear previous previews
        downloadLinksContainer.classList.add('hidden');
        generateFavicons();
    });

    // Initial setup
    updateButtonsState();
});
