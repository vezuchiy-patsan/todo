export interface Task {
	id: string;
	numberTask: number;
	projectId: string;
	title: string;
	description: string;
	createdAt: string; // Дата создания задачи
	timeInWork: string; // Время в работе (в часах или минутах)
	editTime: string;
	finishedAt: string; // Дата окончания задачи (если задача завершена)
	priority: PriorityType;
	attachments: string[]; // Вложенные файлы (пути к файлам или ссылки)
	status: StatusType;
	subtasks: Task[];
	comments: Comment[];
}

export interface Comment {
	id: string;
	author: string; // Автор комментария
	text: string; // Текст комментария
	createdAt: Date; // Дата создания комментария
	repliedId: string | null;
	taskId: string;
	replies: Comment[]; // Ответы на комментарий (каскадные комментарии)
}

type StatusType = 'queue' | 'development' | 'done';
type PriorityType = 'low' | 'medium' | 'high';
