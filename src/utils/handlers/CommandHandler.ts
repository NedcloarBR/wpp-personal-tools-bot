import { parse } from "node:path";
import type { Client } from "@/core/Client";
import type { CommandOptions as cmdOptions } from "@/types";
import { BaseCommand } from "@/utils/structures/BaseCommand";
import { BaseHandler } from "./BaseHandler";

export class CommandHandler {
  public constructor(private client: Client) {}

  async load() {
    const baseHandler = new BaseHandler();

    const commandFiles = await baseHandler.getFiles("commands");
    for(const commandFile of commandFiles) {
      const { name } = parse(commandFile);
      const File = await baseHandler.findClass(await import(commandFile));
      if (!File) {
        throw new TypeError(`Command: ${name} doesn't exported an Class`);
      }

      const command = new File(this.client, name);
      const CommandOptions = command.options as cmdOptions;
      if (!(command instanceof BaseCommand)) {
        throw new TypeError(`Comando: ${name} isn't in Commands`);
      }

      this.client.commands.set(CommandOptions.name, command);
      if (CommandOptions.aliases) {
        for (const alias of CommandOptions.aliases) {
          this.client.aliases.set(alias, CommandOptions.name);
        }
      }
    }
  }
}
