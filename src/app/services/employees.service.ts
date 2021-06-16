import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor() { }
  //inserting employee record in localStorage
  addEmployee(formData) {
    let emps = JSON.parse(localStorage.getItem('empDetails'));
    if (emps == null) {
      let initialVal: any = [formData];
      localStorage.setItem('empDetails', JSON.stringify(initialVal));
    } else {
      emps.push(formData);
      localStorage.setItem('empDetails', JSON.stringify(emps));
    }
  }

  //fetching all employee records from localStorage
  getAllEmp() {
    let empRecords = JSON.parse(localStorage.getItem('empDetails'));
    return empRecords;
  }
  
  //updating employee record in localStorage based on index
  updateEmployee(empObj, index) {
    let emps = JSON.parse(localStorage.getItem('empDetails'));
    emps[index] = JSON.parse(empObj);
    localStorage.setItem('empDetails', JSON.stringify(emps));
  }
  //deleting employee record from localStorage based on index using splice() method
  deleteEmp(index) {
    let emps = JSON.parse(localStorage.getItem('empDetails'));
    emps.splice(index, 1);
    localStorage.setItem('empDetails', JSON.stringify(emps));
  }

}
