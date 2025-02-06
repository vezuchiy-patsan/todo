import { Task } from '../../../pages/tasks/types/tasks-type';
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
		case TasksActionsTypes.ADD_COMMENT:
			const editIndex = state.tasks.findIndex(
				(task) => task.id === action.payload.id,
			);
			const commentProp = 'comments' as keyof Task;

			if (editIndex !== -1) {
				return {
					tasks: state.tasks.map((task, index) =>
						index === editIndex
							? { ...task, [commentProp]: action.payload.comments }
							: task,
					),
					tasksProject: state.tasksProject,
				};
			} else {
				throw new Error('Ошибка: не найден задача для редактирования');
			}
		case TasksActionsTypes.GET_TASK:
			return {
				tasks: state.tasks,
				tasksProject:
					state.tasks.filter((f) => f.projectId === action.payload) ?? [],
			};
		case TasksActionsTypes.SEARCH_TASK:
			return {
				tasks: state.tasks,
				tasksProject:
					state.tasks.filter(
						(task) =>
							task.projectId === action.payload ||
							task.numberTask === Number(action.payload) ||
							task.title.toLowerCase().includes(action.payload.toLowerCase()),
					) ?? [],
			};
		case TasksActionsTypes.EDIT_TASK:
			const editObjIndex = state.tasks.findIndex(
				(task) => task.id === action.payload.id,
			);

			const newTask = state.tasks.map((task, index) =>
				index === editObjIndex ? { ...task, ...action.payload } : task,
			);

			if (editObjIndex !== -1) {
				return {
					tasks: newTask,
					tasksProject: state.tasksProject,
				};
			} else {
				throw new Error('Ошибка: не найдена задача для редактирования');
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
