const fs = require('fs');
const path = require('path');

// 标准字母表和数字
const STANDARD_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// 从原始HTML中提取字符映射的函数
function extractCharMappings() {
    const htmlContent = fs.readFileSync('example-font-generator.html', 'utf8');
    const mappings = [];
    
    // 使用正则表达式匹配FontList_item__LcCIm中的字体数据
    const fontPattern = /<li class="FontList_item__LcCIm">(.*?)<\/li>/gs;
    const matches = htmlContent.match(fontPattern);
    
    if (!matches) {
        console.log('没有找到字体数据');
        return mappings;
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
        
        // 创建字符映射
        const charMap = {};
        for (let i = 0; i < STANDARD_CHARS.length; i++) {
            const standardChar = STANDARD_CHARS[i];
            const fancyChar = fontText[i] || standardChar; // 如果花式字符不够，使用原字符
            charMap[standardChar] = fancyChar;
        }
        
        // 创建字体对象
        const font = {
            title: fontName,
            slug: fontSlug,
            textExample: STANDARD_CHARS,
            tags: tags.length > 0 ? tags : ['Aa'],
            mappings: charMap
        };
        
        mappings.push(font);
    });
    
    return mappings;
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
        const fileName = `fontStyles/fonts_with_mappings_${index + 1}.json`;
        fs.writeFileSync(fileName, JSON.stringify(chunk, null, 2), 'utf8');
        console.log(`保存 ${fileName}: ${chunk.length} 个字体`);
    });
}

// 为现有JSON文件添加映射的函数
function addMappingsToExistingFiles() {
    const fontStylesDir = 'fontStyles';
    if (!fs.existsSync(fontStylesDir)) {
        console.log('fontStyles文件夹不存在');
        return;
    }
    
    const files = fs.readdirSync(fontStylesDir)
        .filter(file => file.endsWith('.json'))
        .sort();
    
    console.log(`找到 ${files.length} 个JSON文件`);
    
    files.forEach(file => {
        const filePath = path.join(fontStylesDir, file);
        const fonts = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        console.log(`处理文件: ${file}`);
        
        fonts.forEach((font, index) => {
            // 为每个字体添加映射
            const charMap = {};
            for (let i = 0; i < STANDARD_CHARS.length; i++) {
                const standardChar = STANDARD_CHARS[i];
                // 这里可以根据字体的textExample来生成映射
                // 暂时使用简单的映射逻辑
                charMap[standardChar] = standardChar; // 默认映射到原字符
            }
            
            font.mappings = charMap;
        });
        
        // 保存更新后的文件
        const newFileName = file.replace('.json', '_with_mappings.json');
        const newFilePath = path.join(fontStylesDir, newFileName);
        fs.writeFileSync(newFilePath, JSON.stringify(fonts, null, 2), 'utf8');
        console.log(`保存 ${newFileName}: ${fonts.length} 个字体`);
    });
}

// 主函数
function main() {
    console.log('开始处理字体映射...');
    
    // 方法1: 从HTML提取并创建新的映射文件
    console.log('\n方法1: 从HTML提取字体映射...');
    const fonts = extractCharMappings();
    console.log(`总共提取到 ${fonts.length} 个字体`);
    
    if (fonts.length > 0) {
        const chunks = splitFontsIntoChunks(fonts, 10);
        console.log(`拆分成 ${chunks.length} 个文件`);
        saveFontChunks(chunks);
        
        // 显示前几个字体的映射示例
        console.log('\n前3个字体的映射示例:');
        fonts.slice(0, 3).forEach((font, index) => {
            console.log(`${index + 1}. ${font.title}:`);
            console.log(`   a -> ${font.mappings['a']}`);
            console.log(`   A -> ${font.mappings['A']}`);
            console.log(`   0 -> ${font.mappings['0']}`);
        });
    }
    
    // 方法2: 为现有JSON文件添加映射
    console.log('\n方法2: 为现有JSON文件添加映射...');
    addMappingsToExistingFiles();
    
    console.log('\n处理完成！');
}

// 运行脚本
main(); 