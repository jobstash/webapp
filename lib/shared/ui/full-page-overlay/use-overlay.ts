import { useEffect } from 'react';

interface UseOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useOverlay = ({ isOpen, onClose }: UseOverlayProps) => {
  // Lock body scroll when overlay is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isOpen) {
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    // Cleanup function to restore original scroll behavior
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // Add Esc key listener to close overlay
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  return {
    isActive: isOpen,
  };
};
