import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export const KeyboardTrapModal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Identify focusable elements
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex="0"]';
    const focusableElements = modalRef.current?.querySelectorAll(focusableSelector) || [];
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Save previous active element
    const previousActiveElement = document.activeElement;

    // Focus the first element inside the modal
    if (firstElement) {
      setTimeout(() => firstElement.focus(), 50);
    } else {
      modalRef.current?.focus();
    }

    const handleKeyDown = (e) => {
      // Escape closes modal
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Tab navigation loop
      if (e.key === 'Tab') {
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restore focus
      if (previousActiveElement && previousActiveElement.focus) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
        tabIndex="-1"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="icon-btn"
          style={{ position: 'absolute', top: '16px', right: '16px' }}
          aria-label="Close modal"
        >
          <X size={20} aria-hidden="true" />
        </button>

        {title && <h2 id="modal-title">{title}</h2>}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};
export default KeyboardTrapModal;
