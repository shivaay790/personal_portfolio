import { startVitonFrontend, startVitonBackend, getStatus, stopAll } from './src/api/viton-spawner.js';
import { sendContactEmail } from './src/api/email-service.js';

export function vitonApiPlugin() {
  return {
    name: 'viton-api',
    configureServer(server) {
      server.middlewares.use('/api/start-viton-frontend', async (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { directory } = JSON.parse(body);
              const result = startVitonFrontend(directory);
              
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = result.success ? 200 : 500;
              res.end(JSON.stringify(result));
            } catch (error) {
              res.statusCode = 400;
              res.end(JSON.stringify({ 
                success: false, 
                message: 'Invalid request body',
                error: error.message 
              }));
            }
          });
        } else {
          next();
        }
      });

      server.middlewares.use('/api/start-viton-backend', async (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { directory } = JSON.parse(body);
              const result = startVitonBackend(directory);
              
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = result.success ? 200 : 500;
              res.end(JSON.stringify(result));
            } catch (error) {
              res.statusCode = 400;
              res.end(JSON.stringify({ 
                success: false, 
                message: 'Invalid request body',
                error: error.message 
              }));
            }
          });
        } else {
          next();
        }
      });

      server.middlewares.use('/api/viton-status', async (req, res, next) => {
        if (req.method === 'GET') {
          const status = getStatus();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(status));
        } else {
          next();
        }
      });

      server.middlewares.use('/api/stop-viton', async (req, res, next) => {
        if (req.method === 'POST') {
          const result = stopAll();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } else {
          next();
        }
      });

      // Contact form email endpoint
      server.middlewares.use('/api/send-contact-email', async (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', async () => {
            try {
              const formData = JSON.parse(body);
              const result = await sendContactEmail(formData);
              
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = result.success ? 200 : 500;
              res.end(JSON.stringify(result));
            } catch (error) {
              res.statusCode = 400;
              res.end(JSON.stringify({ 
                success: false, 
                message: 'Invalid request body',
                error: error.message 
              }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}
