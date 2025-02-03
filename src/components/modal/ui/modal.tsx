import { memo, ReactNode } from 'react';

import CloseIcon from '../../../assets/card/delete.svg';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}

export const Modal = memo(({ isOpen, onClose, children }: ModalProps) => {
	if (!isOpen) return null; // Если модальное окно закрыто, не рендерим его

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div className="modal-overlay" onClick={handleOverlayClick}>
			<div className="modal-content">
				<button className="modal-close-button" onClick={onClose}>
					<img src={CloseIcon} alt="Close" />
				</button>
				{children}
			</div>
		</div>
	);
});
