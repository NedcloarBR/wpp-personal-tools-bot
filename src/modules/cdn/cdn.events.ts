import { Injectable, Logger } from "@nestjs/common";
import { Context, type ContextOf, On } from "nestwhats";
import { BOT_FOOTER } from "src/common/constants";
import { Events, type Message } from "whatsapp-web.js";
// biome-ignore lint/style/useImportType: Dependency Injection
import { CdnService } from "./cdn.service";

@Injectable()
export class CdnEvents {
	private readonly logger = new Logger(CdnEvents.name);
	public constructor(private readonly cdnService: CdnService) {}

	@On(Events.MESSAGE_CREATE, { client: ["PERSONAL"] })
	public async onCDNMessage(
		@Context() [message]: ContextOf<Events.MESSAGE_CREATE>,
	): Promise<void> {
		if (message.body.includes(BOT_FOOTER)) return;

		const chatId = message.id.remote;

		if (!this.cdnService.list().some((c) => c.chatId === chatId)) {
			return;
		}

		this.logger.log(
			`[onCDNMessage] chatId=${chatId} fromMe=${message.fromMe} hasMedia=${message.hasMedia} body="${message.body}"`,
		);

		if (message.hasMedia) {
			await this.handleMedia(message, chatId);
			return;
		}

		const results = await this.cdnService.flushByTrigger(
			chatId,
			message.body.trim(),
		);
		for (const { name, saved } of results) {
			if (saved > 0) {
				await message.reply(
					`✅ *${name}*: ${saved} arquivo(s) salvos!${BOT_FOOTER}`,
				);
			} else {
				await message.reply(
					`⚠️ *${name}*: nenhum arquivo na fila.${BOT_FOOTER}`,
				);
			}
		}
	}

	private async handleMedia(message: Message, chatId: string): Promise<void> {
		try {
			this.logger.log(`[handleMedia] downloading chatId=${chatId}`);
			const media = await message.downloadMedia();
			if (!media) {
				this.logger.warn(
					`[handleMedia] downloadMedia() returned null chatId=${chatId}`,
				);
				return;
			}
			this.logger.log(
				`[handleMedia] downloaded mimetype=${media.mimetype} filename=${media.filename}`,
			);
			this.cdnService.enqueueMedia(chatId, media, media.filename?.toString());
		} catch (err) {
			this.logger.error("[handleMedia] Failed to download media", err);
		}
	}
}
