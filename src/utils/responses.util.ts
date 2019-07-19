import { Response } from "express";

export async function sendSuccess(res: Response, data: any) {
	return await res.json({
		success: true,
		data
	});
}

export async function sendError(
	res: Response,
	status: Number,
	message: String,
	Code: String
) {
	return await res.json({
		success: false,
		error: {
			status,
			message,
			Code
		}
	});
}
