import * as os from "node:os";
import * as path from "node:path";
import { registerAs } from "@nestjs/config";

function defaultSavePath(): string {
	const wslUser =
		process.env.WSLENV && process.env.USERPROFILE
			? process.env.USERPROFILE.replace(/\\/g, "/").replace(
					/^([A-Za-z]):/,
					(_, d) => `/mnt/${d.toLowerCase()}`,
				)
			: null;

	return wslUser
		? path.join(wslUser, "Documents", "cdn")
		: path.join(os.homedir(), "Documents", "cdn");
}

export const cdnConfig = registerAs("cdn", () => ({
	savePath: process.env.CDN_SAVE_PATH ?? defaultSavePath(),
	configsFile:
		process.env.CDN_CONFIGS_FILE ??
		path.join(os.homedir(), ".cdn-configs.json"),
	ttlMs: Number(process.env.CDN_TTL_MS ?? 60_000),
}));

export type CdnConfigType = ReturnType<typeof cdnConfig>;
