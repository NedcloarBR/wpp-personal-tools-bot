import * as fs from "node:fs";
import * as path from "node:path";
import { Inject, Injectable, Logger, type OnModuleInit } from "@nestjs/common";
import { type CdnConfigType, cdnConfig } from "./cdn.config";
import type { CdnConfig } from "./cdn.types";

@Injectable()
export class CdnStoreService implements OnModuleInit {
	private readonly logger = new Logger(CdnStoreService.name);
	private readonly configs = new Map<string, CdnConfig>();
	private readonly configsFile: string;

	public constructor(@Inject(cdnConfig.KEY) config: CdnConfigType) {
		this.configsFile = config.configsFile;
	}

	public onModuleInit(): void {
		this.load();
	}

	private load(): void {
		if (!fs.existsSync(this.configsFile)) return;
		try {
			const data: CdnConfig[] = JSON.parse(
				fs.readFileSync(this.configsFile, "utf-8"),
			);
			for (const config of data) this.configs.set(config.id, config);
			this.logger.log(`Loaded ${this.configs.size} CDN config(s)`);
		} catch {
			this.logger.warn("Failed to load CDN configs, starting fresh");
		}
	}

	private persist(): void {
		fs.mkdirSync(path.dirname(this.configsFile), { recursive: true });
		fs.writeFileSync(
			this.configsFile,
			JSON.stringify([...this.configs.values()], null, 2),
		);
	}

	public set(config: CdnConfig): void {
		this.configs.set(config.id, config);
		this.persist();
	}

	public delete(id: string): boolean {
		const existed = this.configs.has(id);
		if (existed) {
			this.configs.delete(id);
			this.persist();
		}
		return existed;
	}

	public getAll(): CdnConfig[] {
		return [...this.configs.values()];
	}

	public getByChatId(chatId: string): CdnConfig[] {
		return this.getAll().filter((c) => c.chatId === chatId);
	}
}
