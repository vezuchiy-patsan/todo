export interface CommentType {
	id: number;
	text: string;
	replies: CommentType[];
}
export interface CommentProps {
	comment: CommentType;
	addReply: (parentId: number, replyText: string) => void;
}
