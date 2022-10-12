import {Injectable} from '@nestjs/common'

import {IndexDocument} from './index-document.interface'
import {ElasticsearchService} from 'src/shared/elasticsearch/elasticsearch.service'
import {SearchResponse} from 'src/shared/elasticsearch/elasticsearch.responses'
import {AppConfigService} from '../config/app-config.service'

@Injectable()
export abstract class IndexDocumentRepository<T extends IndexDocument> {
	protected readonly prefix: string

	constructor(
		protected readonly elastic: ElasticsearchService,
		appConfigService: AppConfigService,
	) {
		this.prefix = appConfigService.ELASTIC.prefix
	}

	protected abstract get indexName(): string

	async save(docs: T | T[]) {
		if (docs instanceof Array) {
			if (!docs.length) {
				return
			}
			const body = docs.flatMap((doc) => [
				{index: {_index: this.indexName, _id: doc.id}},
				doc,
			])
			return this.elastic.bulk({refresh: true, body})
		}
		return this.elastic.index({index: this.indexName, id: docs.id.toString(), body: docs})
	}

	async search<K extends keyof T>(q: string, fields: K | K[]): Promise<Array<Pick<T, K>>> {
		const escapedString = this.escapeQueryString(q)
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
		const {body} = await this.elastic.search<SearchResponse<T>>({
			index: this.indexName,
			q: `*${escapedString}*`,
			size: 10000,
			_source: Array.isArray(fields) ? fields.join(',') : String(fields),
		})
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,no-underscore-dangle
		return body.hits.hits.map((doc) => doc._source)
	}

	async destroyAll() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
		await this.elastic.indices.delete({
			index: this.indexName,
			ignore_unavailable: true,
		})
	}

	async deleteById(id: string) {
		await this.elastic.delete({
			index: this.indexName,
			id,
		})
	}

	private escapeQueryString(str: string) {
		const result = str.trim().replace(/[<>]+/, '')
		return result.replace(/([+\-=!(){}[\]^"~*?:\\/]|&&|\|\|)+/g, '\\$1')
	}
}
