import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ✅ ES 모듈용 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, "src");
const exts = [".js", ".jsx", ".ts", ".tsx"];

// ✅ 모든 상대경로 import 대상으로 (./ 또는 ../로 시작하는 경우)
const importRegex = /(import\s+[^'"]+\s+from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g;

function convertPath(content, filePath) {
  return content.replace(importRegex, (match, prefix, importPath, suffix) => {
    const absPath = path.resolve(path.dirname(filePath), importPath);
    const relativeToSrc = path.relative(srcDir, absPath).replace(/\\/g, "/");

    // src 바깥이면 그대로 둠
    if (relativeToSrc.startsWith("..")) return match;

    return `${prefix}@/${relativeToSrc}${suffix}`;
  });
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (exts.includes(path.extname(fullPath))) {
      let content = fs.readFileSync(fullPath, "utf8");
      const updated = convertPath(content, fullPath);
      if (content !== updated) {
        fs.writeFileSync(fullPath, updated, "utf8");
        console.log(`✅ Updated: ${fullPath}`);
      }
    }
  }
}

walk(srcDir);
