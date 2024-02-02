export default class Base extends Error {
	public code: number;

	constructor(message: string = 'Generic error message', code: number = 400) {
		super(message);
		this.code = code;
	}
}
