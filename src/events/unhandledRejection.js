module.exports = {
	name: 'unhandledRejection',
	once: false,
	async execute(message) {
		console.error('Unhandled promise rejection:', message)
	},
};