import fs from 'fs';
import path from 'path';

const dir = 'src/components/chapters';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Strip GSAP imports
  content = content.replace(/import\s*{\s*gsap\s*}\s*from\s*'gsap';\n/g, '');
  content = content.replace(/import\s*{\s*ScrollTrigger\s*}\s*from\s*'gsap\/ScrollTrigger';\n/g, '');
  content = content.replace(/gsap\.registerPlugin\(ScrollTrigger\);\n\n?/g, '');

  // Regex to remove useEffect blocks involving gsap.context
  // We match from '  useEffect(() => {' to '  }, [sfxSection]);' or similar dependencies.
  // Since we know the exact structure, we can aggressively regex:
  content = content.replace(/  useEffect\(\(\) => \{\s*const ctx = gsap\.context\(\(\) => \{[\s\S]*?\}, sectionRef\);\s*return \(\) => ctx\.revert\(\);\s*\}, \[.*?\]\);\n/g, '');

  fs.writeFileSync(filePath, content);
  console.log('Processed', file);
}
