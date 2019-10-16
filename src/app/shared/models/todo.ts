export class Todo {
  id?: string;
  description: string;
  complete: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(description: string) {
    this.description = description;
  }
}
