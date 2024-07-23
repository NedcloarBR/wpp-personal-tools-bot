import { Tools } from "@/utils/Tools";
import { LoadHandlers } from "@/utils/handlers/LoadHandlers";
import type { BaseCommand } from "@/utils/structures/BaseCommand";
import type { BaseEvent } from "@/utils/structures/BaseEvent";
import { LocalAuth, Client as WppClient } from "whatsapp-web.js";

export class Client extends WppClient {
	public events = new Map<string, BaseEvent>();
	public commands = new Map<string, BaseCommand>();
	public aliases = new Map<string, string>();

  public tools = new Tools(this);

	private readonly LoadHandlers = new LoadHandlers(this);

	public constructor() {
		super({
			authStrategy: new LocalAuth(),
		});
	}

	public async login(): Promise<void> {
		await this.LoadHandlers.load();
		this.initialize();
	}
}
