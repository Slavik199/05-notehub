import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  const modalRoot = document.getElementById('modal-root');
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
   
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
      
     
      previouslyFocusedElement.current?.focus();
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  
  if (!modalRoot) {
    console.error('Modal root element not found');
    return null;
  }

  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={styles.modal}>
        {children}
      </div>
    </div>,
    modalRoot
  );
}