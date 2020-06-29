export interface EmployeeSchema {
  _id: {
    $oid: string;
  };
  name: string;
  age: number;
  salary: number;
}

export interface Employee {
  id?: string;
  name: string;
  age: number;
  salary: number;
}
