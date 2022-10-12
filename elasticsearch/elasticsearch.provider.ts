import {FactoryProvider} from '@nestjs/common/interfaces'

import {ElasticsearchService} from './elasticsearch.service'
import {AppConfigService} from 'src/shared/config/app-config.service'

export function createElasticsearchProvider(): FactoryProvider {
	return {
		provide: ElasticsearchService,
		useFactory: (appConfigService: AppConfigService): ElasticsearchService => {
			const {host, username, password} = appConfigService.ELASTIC
			const client = new ElasticsearchService({
				node: host,
				maxRetries: 3,
				requestTimeout: 10000,
				auth: {
					username,
					password,
				},
				headers: {'Content-Type': 'application/json'},
			})
			return client
		},
		inject: [AppConfigService],
	}
}
