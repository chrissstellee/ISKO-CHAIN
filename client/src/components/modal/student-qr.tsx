import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';
import QRCode from 'react-qr-code';
import '@/styles/modal.css';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrValue: string;
}

export default function QRCodeModal({ isOpen, onClose, qrValue }: QRCodeModalProps) {
  // Ref for the container div wrapping QRCode
  const qrWrapperRef = useRef<HTMLDivElement>(null);

  // Download SVG QR code as PNG
  const downloadQR = () => {
    // Find the SVG inside the wrapper
    const svg = qrWrapperRef.current?.querySelector('svg');
    if (!svg) return;

    // Serialize SVG and draw on a canvas
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    const svg64 = btoa(unescape(encodeURIComponent(svgString)));
    const image64 = "data:image/svg+xml;base64," + svg64;

    img.onload = function () {
      ctx?.clearRect(0, 0, size, size);
      ctx?.drawImage(img, 0, 0, size, size);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "qr-code.png";
      link.click();
    };
    img.src = image64;
  };

  // Copy sharing link
  // const copyLink = () => {
  //   navigator.clipboard.writeText(qrValue);
  //   alert("Link copied to clipboard!");
  // };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="modal-root student-qr-modal-root" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 z-40" />
        </Transition.Child>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center relative student-qr-modal-panel">
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 rounded-full p-1 hover:bg-gray-200 transition"
            >
              <span className="text-2xl leading-none text-gray-500">&times;</span>
            </button>
            <div className="text-lg font-bold mb-4 text-red-700">QR Code</div>
            <div className="mb-2 flex flex-col items-center">
              <div ref={qrWrapperRef} className="bg-white rounded-lg p-3 shadow" style={{ border: "1px solid #e5e7eb" }}>
                <QRCode
                  value={qrValue || ""}
                  size={200}
                  bgColor="#fff"
                  fgColor="#1a1a1a"
                  level="H"
                  style={{
                    display: "block",
                    width: 200,
                    height: 200,
                  }}
                />
              </div>
              {/* <div className="text-xs text-gray-500 mt-3 break-all select-all max-w-xs px-2">
                {qrValue}
              </div> */}
            </div>
            <div className="mt-6 w-full flex gap-3">
              <button
                onClick={downloadQR}
                className="flex-1 bg-red-700 hover:bg-red-800 text-white font-semibold py-2 rounded-lg shadow transition"
                style={{ letterSpacing: 1 }}
              >
                Download PNG
              </button>
              {/* <button
                onClick={copyLink}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg shadow transition"
              >
                Copy Link
              </button> */}
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
