import { Task } from '../../../pages/tasks/types/tasks-type';

export interface TasksState {
	tasks: Task[];
}

export enum TasksActionsTypes {
	ADD_TASK = 'ADD_TASK',
	DELETE_TASK = 'DELETE_TASK',
}

interface AddTaskAction {
	type: TasksActionsTypes.ADD_TASK;
	payload: Task;
}

interface DeleteTaskAction {
	type: TasksActionsTypes.DELETE_TASK;
	payload: string;
}

export type TasksAction = AddTaskAction | DeleteTaskAction;
