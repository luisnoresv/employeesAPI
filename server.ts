import { Application } from 'https://deno.land/x/abc@v1.0.0-rc10/mod.ts';
import 'https://deno.land/x/denv/mod.ts';
import { ErrorMiddleware } from './middleware/errorMiddleware.ts';
import { SERVER_LISTENING } from './utils/appConstants.ts';
import {
  fetchAllEmployees,
  createEmployee,
  fetchOneEmployee,
  updateEmployee,
  deleteEmployee,
} from './controllers/employees.controller.ts';

const app = new Application();

app.use(ErrorMiddleware);

const port = Deno.env.get('PORT') || 5000;

app
  .get('/api/v1/employees', fetchAllEmployees)
  .post('/api/v1/employees', createEmployee)
  .get('/api/v1/employees/:id', fetchOneEmployee)
  .put('/api/v1/employees/:id', updateEmployee)
  .delete('/api/v1/employees/:id', deleteEmployee)
  .start({ port: +port });

console.log(SERVER_LISTENING);
