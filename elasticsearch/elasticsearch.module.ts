import {Module} from '@nestjs/common'
import {AppConfigModule} from '../config/config.module'

import {createElasticsearchProvider} from './elasticsearch.provider'
import {ElasticsearchService} from './elasticsearch.service'

@Module({
	imports: [AppConfigModule],
	providers: [createElasticsearchProvider()],
	exports: [ElasticsearchService],
})
export class ElasticsearchModule {}
