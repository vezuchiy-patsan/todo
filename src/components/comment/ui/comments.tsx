import { useState, FormEvent, ChangeEvent, memo } from 'react';
import { CommentProps } from '../types/types';

export const Comment: React.FC<CommentProps> = memo(({ comment, addReply }) => {
	const [replyText, setReplyText] = useState<string>('');

	const handleAddReply = (e: FormEvent) => {
		e.preventDefault();
		if (replyText.trim()) {
			addReply(comment.id, replyText);
			setReplyText('');
		}
	};

	return (
		<div className="comment">
			<div>
				<strong>{comment.text}</strong>
			</div>
			<form onSubmit={handleAddReply}>
				<div className="comment-text">
					<input
						type="text"
						value={replyText}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setReplyText(e.target.value)
						}
						placeholder="Ваш ответ..."
					/>
					<button type="submit">
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
			</form>
			{comment.replies.length > 0 && (
				<div className="comment-replies">
					{comment.replies.map((reply) => (
						<Comment
							key={`comment-system-comment-reply-${comment.id}-${reply.id}`}
							comment={reply}
							addReply={addReply}
						/>
					))}
				</div>
			)}
		</div>
	);
});
