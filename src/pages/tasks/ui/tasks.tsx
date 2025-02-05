import {
	ChangeEvent,
	FormEvent,
	KeyboardEvent,
	memo,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { useTypedSelector } from '../../../app/store/store';
import { StatusType, Task } from '../types/tasks-type';
import { useParams } from 'react-router';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { TasksActionsTypes } from '../../../app/store/types/tasks';
import { Modal } from '../../../components/modal';
import DeleteIcon from '../../../assets/card/delete.svg';
import AddIcon from '../../../assets/card/add-icon.svg';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface TasksColumn {
	title: 'Queue' | 'Development' | 'Done';
	tasks: Task[];
}

interface Column {
	title: string;
	tasks: Task[];
}

const ColumnTodo = ({
	columnId,
	column,
	inputs,
	handleInputChange,
	handleKeyDown,
	moveTask,
	addEditDeleteButtonClick,
}: {
	columnId: StatusType;
	column: Column;
	inputs: Record<StatusType, string>;
	handleInputChange: (columnId: StatusType, value: string) => void;
	handleKeyDown: (
		columnId: StatusType,
		event: KeyboardEvent<HTMLInputElement>,
	) => void;
	moveTask: (
		taskId: string,
		fromColumn: StatusType,
		toColumn: StatusType,
	) => void;
	addEditDeleteButtonClick: (
		isAdd?: boolean,
		isEdit?: Task | boolean,
		column?: StatusType | null | undefined,
		id?: string,
	) => void;
}) => {
	const [_, dropRef] = useDrop({
		accept: 'TASK',
		drop: (item: { id: string; fromColumn: StatusType }) => {
			moveTask(item.id, item.fromColumn, columnId);
		},
	});
	return (
		<div ref={dropRef} className="column">
			<div className="column-header">
				<h3>{column.title}</h3>
				<div className="column-actions">
					<button
						onClick={() =>
							addEditDeleteButtonClick(true, false, columnId as StatusType)
						}
					>
						<img src={AddIcon} alt="add" />
					</button>
				</div>
			</div>

			<div className="cards">
				{column.tasks.map((task, index) => (
					<TaskComponent
						key={`${index}-${task.title}-${task.id}`}
						task={task}
						columnId={columnId}
						addEditDeleteButtonClick={addEditDeleteButtonClick}
					/>
				))}
				<input
					className="card input-card"
					type="text"
					placeholder="Добавить задачу..."
					value={inputs[columnId]}
					onChange={(e) => handleInputChange(columnId, e.target.value)}
					onKeyDown={(e) => handleKeyDown(columnId, e)}
				/>
			</div>
		</div>
	);
};

function TaskComponent({
	task,
	columnId,
	addEditDeleteButtonClick,
}: {
	task: Task;
	columnId: StatusType;
	addEditDeleteButtonClick: (
		isAdd?: boolean,
		isEdit?: Task | boolean,
		column?: StatusType | null | undefined,
		id?: string,
	) => void;
}) {
	const [{ isDragging }, dragRef] = useDrag({
		type: 'TASK',
		item: { id: task.id, fromColumn: columnId },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	});

	return (
		<div
			ref={dragRef}
			className="card"
			style={{ opacity: isDragging ? 0.5 : 1 }}
			onClick={() => addEditDeleteButtonClick(false, task)}
		>
			<div>{task.title}</div>
			<button
				onClick={(e) => {
					e.stopPropagation();
					addEditDeleteButtonClick(false, false, null, task.id);
				}}
			>
				<img src={DeleteIcon} alt="delete" />
			</button>
		</div>
	);
}

function TasksPage() {
	const dispatch = useDispatch();

	const { tasksProject: data, tasks } = useTypedSelector(
		(state) => state.tasks,
	);
	let { projectId } = useParams();

	const [initialColumns, setInitialColumns] = useState<
		Record<string, TasksColumn>
	>({
		queue: { title: 'Queue', tasks: [] },
		development: { title: 'Development', tasks: [] },
		done: { title: 'Done', tasks: [] },
	});

	const [currentTask, setCurrentTask] = useState<Task>({
		id: '',
		title: '',
		description: '',
		createdAt: '',
		attachments: [],
		comments: [],
		finishedAt: '',
		numberTask: 0,
		priority: 'low',
		projectId: projectId ?? '',
		status: 'queue',
		subtasks: [],
		timeInWork: '',
	});

	const [inputs, setInputs] = useState<Record<StatusType, string>>({
		queue: '',
		development: '',
		done: '',
	});

	const [isNeedGet, setIsNeedGet] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isAddModal, setIsAddModal] = useState<{
		add: boolean;
		status: StatusType | null;
	}>({ add: false, status: null });

	const resetTask = () =>
		setCurrentTask({
			id: '',
			title: '',
			description: '',
			createdAt: '',
			attachments: [],
			comments: [],
			finishedAt: '',
			numberTask: 0,
			priority: 'low',
			projectId: projectId ?? '',
			status: 'queue',
			subtasks: [],
			timeInWork: '',
		});
	const openModal = () => setIsModalOpen(() => true);
	const closeModal = useCallback(
		() => setIsModalOpen(() => false),
		[setIsModalOpen],
	);

	const addNewTask = (e: FormEvent) => {
		e.preventDefault();

		const sortDataId = tasks.sort((a, b) => Number(a.id) - Number(b.id));
		const sortDataNumberTask = tasks.sort(
			(a, b) => Number(a.numberTask) - Number(b.numberTask),
		);
		const newId = Number(sortDataId[sortDataId.length - 1]?.id ?? '0') + 1;
		const newNumber =
			Number(sortDataNumberTask[sortDataNumberTask.length - 1]?.id ?? '0') + 1;

		const newObj: Task = {
			id: newId.toString(),
			title: currentTask.title,
			description: currentTask.description,
			createdAt: dayjs().format('YYYY-MM-DDTHH:mm'),
			attachments: [],
			comments: [],
			finishedAt: '',
			numberTask: newNumber,
			priority: currentTask.priority,
			projectId: currentTask.projectId,
			status: isAddModal.status ?? currentTask.status,
			subtasks: [],
			timeInWork: '',
		};
		dispatch({ type: TasksActionsTypes.ADD_TASK, payload: newObj });
		setIsAddModal(() => ({ add: false, status: null }));
		resetTask();
		closeModal();
		dispatch({ type: TasksActionsTypes.GET_TASK, payload: projectId });
	};

	const addEditDeleteButtonClick = useCallback(
		(
			isAdd: boolean = false,
			isEdit: Task | boolean = false,
			column: StatusType | null | undefined = null,
			id?: string,
		) => {
			if (isAdd) {
				setIsModalOpen(() => true);
				setIsAddModal(() => ({ add: true, status: column }));
				openModal();
				return;
			}
			if (isEdit && typeof isEdit !== 'boolean') {
				setCurrentTask(() => isEdit);
				openModal();
				return;
			}
			if (id) {
				dispatch({ type: TasksActionsTypes.DELETE_TASK, payload: id });
				setIsNeedGet(() => true);
			}
		},
		[dispatch],
	);

	const handleInputChange = (columnId: string, value: string) => {
		setInputs((prev) => ({ ...prev, [columnId]: value }));
	};

	const handleKeyDown = (
		columnId: StatusType,
		event: KeyboardEvent<HTMLInputElement>,
	) => {
		if (event.key === 'Enter' && inputs[columnId].trim() !== '') {
			const sortDataId = tasks.sort((a, b) => Number(a.id) - Number(b.id));
			const sortDataNumberTask = tasks.sort(
				(a, b) => Number(a.numberTask) - Number(b.numberTask),
			);

			const newId = Number(sortDataId[sortDataId.length - 1]?.id ?? '0') + 1;
			const newNumber =
				Number(sortDataNumberTask[sortDataNumberTask.length - 1]?.id ?? '0') +
				1;

			const newObj: Task = {
				id: newId.toString(),
				title: event.currentTarget.value,
				description: '',
				createdAt: dayjs().format('YYYY-MM-DDTHH:mm'),
				attachments: [],
				comments: [],
				finishedAt: '',
				numberTask: newNumber,
				priority: 'low',
				projectId: currentTask.projectId,
				status: columnId,
				subtasks: [],
				timeInWork: '',
			};
			dispatch({ type: TasksActionsTypes.ADD_TASK, payload: newObj });
			setIsNeedGet(() => true);
			setInputs((prev) => ({ ...prev, [columnId]: '' }));
		}
	};

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;

		setCurrentTask((prevProject) => ({
			...prevProject,
			[name]: value,
		}));
	};

	const moveTask = (
		taskId: string,
		fromColumn: StatusType,
		toColumn: StatusType,
	) => {
		if (fromColumn === toColumn) return;

		const taskToMove = initialColumns[fromColumn].tasks.find(
			(task) => task.id === taskId,
		);
		if (!taskToMove) return;

		setInitialColumns((prev) => ({
			...prev,
			[fromColumn]: {
				...prev[fromColumn],
				tasks: prev[fromColumn].tasks.filter((task) => task.id !== taskId),
			},
			[toColumn]: {
				...prev[toColumn],
				tasks: [...prev[toColumn].tasks, taskToMove],
			},
		}));

		dispatch({
			type: TasksActionsTypes.EDIT_TASK,
			payload: { ...taskToMove, status: toColumn },
		});
	};

	useEffect(() => {
		if (isNeedGet) {
			dispatch({ type: TasksActionsTypes.GET_TASK, payload: projectId });
			setIsNeedGet(() => false);
		}
	}, [dispatch, projectId, isNeedGet]);

	useEffect(() => {
		// Фильтруем задачи по статусу и обновляем initialColumns
		const todoTasks: Task[] = data.filter((task) => task.status === 'queue');
		const inProgressTasks: Task[] = data.filter(
			(task) => task.status === 'development',
		);
		const doneTasks: Task[] = data.filter((task) => task.status === 'done');

		setInitialColumns({
			queue: { title: 'Queue', tasks: todoTasks },
			development: { title: 'Development', tasks: inProgressTasks },
			done: { title: 'Done', tasks: doneTasks },
		});
	}, [data]);
	return (
		<>
			<DndProvider backend={HTML5Backend}>
				<div className="board">
					{Object.entries(initialColumns).map(([columnId, column], index) => (
						<ColumnTodo
							key={`${columnId}-${index}`}
							column={column}
							columnId={columnId as StatusType}
							handleInputChange={handleInputChange}
							handleKeyDown={handleKeyDown}
							inputs={inputs}
							moveTask={moveTask}
							addEditDeleteButtonClick={addEditDeleteButtonClick}
						/>
					))}
				</div>
			</DndProvider>
			<Modal isOpen={isModalOpen} onClose={closeModal}>
				<div className="form-container">
					<form className="form" onSubmit={addNewTask}>
						<div className="form-group">
							<label htmlFor="title">Название проекта</label>
							<input
								type="text"
								id="title"
								name="title"
								placeholder="Название"
								value={currentTask.title}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="form-group">
							<label htmlFor="description">Описание</label>
							<textarea
								id="description"
								name="description"
								placeholder="Описание"
								value={currentTask.description}
								onChange={handleChange}
								maxLength={120}
								required
							/>
						</div>
						<p>Приоритет</p>
						<div className="radio-inputs">
							<label className="radio">
								<input
									type="radio"
									name="priority"
									value="low"
									checked={currentTask.priority === 'low'}
									onChange={handleChange}
								/>
								<span className="name">Низкий</span>
							</label>
							<label className="radio">
								<input
									type="radio"
									name="priority"
									value="medium"
									onChange={handleChange}
									checked={currentTask.priority === 'medium'}
								/>
								<span className="name">Средний</span>
							</label>
							<label className="radio">
								<input
									type="radio"
									name="priority"
									value="high"
									onChange={handleChange}
									checked={currentTask.priority === 'high'}
								/>
								<span className="name">Высокий</span>
							</label>
						</div>

						<button className="form-submit-btn" type="submit">
							{isAddModal ? 'Создать проект' : 'Отредактировать'}
						</button>
					</form>
				</div>
			</Modal>
		</>
	);
}

export default memo(TasksPage);
