import {
	ChangeEvent,
	FC,
	FormEvent,
	KeyboardEvent,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { useTypedSelector } from '../../../app/store/store';
import { FileInfo, StatusType, Task } from '../types/tasks-type';
import { useParams } from 'react-router';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { TasksActionsTypes } from '../../../app/store/types/tasks';
import { Modal } from '../../../components/modal';
import AddIcon from '../../../assets/card/add-icon.svg';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEInstance } from 'tinymce';
import { useDropzone } from 'react-dropzone';
import { TaskComponent } from '../../../components/task';

interface TasksColumn {
	title: 'Queue' | 'Development' | 'Done';
	tasks: Task[];
}

interface Column {
	title: string;
	tasks: Task[];
}

interface ColumnTodoProps {
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
}

const ColumnTodo: FC<ColumnTodoProps> = memo(
	({
		columnId,
		column,
		inputs,
		handleInputChange,
		handleKeyDown,
		moveTask,
		addEditDeleteButtonClick,
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
	},
);

function TasksPage() {
	const dispatch = useDispatch();

	const isNeedGet = useRef(true);
	const editorRef = useRef<TinyMCEInstance | null>(null);

	const { tasksProject: data, tasks } = useTypedSelector(
		(state) => state.tasks,
	);
	const { projectId } = useParams();

	const [initialColumns, setInitialColumns] = useState<
		Record<string, TasksColumn>
	>({
		queue: {
			title: 'Queue',
			tasks: [],
		},
		development: {
			title: 'Development',
			tasks: [],
		},
		done: {
			title: 'Done',
			tasks: [],
		},
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
		timeInWork: '',
	});

	const [inputs, setInputs] = useState<Record<StatusType, string>>({
		queue: '',
		development: '',
		done: '',
	});

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [dropZone, setDropZone] = useState(false);
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
			timeInWork: '',
		});
	const openModal = () => setIsModalOpen(() => true);
	const closeModal = useCallback(
		() => setIsModalOpen(() => false),
		[setIsModalOpen],
	);

	const addEditNewTask = (e: FormEvent) => {
		e.preventDefault();
		if (isAddModal.add) {
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
				timeInWork: '',
			};
			dispatch({ type: TasksActionsTypes.ADD_TASK, payload: newObj });
		} else {
			dispatch({ type: TasksActionsTypes.EDIT_TASK, payload: currentTask });
		}

		setIsAddModal(() => ({ add: false, status: null }));
		resetTask();
		closeModal();
		isNeedGet.current = true;
	};

	const {
		getRootProps,
		getInputProps,
		fileRejections: rejectedFiles,
	} = useDropzone({
		multiple: true,
		maxSize: 1024 * 1024,
		accept: {
			'image/png': ['.png', '.jpeg'],
			'application/pdf': ['.pdf'],
			'text/plain': ['.txt'],
			'audio/mp3': ['.mp3'],
		},
		onDragEnter: () => setDropZone(true),
		onDragLeave: () => setDropZone(false),
		onDrop: (acceptedFiles) => {
			const fileMetadata: FileInfo[] = acceptedFiles.map((file) => ({
				name: file.name,
				size: file.size,
				type: file.type,
			}));
			// если я буду сохранять в localStorage файлы base64 5мб быстро истратят
			// буду сохранять метаданные
			setCurrentTask((prevTask) => ({
				...prevTask,
				attachments: fileMetadata,
			}));
		},
	});

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
				isNeedGet.current = true;
			}
		},
		[dispatch],
	);

	const handleInputChange = useCallback(
		(columnId: string, value: string) => {
			setInputs((prev) => ({ ...prev, [columnId]: value }));
		},
		[setInputs],
	);

	const handleKeyDown = useCallback(
		(columnId: StatusType, event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter' && inputs[columnId]?.trim() !== '') {
				const sortDataId = [...tasks].sort(
					(a, b) => Number(a.id) - Number(b.id),
				);
				const sortDataNumberTask = [...tasks].sort(
					(a, b) => Number(a.numberTask) - Number(b.numberTask),
				);

				const newId = Number(sortDataId[sortDataId.length - 1]?.id ?? '0') + 1;
				const newNumber =
					Number(
						sortDataNumberTask[sortDataNumberTask.length - 1]?.numberTask ??
							'0',
					) + 1;

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
					timeInWork: '',
				};

				dispatch({ type: TasksActionsTypes.ADD_TASK, payload: newObj });
				isNeedGet.current = true;
				setInputs((prev) => ({ ...prev, [columnId]: '' }));
			}
		},
		[inputs, tasks, dispatch, currentTask.projectId], // Зависимости useCallback
	);

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const { name, value } = e.target;

			setCurrentTask((prevTasks) => ({
				...prevTasks,
				[name]: value,
			}));
		},
		[],
	);

	const moveTask = useCallback(
		(taskId: string, fromColumn: StatusType, toColumn: StatusType) => {
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

			isNeedGet.current = true;
		},
		[dispatch, initialColumns],
	);

	const handleEditorChange = useCallback((content: string) => {
		setCurrentTask((prevTasks) => ({
			...prevTasks,
			description: content,
		}));
	}, []);
	useEffect(() => {
		if (isNeedGet.current) {
			dispatch({ type: TasksActionsTypes.GET_TASK, payload: projectId });
			isNeedGet.current = false;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projectId, isNeedGet.current]);

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
					<form className="form" onSubmit={addEditNewTask}>
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

							<Editor
								id="description"
								apiKey={process.env.REACT_APP_TINEMCY_API_KEY}
								onInit={(_, editor) => (editorRef.current = editor)}
								init={{
									body_class: 'semen',
									height: 200,
									menubar: false,
									plugins: 'lists checklist',
									toolbar: 'undo redo | bold italic | checklist',
									content_style:
										'ul { list-style-type: none; } li { display: flex; align-items: center; }',
									setup: (editor) => {
										editor.ui.registry.addButton('checklist', {
											text: '✔',
											onAction: () => {
												editor.insertContent('<input type="checkbox"> ');
											},
										});
									},
								}}
								value={currentTask.description}
								onEditorChange={handleEditorChange}
							/>
						</div>
						<label>Приоритет</label>
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
						<div
							{...getRootProps()}
							className={`dropzone ${dropZone ? 'dragover' : ''}`}
						>
							<input {...getInputProps()} />
							<p>
								Перетащите файлы сюда или кликните для выбора (Максимальный
								размер файла: 1MB)
							</p>
						</div>
						<div className="file-preview">
							{currentTask.attachments.length > 0 && (
								<ul>
									{currentTask.attachments.map((file) => (
										<li key={file.name}>
											<strong>{file.name}</strong> -{' '}
											{Math.round(file.size / 1024)} KB
										</li>
									))}
								</ul>
							)}
							{rejectedFiles.length > 0 && (
								<div className="error-message">
									<p>
										Некоторые файлы слишком большие! Максимальный размер — 1 MB.
									</p>
								</div>
							)}
						</div>
						<button className="form-submit-btn" type="submit">
							{isAddModal.add ? 'Создать проект' : 'Отредактировать'}
						</button>
					</form>
				</div>
			</Modal>
		</>
	);
}

export default memo(TasksPage);
