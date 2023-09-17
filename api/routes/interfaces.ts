interface UserType {
	id: string;
	name: string;
	email: string;
	passhash: string;
}

interface	PostType {
	id?: string;
	userid: string;
	posted_at?: Date;
	text: string;
	reply_to: string | null;
}

interface	AuthType {
	id: string | undefined;
	auth: boolean;
	token: string | null;
}

export { UserType, PostType, AuthType };