const MIMETYPE_EXT: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/gif": "gif",
	"image/webp": "webp",
	"video/mp4": "mp4",
	"video/3gpp": "3gp",
	"audio/ogg": "ogg",
	"audio/mpeg": "mp3",
	"application/pdf": "pdf",
};

export function mimetypeToExt(mimetype: string): string {
	return MIMETYPE_EXT[mimetype] ?? mimetype.split("/")[1] ?? "bin";
}

export function generateFilename(mimetype: string, original?: string): string {
	if (original) return original;
	return `${Date.now()}.${mimetypeToExt(mimetype)}`;
}
