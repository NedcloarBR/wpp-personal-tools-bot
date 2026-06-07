import * as fs from "node:fs";
import * as path from "node:path";
import { Inject, Injectable, Logger } from "@nestjs/common";
import type { MessageMedia } from "whatsapp-web.js";
import { type CdnConfigType, cdnConfig } from "./cdn.config";
import type { CdnConfig, PendingMedia } from "./cdn.types";
import { generateFilename } from "./cdn.utils";

@Injectable()
export class CdnQueueService {
	private readonly logger = new Logger(CdnQueueService.name);
	private readonly queue = new Map<string, PendingMedia[]>();
	private readonly ttlMs: number;

	public constructor(@Inject(cdnConfig.KEY) config: CdnConfigType) {
		this.ttlMs = config.ttlMs;
	}

	public enqueue(
		config: CdnConfig,
		media: MessageMedia,
		originalFilename?: string,
	): void {
		const now = Date.now();
		const filename = generateFilename(media.mimetype, originalFilename);
		const current = this.getActive(config.id, now);
		current.push({ media, filename, addedAt: now });
		this.queue.set(config.id, current);
		this.logger.log(
			`[enqueue] [${config.name}] filename=${filename} total_pending=${current.length}`,
		);
	}

	public async flush(config: CdnConfig): Promise<number> {
		const now = Date.now();
		const active = this.getActive(config.id, now);
		this.logger.log(
			`[flush] [${config.name}] active_count=${active.length} savePath=${config.savePath}`,
		);
		if (active.length === 0) return 0;

		const dir = path.join(
			config.savePath,
			new Date().toISOString().split("T")[0],
		);
		this.logger.log(`[flush] creating dir=${dir}`);
		fs.mkdirSync(dir, { recursive: true });

		for (const item of active) {
			const dest = path.join(dir, item.filename);
			fs.writeFileSync(dest, Buffer.from(item.media.data, "base64"));
			this.logger.log(`[flush] saved: ${dest}`);
		}

		this.queue.delete(config.id);
		return active.length;
	}

	public hasActive(configId: string): boolean {
		return this.getActive(configId, Date.now()).length > 0;
	}

	public clear(configId: string): void {
		this.queue.delete(configId);
	}

	private getActive(configId: string, now: number): PendingMedia[] {
		return (this.queue.get(configId) ?? []).filter(
			(p) => now - p.addedAt < this.ttlMs,
		);
	}
}
