import { CommentType } from '../../../components/comment/types/types';
import { Task } from '../../../pages/tasks/types/tasks-type';

export interface TasksState {
	tasks: Task[];
	tasksProject: Task[];
}

export enum TasksActionsTypes {
	ADD_TASK = 'ADD_TASK',
	EDIT_TASK = 'EDIT_TASK',
	GET_TASK = 'GET_TASK',
	ADD_COMMENT = 'ADD_COMMENT',
	SEARCH_TASK = 'SEARCH_TASK',
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

interface SearchTaskAction {
	type: TasksActionsTypes.SEARCH_TASK;
	payload: string;
}

interface AddCommentTaskAction {
	type: TasksActionsTypes.ADD_COMMENT;
	payload: {
		id: string;
		comments: CommentType;
	};
}

interface DeleteTaskAction {
	type: TasksActionsTypes.DELETE_TASK;
	payload: string;
}

export type TasksAction =
	| AddTaskAction
	| EditTaskAction
	| GetTaskAction
	| AddCommentTaskAction
	| SearchTaskAction
	| DeleteTaskAction;
