import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DashboardService } from '../service/dashboard.service';
import { NotificationService } from '../../utils/notification.service';
import { Class } from '../../service/dto/class';
import { StudentDetails } from '../../service/dto/studentDetails';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass'],
})
export class SearchComponent implements OnInit {
  searchForm!: FormGroup;
  students: Array<string> = [];
  classData: Array<Class> = [];
  classDetails: Array<StudentDetails> = [];
  tableData: Array<StudentDetails> = [];
  classSummery: Array<any> = [];

  constructor(
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.createSignUpForm();
    this.getClassData();
  }

  createSignUpForm() {
    this.searchForm = this.formBuilder.group({
      class: [null],
      student: [null],
      startDate: [null],
      endDate: [null],
    });
  }

  get form() {
    return this.searchForm.controls;
  }

  validateField(field: any) {
    return (
      (this.form[field].touched || this.form[field].disabled) &&
      this.form[field].enabled &&
      this.form[field].errors
    );
  }

  formTouched(controlName: string): boolean {
    return this.form[controlName].touched || this.form[controlName].dirty;
  }

  progressClass(count: number): string {
    return `width : ${count}%`;
  }

  getClassStudentDetails(students: Array<string>) {
    const studentDetails = this.filterFromStudents(students);
    const data = this.calculateTableData(studentDetails);
    this.classSummery = data;
  }

  calculateTableData(detailList: Array<StudentDetails>) {
    let noOfStudents = this.form['class'].value.students.length;
    const subjects = [...new Set(detailList.map((item) => item.content))];
    const subjectSummery = [];
    for (const subject of subjects) {
      const studentCategory = {
        week: 0,
        ok: 0,
        good: 0,
        excellent: 0,
      };
      let assignedCount = 0;
      for (const detail of detailList) {
        if (subject === detail.content) {
          const latestAttemptValue =
            detail.attempts.values[detail.attempts.values.length - 1];
          if (latestAttemptValue >= 0 && latestAttemptValue <= 59) {
            assignedCount++;
            studentCategory.week += 1;
          } else if (latestAttemptValue >= 60 && latestAttemptValue <= 79) {
            assignedCount++;
            studentCategory.ok += 1;
          } else if (latestAttemptValue >= 80 && latestAttemptValue <= 89) {
            assignedCount++;
            studentCategory.good += 1;
          } else if (latestAttemptValue >= 90 && latestAttemptValue <= 100) {
            assignedCount++;
            studentCategory.good += 1;
          }
        }
      }

      subjectSummery.push({
        [subject]: {
          week: this.percentage(studentCategory.week, noOfStudents),
          ok: this.percentage(studentCategory.ok, noOfStudents),
          good: this.percentage(studentCategory.good, noOfStudents),
          excellent: this.percentage(studentCategory.excellent, noOfStudents),
          unassigned: this.percentage(
            noOfStudents - assignedCount,
            noOfStudents
          ),
        },
      });
    }
    return subjectSummery;
  }

  getObjectKey(object: any) {
    return Object.keys(object)[0];
  }

  percentage(partialValue: number, totalValue: number) {
    return ((100 * partialValue) / totalValue).toFixed(0);
  }

  getClassData() {
    const subscription = this.dashboardService.getClassData().subscribe({
      next: (data) => {
        if (data.data && data.data.length > 0) {
          this.classData = data.data;
          this.getClassDetails();
        }
        subscription.unsubscribe();
      },
      error: () => {
        this.notificationService.errorMessage('Error loading class data.');
        subscription.unsubscribe();
      },
    });
  }

  classChange() {
    this.students = this.form['class'].value.students;
    this.getClassStudentDetails(this.students);
    this.tableData = [];
  }

  changeStudent() {
    this.tableData = this.filterFromStudents([this.form['student'].value]);
  }

  getClassDetails() {
    const subscription = this.dashboardService.getClassDetails().subscribe({
      next: (data) => {
        this.classDetails = JSON.parse(data.data.body);
        this.form['class'].setValue(this.classData[0]);
        this.classChange();
        subscription.unsubscribe();
      },
      error: () => {
        this.notificationService.errorMessage('Error loading class data.');
        subscription.unsubscribe();
      },
    });
  }

  formatDate(date: string) {
    const value = date.split('/');
    const dateValue = '20' + value[2] + '-' + value[1] + '-' + value[0];
    return new Date(dateValue);
  }

  filterFromStudents(studentList: Array<string>): Array<StudentDetails> {
    console.log(studentList);
    return this.classDetails.filter((value) =>
      studentList.find((student) => student == value.student)
    );
  }
}
