import type { Client } from "@/core/Client";
import type { CommandOptions } from "@/types";
import { BaseCommand } from "@/utils/structures/BaseCommand";
import type { Message } from "whatsapp-web.js";

export class TestCommand extends BaseCommand {
	public constructor(client: Client) {
		const options: CommandOptions = {
			name: "test",
			aliases: ["t"],
			category: "test",
			description: "test command",
			usage: "",
		};

		super(client, options);
	}

	public async run(client: Client, message: Message, args: string[]): Promise<Message> {
		return (await message.getChat()).sendMessage("testado");
	}
}
