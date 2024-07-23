import type { Client } from "@/core/Client";
import type { EventOptions } from "@/types";
import { BaseEvent } from "@/utils/structures/BaseEvent";
import qrcode from "qrcode";
import { Events } from "whatsapp-web.js";

export class QRCodeEvent extends BaseEvent {
	public constructor(client: Client) {
		const options: EventOptions = {
			name: Events.QR_RECEIVED,
			emitter: "client",
			type: "once",
			enable: true,
		};

		super(client, options);
	}

	public async run(client: Client, qr: string): Promise<void> {
		qrcode.toString(qr, { type: "terminal", small: true }, (err, url) => {
			console.log(url);
		});
	}
}
