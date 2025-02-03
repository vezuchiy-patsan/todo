import { ReduxState } from '../app/store/store';
import { projectsData } from './projects';
import { tasksData } from './tasks';

export const testData: ReduxState = {
	projects: projectsData,
	tasks: tasksData,
};
