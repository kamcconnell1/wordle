interface ModalProps {
  message: React.ReactNode | null;
}

const Modal = ({ message }: ModalProps) => {
  return <div className="modal">{message}</div>;
};
export default Modal;
