/* eslint-disable @typescript-eslint/no-unused-vars */
 
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import QRCode from 'react-qr-code';
import '@/styles/modal.css';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrValue: string;
}

export default function QRCodeModal({ isOpen, onClose, qrValue }: QRCodeModalProps) {
  // Function to download the QR code as an image
  const downloadQR = () => {
    const canvas = document.getElementById('student-qr-code') as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = url;
    link.click();
  };

  // Function to copy the link
  const copyLink = () => {
    navigator.clipboard.writeText(qrValue);
    alert("Link copied to clipboard!");
  };

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
          <div className="modal-backdrop student-qr-modal-backdrop" />
        </Transition.Child>
        <div className="modal-container student-qr-modal-container">
          <div className="modal-wrapper student-qr-modal-wrapper">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="student-qr-modal-panel">
                <button onClick={onClose} className="student-qr-close-icon" aria-label="Close">
                  <i className="ri-close-line"></i>
                </button>
                <div className="modal-title">QR Code</div>
                <div className="student-qr-modal-content" style={{ textAlign: "center" }}>
                  <QRCode
                    value={qrValue || ""}
                    size={200} // optional; will scale to parent container by default
                  />
                  {/* <div style={{ marginTop: 16, wordBreak: "break-all", fontSize: 13, color: "#444" }}>
                    {qrValue}
                  </div> */}
                </div>
                <div className="student-qr-modal-footer">
                  <button onClick={downloadQR} className="student-qr-btn">Download</button>
                  {/* <button onClick={copyLink} className="student-qr-btn">Copy Link</button> */}
                  {/* You can add a native share API button here if you want */}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
