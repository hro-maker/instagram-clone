import { Module } from '@nestjs/common';
import { EventsGateway } from './message.gateway';

@Module({
  providers: [EventsGateway],
})
export class EventsModule {}