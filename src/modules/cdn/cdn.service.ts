import * as path from "node:path";
import { Inject, Injectable, Logger } from "@nestjs/common";
import type { MessageMedia } from "whatsapp-web.js";
import { type CdnConfigType, cdnConfig } from "./cdn.config";
// biome-ignore lint/style/useImportType: Dependency Injection
import { CdnQueueService } from "./cdn.queue.service";
// biome-ignore lint/style/useImportType: Dependency Injection
import { CdnStoreService } from "./cdn.store.service";
import type { CdnConfig } from "./cdn.types";

@Injectable()
export class CdnService {
	private readonly logger = new Logger(CdnService.name);
	private readonly baseSavePath: string;

	public constructor(
		@Inject(cdnConfig.KEY) config: CdnConfigType,
		private readonly store: CdnStoreService,
		private readonly queue: CdnQueueService,
	) {
		this.baseSavePath = config.savePath;
	}

	public setup(chatId: string, name: string, trigger: string): CdnConfig {
		const config: CdnConfig = {
			id: `${chatId}::${name}`,
			name,
			chatId,
			trigger,
			savePath: path.join(this.baseSavePath, name),
		};
		this.store.set(config);
		this.logger.log(
			`[setup] name=${name} chatId=${chatId} trigger=${trigger} savePath=${config.savePath}`,
		);
		return config;
	}

	public remove(chatId: string, name: string): boolean {
		const id = `${chatId}::${name}`;
		this.queue.clear(id);
		return this.store.delete(id);
	}

	public list(): CdnConfig[] {
		return this.store.getAll();
	}

	public enqueueMedia(
		chatId: string,
		media: MessageMedia,
		originalFilename?: string,
	): void {
		const configs = this.store.getByChatId(chatId);
		this.logger.log(
			`[enqueueMedia] chatId=${chatId} configs_found=${configs.length}`,
		);
		for (const config of configs) {
			this.queue.enqueue(config, media, originalFilename);
		}
	}

	public async flushByTrigger(
		chatId: string,
		trigger: string,
	): Promise<{ name: string; saved: number }[]> {
		const configs = this.store.getByChatId(chatId);
		this.logger.log(
			`[flushByTrigger] chatId=${chatId} trigger="${trigger}" configs_found=${configs.length}`,
		);
		const results: { name: string; saved: number }[] = [];
		for (const config of configs) {
			this.logger.log(
				`[flushByTrigger] checking config trigger="${config.trigger}" match=${config.trigger === trigger}`,
			);
			if (config.trigger !== trigger) continue;
			const saved = await this.queue.flush(config);
			results.push({ name: config.name, saved });
		}
		return results;
	}
}
