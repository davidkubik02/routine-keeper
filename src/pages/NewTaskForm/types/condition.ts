export type ConditionsType = {
  name: string;
  controled: boolean;
  minimum?: number;
  maximum?: number;
  unit?: string;
  range?: number;
  fulfilled: boolean;
};
