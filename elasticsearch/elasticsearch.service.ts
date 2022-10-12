import {Client} from '@elastic/elasticsearch'
import {OnModuleDestroy, OnModuleInit} from '@nestjs/common'

export class ElasticsearchService extends Client implements OnModuleInit, OnModuleDestroy {
	onModuleInit() {
		// add request logging
		// this.on('request', this.#onRequestLogging)
		// add response logging
		// this.on('response', this.#onResponseLogging)
	}

	async onModuleDestroy() {
		// add logging
		// await this.close()
	}
}
