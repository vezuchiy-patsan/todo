import { CommentType } from '../../../components/comment/types/types';

export interface Task {
	id: string;
	numberTask: number;
	projectId: string;
	title: string;
	description: string;
	createdAt: string; // Дата создания задачи
	timeInWork: string; // Время в работе (в часах или минутах)
	finishedAt: string; // Дата окончания задачи (если задача завершена)
	priority: PriorityType;
	attachments: FileInfo[]; // Вложенные файлы (пути к файлам или ссылки)
	status: StatusType;
	comments: CommentType[];
}

export interface FileInfo {
	name: string;
	size: number;
	type: string;
}

export type StatusType = 'queue' | 'development' | 'done';
export type PriorityType = 'low' | 'medium' | 'high';
