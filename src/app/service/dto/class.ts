export class Class {
  id: string;
  students: Array<string>;
  name: string;

  constructor(data: any) {
    this.id = data.id;
    this.students = data.students;
    this.name = data.name;
  }
}
