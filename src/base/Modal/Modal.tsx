import React from 'react';
import Modal from '@material-ui/core/Modal';
interface ModalProps {
  children: React.ReactElement;
  open: boolean;
  onClose: (open: boolean) => void;
  title?: string;
}

const CModal: React.FC<ModalProps> = ({ children, open, onClose, title }: ModalProps) => {
  return (
    <Modal open={open} onClose={onClose} className={('modal')}>
      <div className={('modal-panel')}>
        <div className={('close')} onClick={() => onClose(false)}>
          <img src={'src/assets/img/icon/close-dark.svg'} />
        </div>
        {title && <div className={('title')}>{title}</div>}
        {children}
      </div>
    </Modal>
  );
};
export default CModal;
