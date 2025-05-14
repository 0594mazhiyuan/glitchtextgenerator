document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const textContainer = outputText.querySelector('.text-container');
    const copyBtn = document.getElementById('copyBtn');
    const saveImageBtn = document.getElementById('saveImageBtn');
    const glitchType = document.getElementById('glitchType');
    const intensitySlider = document.getElementById('intensitySlider');
    const sliderValue = document.querySelector('.slider-value');

    // Default placeholder text
    const placeholderText = 'Your glitch text will appear here...';

    // Zalgo text characters
    const zalgoChars = {
        up: [
            '̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈', 
            '̊', '͂', '̓', '̈́', '͊', '͋', '͌', '̃', '̂', '̌', '͐', '̀', '́', 
            '̋', '̏', '̒', '̓', '̔', '̽', '̉', 'ͣ', 'ͤ', 'ͥ', 'ͦ', 'ͧ', 'ͨ', 
            'ͩ', 'ͪ', 'ͫ', 'ͬ', 'ͭ', 'ͮ', 'ͯ', '̾', '͛', '͆', '̚'
        ],
        down: [
            '̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', 
            '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰', '̱', '̲', '̳', '̹', 
            '̺', '̻', '̼', 'ͅ', '͇', '͈', '͉', '͍', '͎', '͓', '͔', '͕', 
            '͖', '͙', '͚', '̣'
        ],
        mid: [
            '̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', 
            '͜', '͝', '͞', '͟', '͠', '͢', '̸', '̷', '͡', '҉'
        ]
    };

    // Generate Zalgo text with improved intensity control
    function zalgoify(text) {
        if (!text) return '';
        const intensity = parseFloat(intensitySlider.value);
        
        return text.split('').map(char => {
            if (char === ' ') return char; // Preserve spaces
            
            let newChar = char;
            
            // Calculate number of marks based on intensity
            const intensityFactor = Math.pow(intensity, 1.5) / 5;
            const maxMarks = Math.floor(intensityFactor * 10);
            
            // Distribute marks with weighted randomness
            const upMarks = Math.floor(Math.random() * maxMarks * (intensity < 10 ? 0.8 : 1.2));
            const midMarks = Math.floor(Math.random() * maxMarks * (intensity < 10 ? 0.3 : 0.5));
            const downMarks = Math.floor(Math.random() * maxMarks * (intensity < 10 ? 0.8 : 1.2));
            
            // Add marks
            for(let i = 0; i < upMarks; i++) {
                newChar += zalgoChars.up[Math.floor(Math.random() * zalgoChars.up.length)];
            }
            for(let i = 0; i < midMarks; i++) {
                newChar += zalgoChars.mid[Math.floor(Math.random() * zalgoChars.mid.length)];
            }
            for(let i = 0; i < downMarks; i++) {
                newChar += zalgoChars.down[Math.floor(Math.random() * zalgoChars.down.length)];
            }
            
            return newChar;
        }).join('');
    }

    // Matrix style text with improved intensity control
    function matrixify(text) {
        if (!text) return '';
        const matrixChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%^&*';
        const intensity = parseFloat(intensitySlider.value);
        const replacementChance = Math.pow(intensity / 20, 1.2);
        
        return text.split('').map(char => {
            // Only replace ASCII alphanumeric and some symbols
            if (/[a-zA-Z0-9@#$%^&*]/.test(char) && Math.random() < replacementChance) {
                return matrixChars[Math.floor(Math.random() * matrixChars.length)];
            }
            return char;
        }).join('');
    }

    // Shuffle text with improved intensity control
    function shuffleText(text) {
        if (!text) return '';
        const intensity = parseFloat(intensitySlider.value);
        const shuffleChance = Math.pow(intensity / 20, 1.3);
        const maxOffset = Math.ceil(intensity * 1.5);
        
        return text.split('').map(char => {
            // Only shuffle Latin letters
            if (/[a-zA-Z]/.test(char) && Math.random() < shuffleChance && char !== ' ') {
                const charCode = char.charCodeAt(0);
                let offset = Math.floor(Math.random() * maxOffset * 2) - maxOffset;
                let newCharCode = charCode + offset;

                // Keep shuffled characters within Latin alphabet ranges if possible
                if (char >= 'a' && char <= 'z') {
                    if (newCharCode < 'a'.charCodeAt(0)) newCharCode = 'a'.charCodeAt(0) + (('a'.charCodeAt(0) - newCharCode -1) % 26);
                    if (newCharCode > 'z'.charCodeAt(0)) newCharCode = 'z'.charCodeAt(0) - ((newCharCode - 'z'.charCodeAt(0) -1) % 26);
                } else if (char >= 'A' && char <= 'Z') {
                    if (newCharCode < 'A'.charCodeAt(0)) newCharCode = 'A'.charCodeAt(0) + (('A'.charCodeAt(0) - newCharCode -1) % 26);
                    if (newCharCode > 'Z'.charCodeAt(0)) newCharCode = 'Z'.charCodeAt(0) - ((newCharCode - 'Z'.charCodeAt(0) -1) % 26);
                }
                // If offset is too large and goes out of typical printable ASCII, consider not changing or a different strategy.
                // For now, this might still produce non-Latin chars if original offset is large.
                // A stricter approach would be to cap newCharCode to ensure it stays within Latin a-z/A-Z.
                // The modulo logic above attempts to wrap around within the respective case range.

                return String.fromCharCode(newCharCode);
            }
            return char;
        }).join('');
    }

    // Mirror text with improved intensity control
    function mirrorText(text) {
        if (!text) return '';
        const intensity = parseFloat(intensitySlider.value);
        let result = text;
        
        const mirrors = Math.floor(Math.pow(intensity / 5, 1.2));
        for (let i = 0; i < mirrors; i++) {
            if (i % 2 === 0) {
                result = result + text.split('').reverse().join('');
            } else {
                result = text.split('').reverse().join('') + result;
            }
        }
        
        return result;
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Generate glitch text based on selected type
    function generateGlitchText() {
        const text = inputText.value || placeholderText;
        let result;

        switch(glitchType.value) {
            case 'zalgo':
                result = zalgoify(text);
                break;
            case 'matrix':
                result = matrixify(text);
                break;
            case 'shuffle':
                result = shuffleText(text);
                break;
            case 'mirror':
                result = mirrorText(text);
                break;
            default:
                result = text;
        }

        textContainer.textContent = result;
        console.log("Generated result:", result);
    }

    // Copy to clipboard functionality
    async function copyToClipboard() {
        try {
            const textToCopy = textContainer.textContent;
            await navigator.clipboard.writeText(textToCopy);
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.classList.add('success');
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('success');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
            copyBtn.innerHTML = '<i class="fas fa-times"></i> Failed to copy';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Text';
            }, 2000);
        }
    }

    // Function to save text as image
    async function saveAsImage() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const currentIntensity = parseFloat(intensitySlider.value);

            let padding = 40;
            let fontSize = 24;

            // Tiered multiplier for content scaling
            let canvasContentWidthMultiplier = 1.0;
            if (currentIntensity > 15) { // Intensity 15.5 - 20
                canvasContentWidthMultiplier = 1.0 + (currentIntensity - 15) * 0.4; // Scales content width part from 1.0x up to 3.0x (at intensity 20)
                padding = 60;
            } else if (currentIntensity > 10) { // Intensity 10.5 - 15
                canvasContentWidthMultiplier = 1.0 + (currentIntensity - 10) * 0.2; // Scales content width part from 1.0x up to 2.0x (at intensity 15)
                padding = 50;
            } else if (currentIntensity > 5) { // Intensity 5.5 - 10
                canvasContentWidthMultiplier = 1.0 + (currentIntensity - 5) * 0.1; // Scales content width part from 1.0x up to 1.5x (at intensity 10)
            }

            // Tiered minimum absolute canvas width
            let minAbsCanvasWidth = 300;
            if (currentIntensity > 15) { // Intensity 15.5 - 20
                minAbsCanvasWidth = 400 + (currentIntensity - 15) * 40; // Min canvas width from 400px (at 15) up to 600px (at 20)
            } else if (currentIntensity > 10) { // Intensity 10.5 - 15
                minAbsCanvasWidth = 300 + (currentIntensity - 10) * 20; // Min canvas width from 300px (at 10) up to 400px (at 15)
            } else if (currentIntensity > 5) { // Intensity 5.5 - 10
                 minAbsCanvasWidth = 300 + (currentIntensity - 5) * 10; // Min canvas width from 300px (at 5) up to 350px (at 10)
            }

            ctx.font = `${fontSize}px 'Microsoft YaHei', 'SimSun', 'PingFang SC', 'Noto Sans CJK SC', Arial, sans-serif`;
            
            const textToRender = textContainer.textContent || placeholderText;
            const lines = textToRender.split('\\n');
            const lineHeight = fontSize * 1.2;

            const textContentMeasuredWidth = Math.max(1, ...lines.map(line => ctx.measureText(line).width)); // Ensure at least 1px to prevent 0*multiplier
            
            const scaledContentWidth = textContentMeasuredWidth * canvasContentWidthMultiplier;
            const canvasWidthFromContent = scaledContentWidth + (padding * 2);
            
            // Final canvas width is the greater of content-derived width or intensity-derived min width
            const finalCanvasWidth = Math.max(canvasWidthFromContent, minAbsCanvasWidth);
            const finalCanvasHeight = (lineHeight * lines.length) + (padding * 2);

            canvas.width = finalCanvasWidth;
            canvas.height = finalCanvasHeight;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#1e293b';
            ctx.font = `${fontSize}px 'Microsoft YaHei', 'SimSun', 'PingFang SC', 'Noto Sans CJK SC', Arial, sans-serif`;
            ctx.textAlign = 'center';

            const totalTextHeight = lineHeight * lines.length;
            let startY = padding + (lineHeight - fontSize) / 2; // Base for first line from top padding
            if (lines.length > 0) { // Adjust to center the whole text block vertically
                startY = (canvas.height - totalTextHeight) / 2 + (lineHeight - fontSize) / 2; 
            }
            // Ensure text is drawn line by line, accommodating the canvas height
            lines.forEach((line, index) => {
                 // We want to draw baseline of text, calculate from top of where line should be
                 const lineTopY = (canvas.height - totalTextHeight) / 2 + (index * lineHeight);
                 const baselineY = lineTopY + fontSize * 0.75; // Approximate baseline position from top of line box (0.75 is empirical for Arial)
                 ctx.fillText(line, canvas.width / 2, baselineY );
            });

            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'glitch-text.png';
            link.href = dataUrl;
            link.click();

            const originalText = saveImageBtn.innerHTML;
            saveImageBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
            setTimeout(() => {
                saveImageBtn.innerHTML = originalText;
            }, 2000);

        } catch (err) {
            console.error('Failed to save image:', err);
            saveImageBtn.innerHTML = '<i class="fas fa-times"></i> Failed';
            setTimeout(() => {
                saveImageBtn.innerHTML = '<i class="fas fa-image"></i> Save as Image';
            }, 2000);
        }
    }

    // Event listeners
    const debouncedGenerate = debounce(generateGlitchText, 150);
    
    // Update display and generate text when slider changes
    intensitySlider.addEventListener('input', () => {
        sliderValue.textContent = parseFloat(intensitySlider.value).toFixed(1);
        generateGlitchText();
    });

    // Generate text when input changes
    inputText.addEventListener('input', debouncedGenerate);
    
    // Generate text when effect type changes
    glitchType.addEventListener('change', generateGlitchText);
    
    // Handle button clicks
    copyBtn.addEventListener('click', copyToClipboard);
    saveImageBtn.addEventListener('click', saveAsImage);

    // Initialize
    sliderValue.textContent = intensitySlider.value;
    generateGlitchText();
}); 