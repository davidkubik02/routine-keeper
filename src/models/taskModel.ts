import { ConditionsType } from "../pages/NewTaskForm/types/condition";

export interface TaskModel {
  id?: string;
  name: string;
  description: string;
  plannedTime: number;
  deadline: number;
  compleated: boolean;
  compleatedInTime: boolean;
  conditions: ConditionsType[];
  value: value;
}

export type value = 1 | 2 | 3;
