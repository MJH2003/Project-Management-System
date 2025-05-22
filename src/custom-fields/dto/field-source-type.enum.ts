export enum FieldSourceType {
  PROJECT_MEMBERS = 'PROJECT_MEMBERS',
  PROJECT_TASKS = 'PROJECT_TASKS',
  PROJECTS = 'PROJECTS'
}

export type FieldSourceOptions = {
  [FieldSourceType.PROJECT_MEMBERS]: {
    id: string;
    name: string;
    email: string;
  }[];
  [FieldSourceType.PROJECT_TASKS]: {
    id: string;
    title: string;
    status: string;
  }[];
  [FieldSourceType.PROJECTS]: {
    id: string;
    name: string;
    description: string;
  }[];
};
