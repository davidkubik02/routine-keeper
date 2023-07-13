interface TaskModel {
  id?: string;
  name: string;
  description: string;
  plannedTime: number;
  deadline: number;
  compleated: boolean;
  compleatedInTime: boolean;
  conditions: string[];
}
export { TaskModel };
