import { Module } from "@nestjs/common";
import { NestWhatsModule } from "nestwhats";
import { LocalAuth } from "whatsapp-web.js";
import * as ModulesMap from "./modules";
const Modules = Object.values(ModulesMap);

@Module({
  imports: [
    NestWhatsModule.forRoot({
      prefix: "&",
      authStrategy: new LocalAuth(),
      puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      }
    }),
    ...Modules
  ]
})
export class AppModule { }
