import type { Client } from "@/core/Client";
import { CommandHandler } from "./CommandHandler";
import { EventHandler } from "./EventHandler";

export class LoadHandlers {
	public constructor(public client: Client) {}

	async load() {
		await new EventHandler(this.client).load();
		const _CommandHandler = new CommandHandler(this.client);
		this.client.once("ready", async () => {
			await _CommandHandler.load();
		});
	}
}
