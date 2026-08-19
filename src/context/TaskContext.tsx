import React, { createContext, useContext, useRef, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as tasksApi from '../api/tasksApi';
import { Task, LocationPoint } from '../api/tasksApi';
import { startTracking, stopTracking } from '../location/locationTracker';

type TaskContextType = {
  activeTask: Task | null;
  createAndStartTask: (params: {
    title: string;
    description: string;
    destination?: string;
    employeeId?: string;
    latitude: number;
    longitude: number;
  }) => Promise<Task>;
  endActiveTask: (latitude: number, longitude: number) => Promise<Task>;
  cancelActiveTask: (reason: string, latitude?: number, longitude?: number) => Promise<void>;
  clearActiveTask: () => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const BATCH_INTERVAL_MS = 30000; // flush buffered points every 30s
const BATCH_SIZE_TRIGGER = 50; // or flush early if the buffer gets this big

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const bufferRef = useRef<LocationPoint[]>([]);
  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const taskIdRef = useRef<string | null>(null);

  const flushBuffer = async () => {
    console.log('⏰ Flush triggered. Buffer length:', bufferRef.current.length, 'taskId:', taskIdRef.current);
    if (!taskIdRef.current || bufferRef.current.length === 0) return;
    const pointsToSend = bufferRef.current;
    bufferRef.current = [];
    try {
      await tasksApi.sendLocationBatch(taskIdRef.current, pointsToSend);
    } catch (error) {
      // Send failed — put the points back so the next flush retries them.
      // Each point's clientId means a retried batch is safely deduplicated server-side.
      bufferRef.current = [...pointsToSend, ...bufferRef.current];
      console.warn('Location batch flush failed, will retry:', error);
    }
  };

  const handlePoint = (point: LocationPoint) => {
    console.log('📍 Point captured:', JSON.stringify(point));
    bufferRef.current.push(point);
    console.log('📦 Buffer size now:', bufferRef.current.length);
    if (bufferRef.current.length >= BATCH_SIZE_TRIGGER) {
      flushBuffer();
    }
  };

  const createAndStartTask: TaskContextType['createAndStartTask'] = async params => {
    const clientTaskId = uuidv4();
    const created = await tasksApi.createTask({
      clientTaskId,
      title: params.title,
      description: params.description,
      destination: params.destination,
      employeeId: params.employeeId,
    });

    const started = await tasksApi.startTask(created.id, params.latitude, params.longitude);
    setActiveTask(started);
    taskIdRef.current = started.id;

    await startTracking(handlePoint);
    flushTimerRef.current = setInterval(flushBuffer, BATCH_INTERVAL_MS);

    return started;
  };

  const endActiveTask: TaskContextType['endActiveTask'] = async (latitude, longitude) => {
    if (!taskIdRef.current) throw new Error('No active task to end');

    stopTracking();
    if (flushTimerRef.current) clearInterval(flushTimerRef.current);
    await flushBuffer(); // final flush — doc confirms late points are still accepted for 10 min

    const ended = await tasksApi.endTask(taskIdRef.current, latitude, longitude);
    setActiveTask(ended);
    return ended;
  };

  const cancelActiveTask: TaskContextType['cancelActiveTask'] = async (
    reason,
    latitude,
    longitude,
  ) => {
    if (!taskIdRef.current) return;
    stopTracking();
    if (flushTimerRef.current) clearInterval(flushTimerRef.current);
    await tasksApi.cancelTask(taskIdRef.current, reason, latitude, longitude);
    clearActiveTask();
  };

  const clearActiveTask = () => {
    setActiveTask(null);
    taskIdRef.current = null;
    bufferRef.current = [];
  };

  return (
    <TaskContext.Provider
      value={{ activeTask, createAndStartTask, endActiveTask, cancelActiveTask, clearActiveTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTask must be used within a TaskProvider');
  return context;
};