import { restoreState } from '../../../utils/localStorage/localStorage';
import { ReduxState } from '../store';
import {
	ProjectsAction,
	ProjectsActionsTypes,
	ProjectsState,
} from '../types/projects';

const initialState: ProjectsState = {
	projects: restoreState<ReduxState>('state')?.projects ?? [],
};

export default function projectsReducer(
	state: ProjectsState = initialState,
	action: ProjectsAction,
): ProjectsState {
	switch (action.type) {
		case ProjectsActionsTypes.ADD_PROJECTS:
			return {
				projects:
					state.projects.length > 0
						? [...state.projects, action.payload]
						: [action.payload],
			};
		case ProjectsActionsTypes.DELETE_PROJECTS:
			return {
				projects: state.projects.filter((f) => f.id !== action.payload),
			};
		default:
			return state;
	}
}
