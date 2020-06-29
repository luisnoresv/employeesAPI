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

app
  .get('/employees', fetchAllEmployees)
  .post('/employees', createEmployee)
  .get('/employees/:id', fetchOneEmployee)
  .put('/employees/:id', updateEmployee)
  .delete('/employees/:id', deleteEmployee)
  .start({ port: 5000 });

console.log(SERVER_LISTENING);
