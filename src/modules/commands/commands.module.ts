import { Module } from "@nestjs/common";
import * as CommandsMap from "./index";
const Commands = Object.values(CommandsMap);

@Module({
  providers: [...Commands]
})
export class CommandsModule { }
