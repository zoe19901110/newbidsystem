const fs = require('fs');
const code = fs.readFileSync('src/components/Workbench.tsx', 'utf8');
const lines = code.split('\n');

const stack = [];
for (let i = 4700; i <= 5700; i++) {
  const text = lines[i];
  if (!text) continue;
  // very basic tokenizer for JSX tags
  const tags = [...text.matchAll(/<(div|section|\/div|\/section)[^>]*>/g)];
  for (const match of tags) {
    let tag = match[1];
    if (tag.startsWith('/')) {
      const isDiv = tag === '/div';
      if (stack.length === 0) {
        console.log(`Extra closing ${tag} at line ${i+1}`);
      } else {
        const top = stack.pop();
        if ((isDiv && top.tag !== 'div') || (!isDiv && top.tag !== 'section')) {
          console.log(`Mismatch at line ${i+1}: expected /${top.tag} but got ${tag} (opened at ${top.num})`);
        }
      }
    } else {
      stack.push({tag, num: i+1});
    }
  }
}
if(stack.length > 0) console.log('Unclosed tags:', stack);
