'use strict';

class ApiSecretFactory {
	createTenantSecret(tenant) {
		var token = jwt.sign({
    	auth:  'magic',
    	agent: 'x-cdsp-tenant',
			name: tenant.name,
    	exp:   Math.floor(new Date().getTime()/1000) + 7*24*60*60 // Note: in seconds!
  	}, tenant.apiKey);  // secret is defined in the environment variable JWT_SECRET
  	return token;
	}

	createApplicationSecret(application) {
		var token = jwt.sign({
    	auth:  'magic',
    	agent: 'x-cdsp-tenant',
			name: application.name,
			tenantId: application.tenantId,
    	exp:   Math.floor(new Date().getTime()/1000) + 7*24*60*60 // Note: in seconds!
  	}, tenant.apiKey);  // secret is defined in the environment variable JWT_SECRET
  	return token;
	}
}

module.exports = ApiSecretFactory;