import { Injectable } from "@nestjs/common";
import { Command, CommandContext, Context } from "nestwhats";

@Injectable()
export class TestCommand {
  @Command({
    name: "test",
    description: "Test command",
  })
  public async test(@Context() [message]: CommandContext) {
    return (await message.getChat()).sendMessage("testado");
  }
}
