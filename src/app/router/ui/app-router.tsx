import { Suspense } from 'react';

import { routeConfig } from '../config/route-config';
import { Navigate, Route, Routes } from 'react-router';
import { Loader } from '../../../components/loader';

export const AppRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/projects" replace />} />
			{Object.values(routeConfig).map(({ element, path }) => (
				<Route
					key={path}
					path={path}
					element={
						<Suspense fallback={<Loader />}>
							<div className="page-wrapper">{element}</div>
						</Suspense>
					}
				/>
			))}
		</Routes>
	);
};
