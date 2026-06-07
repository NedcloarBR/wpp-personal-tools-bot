import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NestWhatsModule } from "nestwhats";
import { LocalAuth } from "whatsapp-web.js";
import * as ModulesMap from "./modules";

const Modules = Object.values(ModulesMap);

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		NestWhatsModule.forRoot({
			prefix: "&",
			printQR: false,
			puppeteer: {
				args: ["--no-sandbox", "--disable-setuid-sandbox"],
			},
			authStrategy: new LocalAuth(),
			clients: [
				{
					name: "PERSONAL",
				},
			],
		}),
		...Modules,
	],
})
export class AppModule {}
