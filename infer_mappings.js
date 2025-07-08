const fs = require('fs');
const path = require('path');

// 标准字符集
const standardChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// 读取fontStyles文件夹中的所有JSON文件
const fontStylesDir = './fontStyles';
const files = fs.readdirSync(fontStylesDir).filter(file => file.endsWith('.json'));

files.forEach(file => {
  const filePath = path.join(fontStylesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  console.log(`\n处理文件: ${file}`);
  
  data.forEach((font, index) => {
    if (font.textExample) {
      console.log(`\n字体 ${index + 1}: ${font.name}`);
      console.log(`textExample: ${font.textExample}`);
      
      // 创建映射对象
      const map = {};
      
      // 对比每个字符
      for (let i = 0; i < Math.min(standardChars.length, font.textExample.length); i++) {
        const standardChar = standardChars[i];
        const exampleChar = font.textExample[i];
        
        if (standardChar !== exampleChar) {
          map[standardChar] = exampleChar;
        }
      }
      
      // 显示映射结果
      console.log('推断的映射:');
      Object.entries(map).forEach(([key, value]) => {
        console.log(`  ${key} -> ${value}`);
      });
      
      // 将映射添加到字体对象中
      font.map = map;
      
      console.log(`映射数量: ${Object.keys(map).length}`);
    }
  });
  
  // 保存更新后的文件
  const outputPath = path.join(fontStylesDir, file.replace('.json', '_with_inferred_maps.json'));
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`\n已保存到: ${outputPath}`);
});

console.log('\n所有文件处理完成！'); 