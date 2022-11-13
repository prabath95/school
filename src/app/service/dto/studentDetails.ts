export class StudentDetails {
  id: number;
  content: string;
  attempts: {
    weeks: Array<string>;
    values: Array<number>;
  };
  student: string;
  time: string;
  skill: string;
  type: string;

  constructor(data: any) {
    this.id = data.id;
    this.content = data.content;
    this.attempts = data.attempts;
    this.student = data.student;
    this.time = data.time;
    this.skill = data.skill;
    this.type = data.type;
  }
}
