import {} from "node:events";
import type { Events } from "whatsapp-web.js";
import { SignalConstants } from "os";

export interface CommandOptions {
  name: string;
  aliases: Array<string>;
  description: string;
  category: string;
  usage: string;
  disable?: boolean;
  cooldown?: number;
  minArgs?: number;
  maxArgs?: number;
}

export interface EventOptions {
  name: Events | keyof ProcessEvents | "process";
  names?: Array<keyof ProcessEvents | keyof SignalConstants>;
  type: "on" | "once";
  emitter: "client" | "process";
  enable: boolean;
}

export interface ProcessEvents {
  beforeExit;
  exit;
  uncaughtException;
  uncaughtExceptionMonitor;
  unhandledRejection;
  multipleResolves;
  rejectionHandled;
}
