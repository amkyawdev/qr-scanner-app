import { QRCodeSVG } from 'qrcode.react';

/**
 * QR Code Generator component
 */
const QRGenerator = ({ value, size = 200 }) => {
  return (
    <div className="glass-card rounded-xl p-4 inline-block neon-border">
      <QRCodeSVG
        value={value}
        size={size}
        bgColor="transparent"
        fgColor="#00ffaa"
        level="H"
        includeMargin={false}
      />
    </div>
  );
};

export default QRGenerator;