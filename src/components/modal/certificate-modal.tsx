import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import '@/styles/modal.css'; // Adjust path as needed

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificateContent?: React.ReactNode;
}

export default function CertificateModal({ isOpen, onClose, certificateContent }: CertificateModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="modal-root" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="modal-backdrop" />
        </Transition.Child>

        <div className="modal-container">
          <div className="modal-wrapper">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="modal-panel">
                <Dialog.Title className="modal-title">
                  Certificate
                </Dialog.Title>

                <div className="modal-content">
                  {certificateContent || (
                    <div className="modal-placeholder">Certificate Placeholder</div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="modal-close-button"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

