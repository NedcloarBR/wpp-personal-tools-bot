import type { Client } from "@/core/Client";
import type { EventOptions } from "@/types";
import { BaseEvent } from "@/utils/structures/BaseEvent";
import { Events } from "whatsapp-web.js";

export class QRCodeEvent extends BaseEvent {
	public constructor(client: Client) {
		const options: EventOptions = {
			name: Events.READY,
			emitter: "client",
			type: "once",
			enable: true,
		};

		super(client, options);
	}

  public async run(client: Client): Promise<void> {
    console.log(`Ready as ${client.info.pushname}`);
    console.log(`Events: ${client.events.size}`);
    console.log(`Commands: ${client.commands.size}`);
  }
}
