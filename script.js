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
    function zalgoify(text, customIntensity = null) {
        if (!text) return '';
        const intensity = customIntensity || parseFloat(intensitySlider.value);
        
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
    function matrixify(text, customIntensity = null) {
        if (!text) return '';
        const matrixChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%^&*';
        const intensity = customIntensity || parseFloat(intensitySlider.value);
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
    function shuffleText(text, customIntensity = null) {
        if (!text) return '';
        const intensity = customIntensity || parseFloat(intensitySlider.value);
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

    // Glitch logo effect - Typography-focused with subtle glitch elements
    function glitchLogo(text) {
        if (!text) return '';
        const intensity = parseFloat(intensitySlider.value);
        
        // Start with clean typography
        let result = text.toUpperCase(); // Professional logo style
        
        // Apply typography-focused effects
        if (intensity > 3) {
            // Add subtle character variations for typography effect
            result = result.split('').map((char, index) => {
                if (char === ' ') return char;
                
                // Create typography variations based on position
                const variation = Math.sin(index * 0.5) * (intensity / 10);
                const shouldVary = Math.random() < (intensity / 20);
                
                if (shouldVary && /[A-Z]/.test(char)) {
                    // Subtle character shifts for typography effect
                    const charCode = char.charCodeAt(0);
                    const shift = Math.floor(variation * 2);
                    const newCharCode = charCode + shift;
                    
                    // Keep within reasonable bounds
                    if (newCharCode >= 65 && newCharCode <= 90) {
                        return String.fromCharCode(newCharCode);
                    }
                }
                
                return char;
            }).join('');
        }
        
        // Add minimal zalgo effect for typography enhancement
        if (intensity > 5) {
            const zalgoIntensity = Math.min(intensity / 8, 2); // Very subtle
            result = zalgoify(result, zalgoIntensity);
        }
        
        // Add typography-specific spacing adjustments
        if (intensity > 7) {
            result = result.split('').map((char, index) => {
                if (char === ' ') return char;
                
                // Add subtle spacing variations
                const spacingVariation = Math.random() < (intensity / 30);
                if (spacingVariation) {
                    return char + ' '; // Add small space
                }
                return char;
            }).join('');
        }
        
        // Add typography kerning effects
        if (intensity > 10) {
            result = result.split('').map((char, index) => {
                if (char === ' ') return char;
                
                // Create kerning-like effects
                const kerningEffect = Math.random() < (intensity / 40);
                if (kerningEffect) {
                    return char + '\u200B'; // Zero-width space for kerning
                }
                return char;
            }).join('');
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
            case 'logo':
                result = glitchLogo(text);
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
            
            // Set canvas size
            canvas.width = 800;
            canvas.height = 200;
            
            // Set background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Set text style
            ctx.fillStyle = '#000000';
            ctx.font = '48px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Get text and wrap it
            const text = textContainer.textContent;
            const maxWidth = canvas.width - 40;
            const words = text.split(' ');
            const lines = [];
            let currentLine = words[0];
            
            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = ctx.measureText(currentLine + ' ' + word).width;
                if (width < maxWidth) {
                    currentLine += ' ' + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            
            // Draw text
            const lineHeight = 60;
            const startY = (canvas.height - (lines.length * lineHeight)) / 2;
            
            lines.forEach((line, index) => {
                ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
            });
            
            // Convert to blob and download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'glitch-text.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
            
        } catch (err) {
            console.error('Failed to save image:', err);
            alert('Failed to save image. Please try again.');
        }
    }

    // Event listeners
    inputText.addEventListener('input', debounce(generateGlitchText, 100));
    glitchType.addEventListener('change', generateGlitchText);
    intensitySlider.addEventListener('input', function() {
        sliderValue.textContent = this.value;
        generateGlitchText();
    });
    copyBtn.addEventListener('click', copyToClipboard);
    saveImageBtn.addEventListener('click', saveAsImage);

    // Smooth scrolling for footer links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize with default text
    generateGlitchText();
}); 