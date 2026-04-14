import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';

/**
 * QR Code Generator component with download functionality
 * @param {string} value - QR code value
 * @param {number} size - QR code size
 * @param {boolean} bwMode - Black and white mode
 */
const QRGenerator = ({ value, size = 200, bwMode = false }) => {
  const handleDownload = () => {
    const svg = document.querySelector('.qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, size, size);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'smartqr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const qrColor = bwMode ? '#000000' : '#00ffaa';
  const bgColor = bwMode ? '#ffffff' : 'transparent';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`rounded-xl p-3 ${bwMode ? 'bg-white' : 'glass-card neon-border'}`}>
        <QRCodeSVG
          value={value}
          size={size}
          bgColor={bgColor}
          fgColor={qrColor}
          level="H"
          includeMargin={false}
          className="qr-code-svg"
        />
      </div>
      {!bwMode && (
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-[#00ffaa]/20 hover:bg-[#00ffaa]/30 text-[#00ffaa] rounded-lg transition-colors"
        >
          <Download size={18} />
          Download QR
        </button>
      )}
    </div>
  );
};

export default QRGenerator;