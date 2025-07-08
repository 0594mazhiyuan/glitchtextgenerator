const fs = require('fs');

// 读取HTML文件
const htmlContent = fs.readFileSync('example-font-generator.html', 'utf8');

// 标准化的字母表和数字
const STANDARD_TEXT = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// 提取字体数据的函数
function extractFonts() {
    const fonts = [];
    
    // 使用正则表达式匹配FontList_item__LcCIm中的字体数据
    const fontPattern = /<li class="FontList_item__LcCIm">(.*?)<\/li>/gs;
    const matches = htmlContent.match(fontPattern);
    
    if (!matches) {
        console.log('没有找到字体数据');
        return fonts;
    }
    
    matches.forEach((match, index) => {
        // 跳过广告banner
        if (match.includes('FontList_banner__sSjhf')) {
            return;
        }
        
        // 提取字体文本
        const textMatch = match.match(/<div class="FontCard_text__Ae2kj">(.*?)<\/div>/);
        if (!textMatch) return;
        
        const fontText = textMatch[1];
        
        // 提取标签
        const tagMatch = match.match(/<div class="[^"]*">([^<]*)<\/div>/g);
        let tags = [];
        if (tagMatch) {
            tagMatch.forEach(tagDiv => {
                const tagContent = tagDiv.match(/<div class="[^"]*">([^<]*)<\/div>/);
                if (tagContent && tagContent[1]) {
                    const tag = tagContent[1].trim();
                    if (tag && !tags.includes(tag)) {
                        tags.push(tag);
                    }
                }
            });
        }
        
        // 生成字体名称和slug
        const fontName = `Font ${index + 1}`;
        const fontSlug = `font-${index + 1}`;
        
        // 创建字体对象，使用标准化的文本
        const font = {
            title: fontName,
            slug: fontSlug,
            textExample: STANDARD_TEXT,
            tags: tags.length > 0 ? tags : ['Aa']
        };
        
        fonts.push(font);
    });
    
    return fonts;
}

// 按每10个字体拆分
function splitFontsIntoChunks(fonts, chunkSize = 10) {
    const chunks = [];
    for (let i = 0; i < fonts.length; i += chunkSize) {
        chunks.push(fonts.slice(i, i + chunkSize));
    }
    return chunks;
}

// 保存字体数据到文件
function saveFontChunks(chunks) {
    // 确保fontStyles文件夹存在
    if (!fs.existsSync('fontStyles')) {
        fs.mkdirSync('fontStyles');
    }
    
    chunks.forEach((chunk, index) => {
        const fileName = `fontStyles/fonts_extracted_${index + 1}.json`;
        fs.writeFileSync(fileName, JSON.stringify(chunk, null, 2), 'utf8');
        console.log(`保存 ${fileName}: ${chunk.length} 个字体`);
    });
}

// 主函数
function main() {
    console.log('开始从HTML文件中提取字体数据...');
    
    // 提取字体
    const fonts = extractFonts();
    console.log(`总共提取到 ${fonts.length} 个字体`);
    
    if (fonts.length === 0) {
        console.log('没有找到字体数据，请检查HTML文件');
        return;
    }
    
    // 拆分字体
    const chunks = splitFontsIntoChunks(fonts, 10);
    console.log(`拆分成 ${chunks.length} 个文件`);
    
    // 保存文件
    saveFontChunks(chunks);
    
    console.log('提取完成！');
    
    // 显示统计信息
    chunks.forEach((chunk, index) => {
        console.log(`chunk_${index + 1}: ${chunk.length} 个字体`);
    });
    
    // 显示前几个字体的示例
    console.log('\n前3个字体示例:');
    fonts.slice(0, 3).forEach((font, index) => {
        console.log(`${index + 1}. ${font.title}: ${font.textExample}`);
    });
    
    console.log(`\n所有字体的textExample都标准化为: ${STANDARD_TEXT}`);
}

// 运行脚本
main(); 