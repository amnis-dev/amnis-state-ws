/**
 * I don't know how reliable/consistent this is to use as a unique password yet.
 */
// function generateCanvasFingerprint(agentText: string) {
//   // Create a hidden canvas element
//   const canvas = document.createElement('canvas');
//   canvas.style.display = 'none';
//   document.body.appendChild(canvas);

//   // Get the 2D rendering context for the canvas
//   const ctx = canvas.getContext('2d');

//   if (!ctx) {
//     return base64Encode(new Uint8Array([1]));
//   }

//   // Draw information on the canvas.
//   ctx.textBaseline = 'top';
//   ctx.font = '14px \'Arial\'';
//   ctx.textBaseline = 'alphabetic';
//   ctx.fillStyle = '#f60';
//   ctx.fillRect(125, 1, 62, 20);
//   ctx.fillStyle = '#069';
//   ctx.fillText(agentText, 2, 15);
//   ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
//   ctx.fillText(agentText, 4, 17);

//   // Extract the image data from the canvas and create the fingerprint.
//   const imageData = ctx.getImageData(0, 0, 250, 25);
//   const fingerprint = base64Encode(new Uint8Array(imageData.data.buffer));

//   // Return the canvas fingerprint
//   return fingerprint;
// }
