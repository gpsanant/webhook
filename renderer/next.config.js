const WebpackObfuscator = require('webpack-obfuscator');
const { version } = require('../package.json');

module.exports = {
	webpack: (config, { dev, isServer }) => {
		config.target = 'electron-renderer';

		if (!dev) {
			config.plugins.push(
				new WebpackObfuscator({
					controlFlowFlattening: true,
					controlFlowFlatteningThreshold: 0.5,
					deadCodeInjection: true,
					debugProtection: true,
					identifierNamesGenerator: 'mangled',
					selfDefending: true,
					stringArrayEncoding: true,
				}),
			);
		}

		return config;
	},
	env: {
		packageVersion: version,
		apiKey: process.env.webhookApiKey,
		authDomain: "localhost",
		databaseURL: process.env.webhookDatabaseURL,
		projectId: process.env.webhookProjectId,
		storageBucket: process.env.webhookStorageBucket,
		messagingSenderId: process.env.webhookMessagingSenderId,
		appId: process.env.webhookAppId,
		measurementId: process.env.webhookMeasurementId
	}
};
