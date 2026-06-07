export interface CdnConfig {
	id: string;
	name: string;
	chatId: string;
	trigger: string;
	savePath: string;
}

export interface PendingMedia {
	media: { data: string; mimetype: string; filename?: string | null };
	filename: string;
	addedAt: number;
}
