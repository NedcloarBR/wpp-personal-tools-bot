import { Module } from "@nestjs/common";
import * as EventsMap from "./index";
const Events = Object.values(EventsMap);

@Module({
  providers: [...Events]
})
export class EventsModule { }
