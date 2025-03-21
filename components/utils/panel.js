import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const Panel = ({
  children,
  alignment = 'right',
  context = null,
  triggers,
  defaultOpen = false,
  additionalClasses = '',
}) => {
  const { openTriggerEl, closeTriggerEl, toggleEl } = triggers;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const handleOpenEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };
  const handleCloseEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
  };
  const handleToggleEvent = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (openTriggerEl) openTriggerEl.addEventListener('click', handleOpenEvent);
    if (closeTriggerEl)
      closeTriggerEl.addEventListener('click', handleCloseEvent);
    if (toggleEl) toggleEl.addEventListener('click', handleToggleEvent);
    if (context) {
      document.addEventListener(`${context}:open`, handleOpenEvent);
      document.addEventListener(`${context}:close`, handleCloseEvent);
    }

    return () => {
      if (openTriggerEl)
        openTriggerEl.removeEventListener('click', handleOpenEvent);
      if (closeTriggerEl)
        closeTriggerEl.removeEventListener('click', handleCloseEvent);
      if (toggleEl) toggleEl.removeEventListener('click', handleToggleEvent);
      if (context) {
        document.removeEventListener(`${context}:open`, handleOpenEvent);
        document.removeEventListener(`${context}:close`, handleCloseEvent);
      }
    };
  }, [openTriggerEl, closeTriggerEl, toggleEl]);

  const closedClass =
    alignment === 'right' ? 'translate-x-full' : '-translate-x-full';

  return (
    <div
      className={`
        block
        max-w-panel
        w-full h-full
        fixed
        top-0
        bottom-0
        transition-transform
        z-40
        bg-white
        ${alignment === 'right' ? 'right-0' : 'left-0'} ${
        isOpen ? 'translate-x-0' : closedClass
      } ${additionalClasses}`}
    >
      {children}
    </div>
  );
};

export default Panel;
