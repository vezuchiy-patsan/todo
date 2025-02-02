import { ReactNode } from 'react';
import { NotFoundPage } from '../../../pages/not-found-page';
import { TasksPage } from '../../../pages/tasks';
import { ProjectsPage } from '../../../pages/projects';

interface RouteProps {
	path: string;
	element: ReactNode;
}

export enum AppRoutes {
	PROJECTS = 'PROJECTS',
	TASKS = 'TASKS',
	NOT_FOUND = 'not_found',
}

export const RoutePath: Record<AppRoutes, string> = {
	[AppRoutes.PROJECTS]: '/projects',
	[AppRoutes.TASKS]: '/projects/:projectId/tasks',
	[AppRoutes.NOT_FOUND]: '*',
};

export const routeConfig: Record<AppRoutes, RouteProps> = {
	[AppRoutes.PROJECTS]: {
		path: RoutePath[AppRoutes.PROJECTS],
		element: <ProjectsPage />,
	},
	[AppRoutes.TASKS]: {
		path: RoutePath[AppRoutes.TASKS],
		element: <TasksPage />,
	},
	[AppRoutes.NOT_FOUND]: {
		path: RoutePath[AppRoutes.NOT_FOUND],
		element: <NotFoundPage />,
	},
};
