import { memo, useCallback, useState } from 'react';
import { useTypedSelector } from '../../../app/store/store';
import AddIcon from '../../../assets/card/add-icon.svg';
import { useDispatch } from 'react-redux';
import { ProjectsActionsTypes } from '../../../app/store/types/projects';
import { Project } from '../types/types/projects-type';
import dayjs from 'dayjs';
import { Modal } from '../../../components/modal';
import EditIcon from '../../../assets/card/pencil.svg';
import DeleteIcon from '../../../assets/card/delete.svg';

function ProjectsPage() {
	const dispatch = useDispatch();
	const data = useTypedSelector((state) => state.projects.projects);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(() => true);
	const closeModal = useCallback(
		() => setIsModalOpen(() => false),
		[setIsModalOpen],
	);

	const addNewProject = () => {
		if (data.length > 0) {
			const sortData = data.sort((a, b) => Number(a.id) - Number(b.id));

			const newObj: Project = {
				id: (Number(sortData[sortData.length - 1]?.id) + 1)?.toString(),
				countTasks: 1,
				createdAt: dayjs().format('YYYY-MM-DD'),
				title: 'Проверка',
				description: 'Проверка',
			};
			dispatch({ type: ProjectsActionsTypes.ADD_PROJECTS, payload: newObj });
			return;
		}
		const newObj: Project = {
			id: '1',
			countTasks: 1,
			createdAt: dayjs().format('YYYY-MM-DD'),
			title: 'Проверка',
			description: 'Проверка',
		};
		dispatch({ type: ProjectsActionsTypes.ADD_PROJECTS, payload: newObj });
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
									onClick={openModal}
								>
									<img src={EditIcon} alt="edit" />
								</button>
								<button
									className="project_container_card_button"
									onClick={openModal}
								>
									<img src={DeleteIcon} alt="delete" />
								</button>
							</div>
							<div className="project_container_card_time">
								от {card.createdAt}
							</div>
							<div className="project_container_card_name">{card.title}</div>
							<div className="project_container_card_count">
								({card.countTasks})
							</div>
						</div>
					))}
				<div
					className="project_container_card add"
					key={`card-add`}
					onClick={addNewProject}
				>
					<div className="project_container_card_name">
						<img src={AddIcon} alt="plus" width={56} />
					</div>
				</div>
			</div>
			<Modal isOpen={isModalOpen} onClose={closeModal}>
				<h2>Это модальное окно</h2>
				<p>Здесь может быть любой контент: формы, текст, изображения и т.д.</p>
			</Modal>
		</>
	);
}

export default memo(ProjectsPage);
