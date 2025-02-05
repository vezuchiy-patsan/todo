import { restoreState } from '../../../utils/localStorage/localStorage';
import { ReduxState } from '../store';
import { TasksState, TasksAction, TasksActionsTypes } from '../types/tasks';

const initialState: TasksState = {
	tasks: restoreState<ReduxState>('state')?.tasks ?? [],
	tasksProject: [],
};

export default function tasksReducer(
	state: TasksState = initialState,
	action: TasksAction,
): TasksState {
	switch (action.type) {
		case TasksActionsTypes.ADD_TASK:
			return {
				tasks: [...state.tasks, action.payload],
				tasksProject: state.tasksProject,
			};

		case TasksActionsTypes.GET_TASK:
			return {
				tasks: state.tasks,
				tasksProject:
					state.tasks.filter((f) => f.projectId === action.payload) ?? [],
			};
		case TasksActionsTypes.EDIT_TASK:
			const editObjIndex = state.tasks.findIndex(
				(project) => project.id === action.payload.id,
			);

			if (editObjIndex !== -1) {
				return {
					tasks: state.tasks.map((project, index) =>
						index === editObjIndex
							? { ...project, ...action.payload }
							: project,
					),
					tasksProject: state.tasksProject,
				};
			} else {
				throw new Error('Ошибка: не найден проект для редактирования');
			}
		case TasksActionsTypes.DELETE_TASK:
			return {
				tasks: [...state.tasks.filter((f) => f.id !== action.payload)],
				tasksProject: state.tasksProject,
			};
		default:
			return state;
	}
}
