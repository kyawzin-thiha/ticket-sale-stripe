import {Module} from '@nestjs/common';
import {HelperModule} from '../helper/helper.module';

@Module({
    imports: [HelperModule]
})
export class DbModule {}
