import { useState, useEffect, memo } from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../../app/store/store';
import { TasksActionsTypes } from '../../../app/store/types/tasks';
import { Comment } from '../../comment';
import { CommentType } from '../../comment/types/types';

export const CommentSystem = memo(
	({ idTask, projectId }: { idTask: string; projectId: string }) => {
		const dispatch = useDispatch();

		const tasks = useTypedSelector((state) => state.tasks.tasksProject);

		const [comments, setComments] = useState<CommentType[]>([]);
		const [replyText, setReplyText] = useState<string>('');
		const [isNeedSendComment, setIsNeedSendComment] = useState(false);

		const addComment = (text: string): void => {
			const newComment: CommentType = {
				id: Date.now(),
				text,
				replies: [],
			};
			setComments([...comments, newComment]);
			setIsNeedSendComment(true);
		};

		const addReplyRecursively = (
			comments: CommentType[],
			parentId: number,
			reply: CommentType,
		): CommentType[] => {
			return comments.map((comment) => {
				if (comment.id === parentId) {
					return {
						...comment,
						replies: [...comment.replies, reply],
					};
				}
				return {
					...comment,
					replies: addReplyRecursively(comment.replies, parentId, reply),
				};
			});
		};

		const addReply = (parentId: number, replyText: string): void => {
			setComments((prevComments) =>
				addReplyRecursively(prevComments, parentId, {
					id: Date.now(),
					text: replyText,
					replies: [],
				}),
			);
			setIsNeedSendComment(true);
		};

		useEffect(() => {
			if (isNeedSendComment) {
				const obj = {
					id: idTask,
					comments,
				};
				dispatch({ type: TasksActionsTypes.ADD_COMMENT, payload: obj });
				setIsNeedSendComment(false);
				dispatch({ type: TasksActionsTypes.GET_TASK, payload: projectId });
			}
		}, [comments, dispatch, idTask, isNeedSendComment, projectId]);

		useEffect(() => {
			setComments(tasks.find((f) => f.id === idTask)?.comments ?? []);
		}, [idTask, tasks]);

		return (
			<div className="comment first-line">
				<h2>Комментарии</h2>
				<div className="comment-text">
					<input
						type="text"
						placeholder="Введите комментарий"
						value={replyText}
						onChange={(e) => setReplyText(e.currentTarget.value)}
						onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
							if (e.key === 'Enter') {
								addComment(replyText);
								setReplyText(() => '');
							}
						}}
					/>
					<button
						type="submit"
						onClick={() => {
							addComment(replyText);
							setReplyText(() => '');
						}}
					>
						<div className="svg-wrapper-1">
							<div className="svg-wrapper">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									width="16"
									height="16"
								>
									<path fill="none" d="M0 0h24v24H0z"></path>
									<path
										fill="currentColor"
										d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
									></path>
								</svg>
							</div>
						</div>
						<span>Отправить</span>
					</button>
				</div>
				{comments.map((comment) => (
					<Comment
						key={`comment-system-${comment.id}`}
						comment={comment}
						addReply={addReply}
					/>
				))}
			</div>
		);
	},
);
