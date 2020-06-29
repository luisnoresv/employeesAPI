import {
  HandlerFunc,
  Context,
} from 'https://deno.land/x/abc@v1.0.0-rc10/mod.ts';
import storage from '../config/db_client.ts';
import { ErrorHandler } from '../middleware/errorMiddleware.ts';
import { EmployeeSchema, Employee } from '../models/employees.ts';

const database = storage.getDatabase;
const employees = database.collection('employees');

export const createEmployee: HandlerFunc = async (c: Context) => {
  try {
    if (c.request.headers.get('content-type') !== 'application/json') {
      throw new ErrorHandler('Invalid Body', 422);
    }

    const body: Employee = await c.body();
    if (!Object.keys(body).length) {
      throw new ErrorHandler('Request body can not be empty!', 400);
    }
    const { name, salary, age } = body;

    const newEmployee: Employee = {
      name,
      salary,
      age,
    };

    const { $oid } = await employees.insertOne(newEmployee);

    newEmployee.id = $oid;

    return c.json(newEmployee, 201);
  } catch (error) {
    throw new ErrorHandler(error.message, error.status || 500);
  }
};

export const fetchAllEmployees: HandlerFunc = async (c: Context) => {
  try {
    const fetchedEmployees: EmployeeSchema[] = await employees.find();

    if (fetchedEmployees) {
      const list: Employee[] = fetchedEmployees.length
        ? fetchedEmployees.map((employee) => {
            const {
              _id: { $oid },
              name,
              age,
              salary,
            } = employee;
            return { id: $oid, name, age, salary };
          })
        : [];
      return c.json(list, 200);
    }
  } catch (error) {
    throw new ErrorHandler(error.message, error.status || 500);
  }
};

export const fetchOneEmployee: HandlerFunc = async (c: Context) => {
  try {
    const { id } = c.params as { id: string };

    const fetchedEmployee: EmployeeSchema = await employees.findOne({
      _id: { $oid: id },
    });

    if (fetchedEmployee) {
      const {
        _id: { $oid },
        name,
        age,
        salary,
      } = fetchedEmployee;
      return c.json({ id: $oid, name, age, salary }, 200);
    }

    throw new ErrorHandler('Employee not found', 404);
  } catch (error) {
    throw new ErrorHandler(error.message, error.status || 500);
  }
};

export const updateEmployee: HandlerFunc = async (c: Context) => {
  try {
    const { id } = c.params as { id: string };
    if (c.request.headers.get('content-type') !== 'application/json') {
      throw new ErrorHandler('Invalid body', 422);
    }

    const body = (await c.body()) as Employee;

    if (!Object.keys(body).length) {
      throw new ErrorHandler('Request body can not be empty!', 400);
    }

    const fetchedEmployee: EmployeeSchema[] = await employees.findOne({
      _id: { $oid: id },
    });

    if (fetchedEmployee) {
      const { matchedCount } = await employees.updateOne(
        { _id: { $oid: id } },
        { $set: body }
      );
      if (matchedCount) {
        return c.string('Employee updated successfully!', 204);
      }
      return c.string('Unable to update employee');
    }
    throw new ErrorHandler('Employee not found', 404);
  } catch (error) {
    throw new ErrorHandler(error.message, error.status || 500);
  }
};

export const deleteEmployee: HandlerFunc = async (c: Context) => {
  try {
    const { id } = c.params as { id: string };

    const fetchedEmployee: EmployeeSchema = await employees.findOne({
      _id: { $oid: id },
    });

    if (fetchedEmployee) {
      const deleteCount = await employees.deleteOne({ _id: { $oid: id } });
      if (deleteCount) {
        return c.string('Employee deleted successfully!', 204);
      }
      throw new ErrorHandler('Unable to delete employee', 400);
    }

    throw new ErrorHandler('Employee not found', 404);
  } catch (error) {
    throw new ErrorHandler(error.message, error.status || 500);
  }
};
