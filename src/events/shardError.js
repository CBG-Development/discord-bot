module.exports = {
	name: 'shardError',
	once: false,
	async execute(message) {
		console.error('A websocket connection encountered an error:', message)
	},
};