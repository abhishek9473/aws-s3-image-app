import ReactModal from "react-modal";

export default function Modal({ isOpen, onClose, children }) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-md p-4"
      overlayClassName="fixed z-40 top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50"
      closeTimeoutMS={200}
    >
      {children}
    </ReactModal>
  );
}
