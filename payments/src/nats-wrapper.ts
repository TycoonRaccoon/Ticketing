import nats, { Stan } from 'node-nats-streaming'

class NatsWrapper {
	private _client?: Stan

	get client() {
		if (!this._client) throw new Error('Can not access NATS client before connecting')
		return this._client
	}

	connect(cluster_id: string, client_id: string, url: string) {
		this._client = nats.connect(cluster_id, client_id, { url })

		return new Promise<void>((resolve, reject) => {
			this.client.on('connect', () => {
				console.log('Connected to NATS')
				resolve()
			})

			this.client.on('error', err => {
				reject(err)
			})
		})
	}
}

export const nats_wrapper = new NatsWrapper()
