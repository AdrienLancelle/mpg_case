import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import {Express} from 'express';
import path from 'path';
import logger from '@logger';

export function setupSwagger(app: Express) {
  const swaggerDocument = yaml.load(path.resolve(__dirname, '../config/swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  logger.info('Swagger disponible sur http://localhost:3000/');
}
