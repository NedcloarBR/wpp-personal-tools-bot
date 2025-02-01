import { Injectable, Logger } from "@nestjs/common";
import { Context, ContextOf, Once } from "nestwhats";
import { Client, Events } from "whatsapp-web.js";

@Injectable()
export class GatewayEvents {
  private readonly logger = new Logger(GatewayEvents.name);
  public constructor(private readonly client: Client) { }

  @Once(Events.READY)
  public async onReady(@Context() [event]: ContextOf<Events.READY>): Promise<void> {
    this.logger.log(`${this.client.info.pushname} is ready!`);
  }

  @Once(Events.AUTHENTICATED)
  public async onAuthenticated(@Context() [event]: ContextOf<Events.AUTHENTICATED>): Promise<void> {
    this.logger.log(`Authenticated`);
  }
}
