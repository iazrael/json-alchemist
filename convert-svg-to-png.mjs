import sharp from 'sharp';
import fs from 'fs';
import toIco from 'to-ico';

// Create PNG favicons from SVG with different sizes
const sizes = [16, 32, 48, 64, 128, 256];

async function convertSvgToPng() {
  try {
    // Ensure public directory exists
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public');
    }

    const pngBuffers = [];

    // Convert to different sizes
    for (const size of sizes) {
      const buffer = await sharp('public/favicon.svg')
        .resize(size, size)
        .toBuffer();
      
      // Save the PNG file
      fs.writeFileSync(`public/favicon-${size}x${size}.png`, buffer);
      console.log(`Created favicon-${size}x${size}.png`);
      
      // Store buffer for ICO creation
      pngBuffers.push(buffer);
    }

    // Create Apple touch icon (180x180)
    const appleIconBuffer = await sharp('public/favicon.svg')
      .resize(180, 180)
      .toBuffer();
    fs.writeFileSync('public/favicon-180x180.png', appleIconBuffer);
    console.log('Created favicon-180x180.png');

    // Create favicon.ico from multiple sizes
    const icoBuffer = await toIco(pngBuffers);
    fs.writeFileSync('public/favicon.ico', icoBuffer);
    
    console.log('All favicons created successfully!');
  } catch (error) {
    console.error('Error creating favicons:', error);
  }
}

convertSvgToPng();