import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeesService } from '../services/employees.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  @ViewChild('empModal') empModal: ElementRef;
  public employeeList:any=[];
  submitted = false;
  employeeForm: FormGroup;
  empIndex: number;
  editMode: boolean = false;
  isLoader: boolean = true;
  //pagination and filter config
  config = {itemsPerPage: 10,currentPage: 1};
  public searchText: string;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private empService: EmployeesService) { }

  ngOnInit(): void {
    this.createDummyEmps();
    this.getEmpRecords();
    this.employeeForm = this.fb.group({
      empName: ['', [Validators.required,Validators.pattern("^[a-zA-Z0-9 ]+$")]],
      empEmail: ['', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      empSalary: ['', [Validators.required,Validators.pattern("^[0-9]+$")]]
    });
    setTimeout(()=>{
      this.isLoader = false;
    },3000);
  }
  getEmpRecords() {
    this.employeeList = this.empService.getAllEmp();
  }
  get f() { return this.employeeForm.controls; }
  openModal() {
    this.editMode = false;
    this.employeeForm.reset();
    this.modalService.open(this.empModal);
  }
  submitEmpForm() {
    let formData = JSON.stringify(this.employeeForm.value);
    this.submitted = true;
    if (this.employeeForm.invalid) {
      return;
    }
    if (!this.editMode) {
      this.empService.addEmployee(this.employeeForm.value);
      this.resetFormUpdateStatus();
    } else {
      this.empService.updateEmployee(formData, this.empIndex);
      this.resetFormUpdateStatus();
    }
  }
  editEmp(index) {
    this.editMode = true;
    this.empIndex = index;
    this.modalService.open(this.empModal);
    let empData = this.employeeList[index];
    this.employeeForm.patchValue({
      empName: empData.empName,
      empEmail: empData.empEmail,
      empSalary: empData.empSalary,
    })
  }
  removeEmp(index) {
    Swal.fire({
      title: 'Are you sure want to delete this record?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.empService.deleteEmp(index);
        this.getEmpRecords();
        Swal.fire(
          'Deleted!',
          'Employee record have been deleted successfully.',
          'success'
        );
      }
    })
  }
  pageChange(event) {
    this.config.currentPage = event;
  }

  createDummyEmps() {
    const empArr = [];
    let i = 0;
    for (i; i < 45; i++) {
      let empObj = { 'empName': `sajjad09${i + 1}`, 'empEmail': `sajjad${i + 2}@gmail.com`, 'empSalary': `100${i + 20}` };
      empArr.push(empObj);
    }
    localStorage.setItem('empDetails', JSON.stringify(empArr));
  }

  clearAllRecords() {
    Swal.fire({
      title: 'Are you sure want to delete all employees records?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem('empDetails', JSON.stringify([]));
        this.getEmpRecords();
        Swal.fire(
          'Deleted!',
          'All employee records have been deleted successfully.',
          'success'
        );
      }
    })
  }
  resetFormUpdateStatus(){
    this.modalService.dismissAll(this.empModal);
    this.getEmpRecords();
    this.employeeForm.reset();
    this.submitted = false;
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: `Employee record ${this.editMode ? 'updated':'added'} successfully..`,
    })
  }
  trackByEmpName(index,empObj){
    return empObj.empName; 
 }
}
