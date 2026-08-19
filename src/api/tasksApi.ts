import { apiRequest } from './client';
import { getTokens } from '../auth/tokenStorage';

const BASE_URL = 'http://13.60.233.201/api/v1';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type Task = {
  id: string;
  clientTaskId: string;
  title: string;
  description: string;
  destination?: string | null;
  employeeId?: string | null;
  employee?: { id: string; name: string; department: string } | null;
  status: TaskStatus;
  startedAt?: string | null;
  endedAt?: string | null;
  startLatitude?: number | null;
  startLongitude?: number | null;
  endLatitude?: number | null;
  endLongitude?: number | null;
  distanceMeters?: number | null;
  durationSeconds?: number | null;
  amountReceived?: number;
  amountReturned?: number;
  netAmount?: number;
  vendorDetails?: string | null;
  submittedAt?: string | null;
  receipt?: {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    uploadedAt: string;
  } | null;
  createdAt: string;
};

export type GeoPoint = {
  latitude: number;
  longitude: number;
  recordedAt: string;
};

export type LocationPoint = {
  clientId: string;
  latitude: number;
  longitude: number;
  recordedAt: string;
  accuracyMeters?: number;
  isMoving?: boolean;
  batteryLevel?: number;
};

export type Employee = {
  id: string;
  name: string;
  department: string;
  isActive: boolean;
};

export type TaskStats = {
  tasks: { total: number; PENDING: number; IN_PROGRESS: number; COMPLETED: number; CANCELLED: number };
  completedToday: number;
  pendingSubmission: number;
  totalDistanceMeters: number;
  todayDistanceMeters : number;
   todayDurationSeconds: number;
  totalDurationSeconds: number;
  totalAmountReceived: number;
  totalAmountReturned: number;
  netAmount: number;
  reimbursementAmount: number;
};

// ---- Lifecycle: create → start → track → end ----

export async function createTask(params: {
  clientTaskId: string;
  title: string;
  description: string;
  destination?: string;
  employeeId?: string;
}): Promise<Task> {
  return apiRequest<Task>('/tasks', { method: 'POST', body: params });
}

export async function startTask(taskId: string, latitude: number, longitude: number): Promise<Task> {
  return apiRequest<Task>(`/tasks/${taskId}/start`, {
    method: 'POST',
    body: { latitude, longitude, recordedAt: new Date().toISOString() },
  });
}

export async function sendLocationBatch(
  taskId: string,
  points: LocationPoint[],
): Promise<{ accepted: number; received: number }> {
  return apiRequest(`/tasks/${taskId}/locations`, {
    method: 'POST',
    body: { points },
  });
}

export async function endTask(taskId: string, latitude: number, longitude: number): Promise<Task> {
  return apiRequest<Task>(`/tasks/${taskId}/end`, {
    method: 'POST',
    body: { latitude, longitude, recordedAt: new Date().toISOString() },
  });
}

export async function cancelTask(
  taskId: string,
  cancellationReason: string,
  latitude?: number,
  longitude?: number,
): Promise<Task> {
  return apiRequest<Task>(`/tasks/${taskId}/cancel`, {
    method: 'POST',
    body: {
      cancellationReason,
      ...(latitude !== undefined && longitude !== undefined
        ? { latitude, longitude, recordedAt: new Date().toISOString() }
        : {}),
    },
  });
}

// ---- Settlement & receipt ----

export async function updateSettlement(
  taskId: string,
  params: { amountReceived?: number; amountReturned?: number; vendorDetails?: string },
): Promise<Task> {
  return apiRequest<Task>(`/tasks/${taskId}/settlement`, { method: 'PATCH', body: params });
}

export async function uploadReceipt(
  taskId: string,
  fileUri: string,
  fileName: string,
  mimeType: string,
): Promise<Task> {
  const tokens = await getTokens();
  const form = new FormData();
  // @ts-ignore - RN's FormData accepts this uri/name/type shape for file uploads
  form.append('file', { uri: fileUri, name: fileName, type: mimeType });

  const response = await fetch(`${BASE_URL}/tasks/${taskId}/receipt`, {
    method: 'POST',
    headers: tokens ? { Authorization: `Bearer ${tokens.accessToken}` } : undefined,
    body: form,
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message ?? 'Receipt upload failed');
  }
  return json.data as Task;
}

export async function deleteReceipt(taskId: string): Promise<void> {
  await apiRequest(`/tasks/${taskId}/receipt`, { method: 'DELETE' });
}

export async function submitTask(taskId: string): Promise<Task> {
  return apiRequest<Task>(`/tasks/${taskId}/submit`, { method: 'POST' });
}

// ---- Reading ----

export async function getTasks(params?: {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  from?: string;
  to?: string;
  employeeId?: string;
  hasReceipt?: boolean;
  submitted?: boolean;
  search?: string;
}): Promise<{ items: Task[]; meta: { page: number; limit: number; total: number } }> {
  const query = params
    ? '?' +
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';
  return apiRequest(`/tasks${query}`, { method: 'GET' });
}

export async function getTaskById(taskId: string): Promise<Task & { route?: unknown }> {
  return apiRequest(`/tasks/${taskId}`, { method: 'GET' });
}

export async function getTaskStats(): Promise<TaskStats> {
  return apiRequest<TaskStats>('/tasks/stats', { method: 'GET' });
}

export async function getEmployees(search?: string): Promise<{ items: Employee[] }> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiRequest(`/employees${query}`, { method: 'GET' });
}