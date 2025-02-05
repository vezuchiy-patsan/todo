import { ChangeEvent, FormEvent, memo, useCallback, useState } from 'react';
import { useTypedSelector } from '../../../app/store/store';
import AddIcon from '../../../assets/card/add-icon.svg';
import { useDispatch } from 'react-redux';
import { ProjectsActionsTypes } from '../../../app/store/types/projects';
import { Project } from '../types/types/projects-type';
import dayjs from 'dayjs';
import { Modal } from '../../../components/modal';
import EditIcon from '../../../assets/card/pencil.svg';
import DeleteIcon from '../../../assets/card/delete.svg';
import { NavLink } from 'react-router';

function ProjectsPage() {
	const dispatch = useDispatch();
	const data = useTypedSelector((state) => state.projects.projects);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isAddModal, setIsAddModal] = useState(false);
	const [project, setProject] = useState<Project>({
		id: '',
		title: '',
		description: '',
		createdAt: '',
		countTasks: 0,
	});

	const openModal = () => setIsModalOpen((prev) => !prev);
	const resetProject = () =>
		setProject({
			id: '',
			title: '',
			description: '',
			createdAt: '',
			countTasks: 0,
		});
	const closeModal = useCallback(
		() => setIsModalOpen(() => false),
		[setIsModalOpen],
	);

	const addEditDeleteButtonClick = (
		isAdd: boolean = false,
		isEdit: Project | boolean = false,
		id?: string,
	) => {
		if (isAdd) {
			setIsAddModal(() => true);
			openModal();
			return;
		}
		if (isEdit && typeof isEdit !== 'boolean') {
			setProject(() => ({
				...isEdit,
			}));
			openModal();
			return;
		}
		if (id)
			dispatch({ type: ProjectsActionsTypes.DELETE_PROJECTS, payload: id });
	};

	const addNewProject = (e: FormEvent) => {
		e.preventDefault();

		if (isAddModal) {
			const sortData = data.sort((a, b) => Number(a.id) - Number(b.id));
			const newId = Number(sortData[sortData.length - 1]?.id ?? '0') + 1;

			const newObj: Project = {
				id: newId.toString(),
				countTasks: project.countTasks,
				createdAt: dayjs().format('YYYY-MM-DD'),
				title: project.title,
				description: project.description,
			};
			dispatch({ type: ProjectsActionsTypes.ADD_PROJECTS, payload: newObj });
			setIsAddModal(() => false);
		} else {
			dispatch({ type: ProjectsActionsTypes.EDIT_PROJECTS, payload: project });
		}
		openModal();
		resetProject();
	};

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setProject((prevProject) => ({
			...prevProject,
			[name]: value,
		}));
	};

	return (
		<>
			<div className="project_container">
				{data.length > 0 &&
					data.map((card, index) => (
						<div className="project_container_card" key={`${card.id}-${index}`}>
							<div className="project_container_card_buttons">
								<button
									className="project_container_card_button"
									onClick={() => addEditDeleteButtonClick(false, card)}
								>
									<img src={EditIcon} alt="edit" />
								</button>
								<button
									className="project_container_card_button"
									onClick={() =>
										addEditDeleteButtonClick(false, false, card.id)
									}
								>
									<img src={DeleteIcon} alt="delete" />
								</button>
							</div>
							<NavLink to={`/projects/${card.id}/tasks`}>
								<div className="project_container_card_time">
									от {card.createdAt}
								</div>
								<div className="project_container_card_name">{card.title}</div>
								<div className="project_container_card_count">
									({card.countTasks})
								</div>
							</NavLink>
						</div>
					))}
				<div
					className="project_container_card add"
					key={`card-add`}
					onClick={() => addEditDeleteButtonClick(true)}
				>
					<div className="project_container_card_name">
						<img src={AddIcon} alt="plus" width={56} />
					</div>
				</div>
			</div>
			<Modal isOpen={isModalOpen} onClose={closeModal}>
				<div className="form-container">
					<form className="form" onSubmit={addNewProject}>
						<div className="form-group">
							<label htmlFor="title">Название проекта</label>
							<input
								type="text"
								id="title"
								name="title"
								placeholder="Название"
								value={project.title}
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
								value={project.description}
								onChange={handleChange}
								maxLength={120}
								required
							/>
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

export default memo(ProjectsPage);
