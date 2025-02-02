import { memo, useCallback } from 'react';

interface PageErrorProps {
	scope: 'global' | 'app';
}

export const Error = memo((props: PageErrorProps) => {
	const handleReload = useCallback(() => {
		window.location.reload();
	}, []);

	return (
		<div className={`errorWrapper`}>
			<p>Что-то случилось!!! Инфо: {props.scope}</p>
			<button onClick={handleReload}>Перезагрузить</button>
		</div>
	);
});
