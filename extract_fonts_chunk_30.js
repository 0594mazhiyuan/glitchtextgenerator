const fs = require('fs');
const path = require('path');

// 读取HTML文件
const htmlContent = fs.readFileSync('example-font-generator.html', 'utf8');

// 使用正则表达式匹配FontList_item__LcCIm中的字体数据
const fontPattern = /<li class="FontList_item__LcCIm">(.*?)<\/li>/gs;

const fonts = [];
let match;

// 提取所有字体数据
while ((match = fontPattern.exec(htmlContent)) !== null) {
    const fontHtml = match[1];
    
    // 跳过广告横幅
    if (fontHtml.includes('FontList_banner__sSjhf')) {
        continue;
    }
    
    // 提取字体文本
    const textMatch = fontHtml.match(/<div class="FontCard_text__Ae2kj">(.*?)<\/div>/);
    if (textMatch) {
        const textExample = textMatch[1];
        
        // 提取字体名称（从FontCard_title__velYw字段）
        const nameMatch = fontHtml.match(/<h3 class="FontCard_title__velYw">(.*?)<\/h3>/);
        const fontName = nameMatch ? nameMatch[1] : `Font ${fonts.length + 1}`;
        
        // 创建字体对象
        const font = {
            title: fontName,
            textExample: textExample,
            // 创建简单的字符映射（这里可以根据需要扩展）
            map: {}
        };
        
        // 为每个字符创建映射（简化版本）
        const standardChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const fontChars = textExample.split('');
        
        for (let i = 0; i < Math.min(standardChars.length, fontChars.length); i++) {
            font.map[standardChars[i]] = fontChars[i];
        }
        
        fonts.push(font);
    }
}

console.log(`总共提取到 ${fonts.length} 个字体`);

// 确保fontStyles文件夹存在
const fontStylesDir = 'fontStyles';
if (!fs.existsSync(fontStylesDir)) {
    fs.mkdirSync(fontStylesDir);
}

// 每30个字体保存为一个文件
const chunkSize = 30;
const totalChunks = Math.ceil(fonts.length / chunkSize);

for (let i = 0; i < totalChunks; i++) {
    const startIndex = i * chunkSize;
    const endIndex = Math.min(startIndex + chunkSize, fonts.length);
    const chunk = fonts.slice(startIndex, endIndex);
    
    const fileName = `fonts_chunk_${i + 1}.json`;
    const filePath = path.join(fontStylesDir, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(chunk, null, 2), 'utf8');
    console.log(`保存文件: ${fileName} (包含 ${chunk.length} 个字体)`);
}

console.log(`\n完成！总共创建了 ${totalChunks} 个文件，保存在 ${fontStylesDir} 文件夹中。`); 