import { Project } from '../../../pages/projects/types/types/projects-type';

export interface ProjectsState {
	projects: Project[];
}

export enum ProjectsActionsTypes {
	ADD_PROJECTS = 'ADD_PROJECTS',
	DELETE_PROJECTS = 'DELETE_PROJECTS',
}

interface AddProjectAction {
	type: ProjectsActionsTypes.ADD_PROJECTS;
	payload: Project;
}

interface DeleteProjectAction {
	type: ProjectsActionsTypes.DELETE_PROJECTS;
	payload: string;
}

export type ProjectsAction = AddProjectAction | DeleteProjectAction;
