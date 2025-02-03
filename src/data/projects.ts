import dayjs from 'dayjs';
import { Project } from '../pages/projects/types/types/projects-type';

export const projectsData: Project[] = [
	{
		id: '1',
		countTasks: 1,
		createdAt: dayjs().format('YYYY-MM-DD'),
		description: 'Тестовый проект',
		title: 'Тест',
	},
	{
		id: '2',
		countTasks: 1,
		createdAt: dayjs().format('YYYY-MM-DD'),
		description: 'Тестовый проект',
		title: 'Тест',
	},
];
