import { Module } from "@nestjs/common";
import { CdnCommand } from "./cdn.command";
import { CdnEvents } from "./cdn.events";
import { CdnQueueService } from "./cdn.queue.service";
import { CdnService } from "./cdn.service";
import { CdnStoreService } from "./cdn.store.service";

@Module({
	providers: [CdnStoreService, CdnQueueService, CdnService, CdnEvents, CdnCommand],
	exports: [CdnService],
})
export class CdnModule {}

