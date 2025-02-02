import { memo } from 'react';

export const Loader = memo(() => (
	<div className="loaderWrapper">
		<div className="lds-ellipsis">
			<div />
			<div />
			<div />
			<div />
		</div>
	</div>
));
