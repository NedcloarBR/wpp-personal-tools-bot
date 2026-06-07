import { Injectable } from "@nestjs/common";
import { Args, Chat, CommandGroup, Msg, Subcommand } from "nestwhats";
import type { Message, Chat as WaChat } from "whatsapp-web.js";
// biome-ignore lint/style/useImportType: Dependency Injection
import { CdnService } from "./cdn.service";

@CommandGroup({
	name: "cdn",
	description: "Gerencia watchers de CDN por conversa",
})
@Injectable()
export class CdnCommand {
	public constructor(private readonly cdnService: CdnService) {}

	@Subcommand({
		name: "setup",
		description: "Inicia um watcher de CDN na conversa atual",
	})
	public async setup(
		@Args(0) name: string,
		@Args(1) trigger: string,
		@Chat() chat: WaChat,
		@Msg() message: Message,
	): Promise<void> {
		if (!name || !trigger) {
			await message.reply("❌ Uso: `&cdn setup <nome> <trigger>`\nEx: `&cdn setup ravy .ravy`");
			return;
		}

		const config = this.cdnService.setup(chat.id._serialized, name, trigger);
		await message.reply(
			`✅ CDN *${config.name}* configurado!\n` +
				`📁 Salvando em: \`${config.savePath}\`\n` +
				`🔑 Trigger: \`${config.trigger}\``,
		);
	}

	@Subcommand({
		name: "remove",
		description: "Remove um watcher de CDN da conversa atual",
	})
	public async remove(
		@Args(0) name: string,
		@Chat() chat: WaChat,
		@Msg() message: Message,
	): Promise<void> {
		if (!name) {
			await message.reply("❌ Uso: `&cdn remove <nome>`");
			return;
		}

		const removed = this.cdnService.remove(chat.id._serialized, name);
		await message.reply(
			removed ? `✅ CDN *${name}* removido.` : `❌ CDN *${name}* não encontrado nessa conversa.`,
		);
	}

	@Subcommand({
		name: "list",
		description: "Lista todos os watchers de CDN ativos",
	})
	public async list(@Msg() message: Message): Promise<void> {
		const configs = this.cdnService.list();

		if (configs.length === 0) {
			await message.reply("📭 Nenhum CDN configurado.");
			return;
		}

		const lines = configs.map((c) => `• *${c.name}* — trigger: \`${c.trigger}\` — chat: \`${c.chatId}\``);
		await message.reply(`📦 *CDNs ativos:*\n${lines.join("\n")}`);
	}
}
