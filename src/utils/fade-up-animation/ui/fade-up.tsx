import {
	cloneElement,
	CSSProperties,
	ReactElement,
	useEffect,
	useState,
} from 'react';

interface FadeUpWrapperProps {
	children: ReactElement;
	delay?: number;
	className?: string;
	style?: CSSProperties;
}

function FadeUpWrapper({
	children,
	delay = 0,
	className = '',
	style = {},
}: FadeUpWrapperProps) {
	const [isVisible, setIsVisible] = useState(false);

	// Активируем анимацию через указанную задержку
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, delay);

		return () => clearTimeout(timer);
	}, [delay]);

	return cloneElement(children, {
		'data-fade-up': isVisible ? 'visible' : 'hidden',
		className: `${children.props.className || ''} ${className}`.trim(),
		style: { ...children.props.style, ...style },
	});
}

export default FadeUpWrapper;
