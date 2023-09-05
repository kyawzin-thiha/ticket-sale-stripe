import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { HelperModule } from './helper/helper.module';
import { DbModule } from './db/db.module';

@Module({
    imports: [ConfigModule.forRoot({
        isGlobal: true,
    }), HelperModule, DbModule]
})
export class AppModule {}
