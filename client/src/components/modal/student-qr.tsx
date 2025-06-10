/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import '@/styles/modal.css';

// Props definition for the QRCode modal
interface QRCodeModalProps {
  isOpen: boolean;          // Controls visibility of the modal
  onClose: () => void;      // Function to close the modal
  qrValue: string;          // The value to be encoded in the QR Code
}

export default function QRCodeModal({ isOpen, onClose, qrValue }: QRCodeModalProps) {
  
  // Function to download the QR code as an image
  const downloadQR = () => {
    const canvas = document.getElementById('student-qr-code') as HTMLCanvasElement;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png'); // Convert canvas to image URL
    const link = document.createElement('a');  // Create a temporary download link
    link.download = 'qr-code.png';
    link.href = url;
    link.click(); // Trigger the download
  };


  return (
    // Animate the modal appearance using Headless UI Transition
    <Transition appear show={isOpen} as={Fragment}>
      {/* Modal container with backdrop and accessibility */}
      <Dialog as="div" className="modal-root student-qr-modal-root" onClose={onClose}>

        {/* Fade-in backdrop */}
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

        {/* Wrapper for the modal panel */}
        <div className="modal-container student-qr-modal-container">
          <div className="modal-wrapper student-qr-modal-wrapper">

            {/* Slide and scale animation for the modal panel */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* Modal content box */}
              <Dialog.Panel className="student-qr-modal-panel">

                {/* Top-right close icon */}
                <button onClick={onClose} className="student-qr-close-icon" aria-label="Close">
                  <i className="ri-close-line"></i>
                </button>

                {/* Modal title */}
                <div className="modal-title">QR Code</div>

                {/* QR Code Placeholder */}
                <div className="student-qr-modal-content">
                  <div
                    id="student-qr-code"
                    className="student-qr-placeholder"
                  >
                    QR Code Placeholder
                  </div>
                </div>

                {/* Action buttons for download and share */}
                <div className="student-qr-modal-footer">
                  <button onClick={downloadQR} className="student-qr-btn">Download</button>
                  {/* <button onClick={shareQR} className="student-qr-btn">Share</button> */}
                </div>
              </Dialog.Panel>
            </Transition.Child>

          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
