import { Task } from '../../../pages/tasks/types/tasks-type';

export interface TasksState {
	tasks: Task[];
	tasksProject: Task[];
}

export enum TasksActionsTypes {
	ADD_TASK = 'ADD_TASK',
	EDIT_TASK = 'EDIT_TASK',
	GET_TASK = 'GET_TASK',
	DELETE_TASK = 'DELETE_TASK',
}

interface AddTaskAction {
	type: TasksActionsTypes.ADD_TASK;
	payload: Task;
}

interface EditTaskAction {
	type: TasksActionsTypes.EDIT_TASK;
	payload: Task;
}

interface GetTaskAction {
	type: TasksActionsTypes.GET_TASK;
	payload: string;
}

interface DeleteTaskAction {
	type: TasksActionsTypes.DELETE_TASK;
	payload: string;
}

export type TasksAction =
	| AddTaskAction
	| EditTaskAction
	| GetTaskAction
	| DeleteTaskAction;
