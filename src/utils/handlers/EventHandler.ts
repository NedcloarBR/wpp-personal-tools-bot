import { parse } from "node:path";
import type { Client } from "../../core/Client";
import { BaseEvent } from "../structures/BaseEvent";
import { BaseHandler } from "./BaseHandler";

export class EventHandler {
	public constructor(private client: Client) {}

	async load() {
		const baseHandler = new BaseHandler();

		const eventFiles = await baseHandler.getFiles("events");
		for(const eventFile of eventFiles) {
			const { name } = parse(eventFile);
			const File = await baseHandler.findClass(await import(eventFile));
			if (!File) {
				throw new TypeError(`Event: ${name} doesn't exported an Class`);
			}

			const event = new File(this.client, name.toLowerCase());
			if (!(event instanceof BaseEvent)) {
				throw new TypeError(`Event: ${name} isn't in Events`);
			}
			this.client.events.set(String(event.options.name), event);

			const HandlerList = [
				{ emitter: "client", value: this.client },
				{ emitter: "process", value: process },
			];

			for (const Prop of HandlerList) {
				switch (event.options.emitter) {
					case String(Prop.emitter):
						Object(Prop.value)[event.options.type](event.options.name, (...args: unknown[]) => {
							if (event.options.enable) {
								if (event.options.name === "process") {
									for(const name of event.options.names!) {
                    event.run(this.client, ...args)
                  }
								} else {
									event.run(this.client, ...args);
								}
							}
						});
				}
			}
		};
	}
}
