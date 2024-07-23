import type { Client } from "@/core/Client";
import type { EventOptions } from "@/types";
import type { BaseCommand } from "@/utils/structures/BaseCommand";
import { BaseEvent } from "@/utils/structures/BaseEvent";
import { Events, type Message } from "whatsapp-web.js";

export class MessageCreateEvent extends BaseEvent {
	public constructor(client: Client) {
		const options: EventOptions = {
			name: Events.MESSAGE_CREATE,
			emitter: "client",
			type: "on",
			enable: true,
		};

		super(client, options);
	}

	public async run(client: Client, message: Message): Promise<void> {
		const prefix = "!";
		if (!message.body.startsWith(prefix)) return;

		const [cmd, ...args] = message.body.slice(prefix.length).trim().split(/ +/g);

		const command: BaseCommand = client.tools.resolveCommand(cmd);
		if (command) {
			command.run(client, message, args);
		}
	}
}
