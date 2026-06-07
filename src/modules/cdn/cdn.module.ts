import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CdnCommand } from "./cdn.command";
import { cdnConfig } from "./cdn.config";
import { CdnEvents } from "./cdn.events";
import { CdnQueueService } from "./cdn.queue.service";
import { CdnService } from "./cdn.service";
import { CdnStoreService } from "./cdn.store.service";

@Module({
	imports: [ConfigModule.forFeature(cdnConfig)],
	providers: [
		CdnStoreService,
		CdnQueueService,
		CdnService,
		CdnEvents,
		CdnCommand,
	],
	exports: [CdnService],
})
export class CdnModule {}
