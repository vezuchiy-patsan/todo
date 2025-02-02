import { memo } from 'react';

function NotFoundPage() {
	return (
		<div className="pageWrapper">
			<p>Страница не найдена</p>
		</div>
	);
}

export default memo(NotFoundPage);
