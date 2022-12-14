export interface SearchResponse<T> {
	took: number
	timed_out: boolean
	_scroll_id?: string
	hits: {
		total: number
		max_score: number
		hits: Array<{
			_index: string
			_type: string
			_id: string
			_score: number
			_source: T
			_version?: number
			fields?: unknown
			highlight?: unknown
			inner_hits?: unknown
			matched_queries?: string[]
			sort?: string[]
		}>
	}
	aggregations?: unknown
}
