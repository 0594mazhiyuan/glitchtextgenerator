document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const logoText = document.getElementById('logoText');
    const logoIntensity = document.getElementById('logoIntensity');
    const intensityValue = document.getElementById('intensityValue');
    const logoDisplay = document.getElementById('logoDisplay');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');
    const styleBtns = document.querySelectorAll('.style-btn');
    
    // Color elements
    const logoColor = document.getElementById('logoColor');
    const logoBackground = document.getElementById('logoBackground');
    const colorPresets = document.querySelectorAll('.color-preset');
    const bgPresets = document.querySelectorAll('.bg-preset');
    
    // Example elements
    const example1 = document.getElementById('example1');
    const example2 = document.getElementById('example2');
    const example3 = document.getElementById('example3');
    const example4 = document.getElementById('example4');

    // Zalgo characters for subtle effects
    const zalgoChars = {
        up: ['̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓'],
        down: ['̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬'],
        mid: ['̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '͜', '͝', '͞', '͟']
    };

    // Typography styles
    const typographyStyles = {
        modern: {
            fontFamily: 'Arial, sans-serif',
            fontWeight: '700',
            letterSpacing: '0.05em'
        },
        bold: {
            fontFamily: 'Impact, Arial Black, sans-serif',
            fontWeight: '900',
            letterSpacing: '0.02em'
        },
        elegant: {
            fontFamily: 'Georgia, serif',
            fontWeight: '600',
            letterSpacing: '0.1em'
        },
        tech: {
            fontFamily: 'Courier New, monospace',
            fontWeight: '700',
            letterSpacing: '0.08em'
        }
    };

    let currentStyle = 'elegant';
    let currentColor = '#1f2937';
    let currentBackground = '#ffffff';

    // Enhanced glitch logo function
    function generateGlitchLogo(text, intensity, style = 'modern') {
        if (!text) return '';
        
        // Start with clean typography
        let result = text.toUpperCase();
        
        // Apply typography style
        const styleConfig = typographyStyles[style];
        
        // If intensity is 0, return clean text
        if (intensity === 0) {
            return result;
        }
        
        // Character variations based on position
        if (intensity > 3) {
            result = result.split('').map((char, index) => {
                if (char === ' ') return char;
                
                // Create typography variations
                const variation = Math.sin(index * 0.5) * (intensity / 15);
                const shouldVary = Math.random() < (intensity / 25);
                
                if (shouldVary && /[A-Z]/.test(char)) {
                    const charCode = char.charCodeAt(0);
                    const shift = Math.floor(variation * 1.5);
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
            const zalgoIntensity = Math.min(intensity / 10, 1.5);
            result = addZalgoEffect(result, zalgoIntensity);
        }
        
        // Add typography-specific spacing adjustments
        if (intensity > 7) {
            result = result.split('').map((char, index) => {
                if (char === ' ') return char;
                
                const spacingVariation = Math.random() < (intensity / 35);
                if (spacingVariation) {
                    return char + '\u2009'; // Thin space
                }
                return char;
            }).join('');
        }
        
        // Add typography kerning effects
        if (intensity > 10) {
            result = result.split('').map((char, index) => {
                if (char === ' ') return char;
                
                const kerningEffect = Math.random() < (intensity / 50);
                if (kerningEffect) {
                    return char + '\u200B'; // Zero-width space
                }
                return char;
            }).join('');
        }
        
        // Add subtle character distortions
        if (intensity > 12) {
            result = result.split('').map((char, index) => {
                if (char === ' ') return char;
                
                const distortionChance = Math.random() < (intensity / 60);
                if (distortionChance && /[A-Z]/.test(char)) {
                    // Subtle character replacement for glitch effect
                    const replacements = {
                        'A': 'А', 'B': 'В', 'C': 'С', 'E': 'Е', 'H': 'Н',
                        'I': 'І', 'K': 'К', 'M': 'М', 'O': 'О', 'P': 'Р',
                        'T': 'Т', 'X': 'Х', 'Y': 'У'
                    };
                    return replacements[char] || char;
                }
                return char;
            }).join('');
        }
        
        return result;
    }

    // Add subtle zalgo effect
    function addZalgoEffect(text, intensity) {
        return text.split('').map(char => {
            if (char === ' ') return char;
            
            let newChar = char;
            const maxMarks = Math.floor(intensity * 3);
            
            // Add minimal marks
            const upMarks = Math.floor(Math.random() * maxMarks * 0.3);
            const midMarks = Math.floor(Math.random() * maxMarks * 0.2);
            const downMarks = Math.floor(Math.random() * maxMarks * 0.3);
            
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

    // Update logo display
    function updateLogo() {
        const text = logoText.value || 'GLITCH LOGO';
        const intensity = parseFloat(logoIntensity.value);
        const result = generateGlitchLogo(text, intensity, currentStyle);
        
        logoDisplay.textContent = result;
        
        // Apply typography style
        const styleConfig = typographyStyles[currentStyle];
        logoDisplay.style.fontFamily = styleConfig.fontFamily;
        logoDisplay.style.fontWeight = styleConfig.fontWeight;
        logoDisplay.style.letterSpacing = styleConfig.letterSpacing;
        
        // Apply colors
        logoDisplay.style.color = currentColor;
        logoDisplay.parentElement.style.backgroundColor = currentBackground;
    }

    // Update intensity display
    function updateIntensityDisplay() {
        const value = parseFloat(logoIntensity.value);
        intensityValue.textContent = value;
        
        // Update intensity label color based on value
        if (value === 0) {
            intensityValue.style.color = '#6b7280'; // Gray for none
        } else if (value <= 5) {
            intensityValue.style.color = '#10b981'; // Green for subtle
        } else if (value <= 12) {
            intensityValue.style.color = '#f59e0b'; // Orange for professional
        } else {
            intensityValue.style.color = '#ef4444'; // Red for creative
        }
    }
    
    // Update color preset states
    function updateColorPresets() {
        colorPresets.forEach(preset => {
            preset.classList.remove('active');
            if (preset.dataset.color === currentColor) {
                preset.classList.add('active');
            }
        });
    }
    
    // Update background preset states
    function updateBgPresets() {
        bgPresets.forEach(preset => {
            preset.classList.remove('active');
            if (preset.dataset.color === currentBackground) {
                preset.classList.add('active');
            }
        });
    }

    // Generate example logos
    function generateExamples() {
        const examples = [
            { text: 'BRAND', intensity: 3, style: 'elegant', color: '#1f2937', bg: '#ffffff' },
            { text: 'TECH', intensity: 5, style: 'tech', color: '#3b82f6', bg: '#f8fafc' },
            { text: 'GAMING', intensity: 8, style: 'bold', color: '#ef4444', bg: '#000000' },
            { text: 'CREATIVE', intensity: 4, style: 'elegant', color: '#8b5cf6', bg: '#fef3c7' }
        ];
        
        const exampleElements = [example1, example2, example3, example4];
        
        exampleElements.forEach((element, index) => {
            const example = examples[index];
            const result = generateGlitchLogo(example.text, example.intensity, example.style);
            element.textContent = result;
            
            // Apply style
            const styleConfig = typographyStyles[example.style];
            element.style.fontFamily = styleConfig.fontFamily;
            element.style.fontWeight = styleConfig.fontWeight;
            element.style.letterSpacing = styleConfig.letterSpacing;
            
            // Apply colors
            element.style.color = example.color;
            element.parentElement.style.backgroundColor = example.bg;
        });
    }

    // Copy to clipboard
    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(logoDisplay.textContent);
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.classList.add('success');
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('success');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
            copyBtn.innerHTML = '<i class="fas fa-times"></i> Failed';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Text';
            }, 2000);
        }
    }

    // Download logo as image
    async function downloadLogo() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size with better proportions
            canvas.width = 1200;
            canvas.height = 600;
            
            // Set background
            ctx.fillStyle = currentBackground;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Set text style
            const styleConfig = typographyStyles[currentStyle];
            ctx.fillStyle = currentColor;
            ctx.font = `bold 96px ${styleConfig.fontFamily}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Add letter spacing if needed
            if (styleConfig.letterSpacing) {
                ctx.letterSpacing = styleConfig.letterSpacing;
            }
            
            // Get text and handle single line or multiple lines
            const text = logoDisplay.textContent;
            const maxWidth = canvas.width - 120;
            
            // Check if text needs wrapping
            const textWidth = ctx.measureText(text).width;
            
            if (textWidth <= maxWidth) {
                // Single line - center it
                ctx.fillText(text, canvas.width / 2, canvas.height / 2);
            } else {
                // Multiple lines - wrap and center
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
                
                // Draw text with proper centering
                const lineHeight = 120;
                const totalHeight = lines.length * lineHeight;
                const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2;
                
                lines.forEach((line, index) => {
                    ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
                });
            }
            
            // Convert to blob and download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'glitch-logo.png';
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

    // Reset to defaults
    function resetLogo() {
        logoText.value = 'GLITCH LOGO';
        logoIntensity.value = 0;
        currentStyle = 'elegant';
        currentColor = '#1f2937';
        currentBackground = '#ffffff';
        
        // Update style buttons
        styleBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-style="elegant"]').classList.add('active');
        
        // Update color inputs
        logoColor.value = currentColor;
        logoBackground.value = currentBackground;
        
        // Update color presets
        colorPresets.forEach(preset => preset.classList.remove('active'));
        bgPresets.forEach(preset => preset.classList.remove('active'));
        document.querySelector('[data-color="#1f2937"]').classList.add('active');
        document.querySelector('.bg-preset[data-color="#ffffff"]').classList.add('active');
        
        updateIntensityDisplay();
        updateLogo();
    }

    // Event listeners
    logoText.addEventListener('input', updateLogo);
    logoIntensity.addEventListener('input', () => {
        updateIntensityDisplay();
        updateLogo();
    });
    
    // Color event listeners
    logoColor.addEventListener('input', (e) => {
        currentColor = e.target.value;
        updateLogo();
        updateColorPresets();
    });
    
    logoBackground.addEventListener('input', (e) => {
        currentBackground = e.target.value;
        updateLogo();
        updateBgPresets();
    });
    
    // Color preset listeners
    colorPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            currentColor = preset.dataset.color;
            logoColor.value = currentColor;
            updateLogo();
            updateColorPresets();
        });
    });
    
    bgPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            currentBackground = preset.dataset.color;
            logoBackground.value = currentBackground;
            updateLogo();
            updateBgPresets();
        });
    });
    
    generateBtn.addEventListener('click', updateLogo);
    copyBtn.addEventListener('click', copyToClipboard);
    downloadBtn.addEventListener('click', downloadLogo);
    resetBtn.addEventListener('click', resetLogo);
    
    // Style button listeners
    styleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            styleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentStyle = btn.dataset.style;
            updateLogo();
        });
    });

    // Initialize
    updateIntensityDisplay();
    updateLogo();
    generateExamples();
    updateColorPresets();
    updateBgPresets();
    
    // Add some CSS for style buttons
    const style = document.createElement('style');
    style.textContent = `
        .style-btn {
            padding: 0.75rem 1.5rem;
            border: 2px solid #e5e7eb;
            background: white;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            color: #374151;
        }
        
        .style-btn:hover {
            border-color: #667eea;
            background: #f8fafc;
        }
        
        .style-btn.active {
            border-color: #667eea;
            background: #667eea;
            color: white;
        }
    `;
    document.head.appendChild(style);
}); 