import { restoreState } from '../../../utils/localStorage/localStorage';
import { ReduxState } from '../store';
import { TasksState, TasksAction, TasksActionsTypes } from '../types/tasks';

const initialState: TasksState = {
	tasks: restoreState<ReduxState>('state')?.tasks ?? [],
};

export default function tasksReducer(
	state: TasksState = initialState,
	action: TasksAction,
): TasksState {
	switch (action.type) {
		case TasksActionsTypes.ADD_TASK:
			return {
				tasks: [...state.tasks, action.payload],
			};
		case TasksActionsTypes.DELETE_TASK:
			return {
				tasks: [...state.tasks.filter((f) => f.id !== action.payload)],
			};
		default:
			return state;
	}
}
