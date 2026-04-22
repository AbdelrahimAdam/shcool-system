// clean-icons.js
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'public', 'icons');

// List of files to keep (exact filenames)
const keepFiles = [
  '72.png',
  '96.png',
  '128.png',
  '144.png',
  '152.png',
  '192.png',
  '384.png',
  '512.png',
  'favicon.ico',          // if present in public root, but keep here for safety
  'apple-touch-icon.png'  // we'll create or keep one
];

// Also keep the apple-touch-icon if it exists (not in your list, but we'll check)
const appleTouchPath = path.join(iconsDir, 'apple-touch-icon.png');
if (!fs.existsSync(appleTouchPath)) {
  // Optionally copy 180.png or 192.png as apple-touch-icon
  const source = path.join(iconsDir, '180.png');
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, appleTouchPath);
    console.log('Created apple-touch-icon.png from 180.png');
  }
}

// Read all files in the icons directory
fs.readdir(iconsDir, (err, files) => {
  if (err) {
    console.error('Error reading icons directory:', err);
    return;
  }

  let deletedCount = 0;
  files.forEach(file => {
    if (keepFiles.includes(file)) {
      console.log(`Keeping: ${file}`);
    } else {
      const filePath = path.join(iconsDir, file);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Error deleting ${file}:`, unlinkErr);
        } else {
          deletedCount++;
          console.log(`Deleted: ${file}`);
        }
      });
    }
  });

  console.log(`Cleanup completed. Deleted ${deletedCount} files.`);
});