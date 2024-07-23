import type { Client } from "@/core/Client";
import type { EventOptions } from "@/types";

export class BaseEvent {
	public constructor(
		protected client: Client,
		public options: EventOptions,
	) {}

	public async run(client: Client, ...args: unknown[]): Promise<void> {
		throw new Error(`Event \`${this.options.name}\` doesn't provided a run method`);
	}
}
