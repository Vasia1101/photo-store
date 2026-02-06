'use strict';

/**
 * download-token service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::download-token.download-token');
