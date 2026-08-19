export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  ActiveTask: undefined;
  TaskCompleted: {
    taskId: string;
    employeeName: string;
    taskTitle: string;
    duration: string;
    distance: string;
    destination: string;
    mapImageUrl?: string;
  };
};

export type MainTabParamList = {
  Home: undefined;
  History: undefined;
  Profile: undefined;
};

export interface TaskData {
  employeeName: string;
  designation: string;
  avatar?: string;
  status: string;
  gpsStatus: string;
  elapsedTime: string;
  taskTitle: string;
  trackingMessage: string;
  progress: number;
}