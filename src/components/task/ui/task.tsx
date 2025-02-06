import { useState, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { areAllChecked } from '../../../helpers/checklist/is-check';
import { Task, StatusType } from '../../../pages/tasks/types/tasks-type';
import { CommentSystem } from '../../main-comments';
import { Modal } from '../../modal';
import DeleteIcon from '../../../assets/card/delete.svg';

export function TaskComponent({
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
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(() => true);
	const closeModal = useCallback(
		() => setIsModalOpen(() => false),
		[setIsModalOpen],
	);

	const [{ isDragging }, dragRef] = useDrag({
		type: 'TASK',
		item: { id: task.id, fromColumn: columnId },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	});
	return (
		<>
			<div
				className="card"
				ref={dragRef}
				style={{ opacity: isDragging ? 0.5 : 1 }}
				onClick={() => addEditDeleteButtonClick(false, task)}
			>
				{!areAllChecked(task.description) && task.status === 'done' && (
					<div className="notificate-alert">Не все подзадачи закрыты!</div>
				)}
				<div className="main-section">
					<div>
						#{task.numberTask} {task.title}
					</div>
					<div className={`main-section-line-priority-${task.priority}`}></div>
				</div>
				<button
					onClick={(e) => {
						e.stopPropagation();
						addEditDeleteButtonClick(false, false, null, task.id);
					}}
				>
					<img src={DeleteIcon} alt="delete" />
				</button>
				<div
					className="comment-link"
					onClick={(e) => {
						e.stopPropagation();
						openModal();
					}}
				>
					Комментарии...
				</div>
			</div>
			<Modal isOpen={isModalOpen} onClose={closeModal}>
				<CommentSystem idTask={task.id} projectId={task.projectId} />
			</Modal>
		</>
	);
}
