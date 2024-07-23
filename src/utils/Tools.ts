import type { Client } from "@/core/Client";

export class Tools {
	public constructor(private readonly client: Client) {}

	public resolveCommand(nameOrAlias: string) {
		return this.client.commands.get(nameOrAlias) ?? this.client.commands.get(this.client.aliases.get(nameOrAlias)!);
	}
}
