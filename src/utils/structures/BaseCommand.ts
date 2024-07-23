import type { Client } from "@/core/Client";
import type { CommandOptions } from "@/types";
import type { Message } from "whatsapp-web.js";

export class BaseCommand {
	public constructor(
		protected client: Client,
		public options: CommandOptions,
	) {}

	public async run(client: Client, message: Message, args: string[]): Promise<Message> {
		throw new Error(`Command \`${this.options.name}\` doesn't provided a run method`);
	}
}
