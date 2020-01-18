const assert = require('assert');

assert(process.env.WISH_ADMIN_CONFIG_TYPE, 'type missing, please export with WISH_ADMIN_CONFIG_TYPE');
assert(process.env.WISH_PROJECT_ID, 'project_id missing, please export with WISH_PROJECT_ID');
assert(process.env.WISH_PRIVATE_KEY_ID, 'private_key_id missing, please export with WISH_PRIVATE_KEY_ID');
assert(process.env.WISH_PRIVATE_KEY, 'private_key missing, please export with WISH_PRIVATE_KEY');
assert(process.env.WISH_CLIENT_EMAIL, 'client_email missing, please export with WISH_CLIENT_EMAIL');
assert(process.env.WISH_CLIENT_ID, 'client_id missing, please export with WISH_CLIENT_ID');
assert(process.env.WISH_AUTH_URI, 'auth_uri missing, please export with WISH_AUTH_URI');
assert(process.env.WISH_TOKEN_URI, 'token_uri missing, please export with WISH_TOKEN_URI');
assert(process.env.WISH_AUTH_PROVIDER_X509_CERT_URL, 'auth_provider_x509_cert_url missing, please export with WISH_AUTH_PROVIDER_X509_CERT_URL');
assert(process.env.WISH_CLIENT_X509_CERT_URL, 'client_x509_cert_url missing, please export with WISH_CLIENT_X509_CERT_URL');

const options = {
	type: process.env.WISH_ADMIN_CONFIG_TYPE,
	project_id: process.env.WISH_PROJECT_ID,
	private_key_id: process.env.WISH_PRIVATE_KEY_ID,
	private_key: process.env.WISH_PRIVATE_KEY,
	client_email: process.env.WISH_CLIENT_EMAIL,
	client_id: process.env.WISH_CLIENT_ID,
	auth_uri: process.env.WISH_AUTH_URI,
	token_uri: process.env.WISH_TOKEN_URI,
	auth_provider_x509_cert_url: process.env.WISH_AUTH_PROVIDER_X509_CERT_URL,
	client_x509_cert_url: process.env.WISH_CLIENT_X509_CERT_URL
};

module.exports = options;