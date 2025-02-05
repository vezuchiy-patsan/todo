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
		case ProjectsActionsTypes.EDIT_PROJECTS:
			const editObjIndex = state.projects.findIndex(
				(project) => project.id === action.payload.id,
			);

			if (editObjIndex !== -1) {
				return {
					projects: state.projects.map((project, index) =>
						index === editObjIndex
							? { ...project, ...action.payload }
							: project,
					),
				};
			} else {
				throw new Error('Ошибка: не найден проект для редактирования');
			}
		case ProjectsActionsTypes.DELETE_PROJECTS:
			return {
				projects: state.projects.filter((f) => f.id !== action.payload),
			};
		default:
			return state;
	}
}
