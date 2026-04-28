import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, takeWhile, timer } from 'rxjs';

export type JobStatus = "queued" | "running" | "completed" | "failed";

// Mirror the Job model defined in APIController.py
export interface Job {
  jobId: string;
  status: JobStatus;
  filename: string;
  startedAt: number;
  error?: string | null;
  result?: string | null;
}

@Injectable({
  providedIn: 'root',
})

export class AnalysisService {
  private readonly baseUrl = 'http://localhost:8000';
  constructor(private http: HttpClient) {}

  //upload image, return Job with an initial status
  uploadImage(file: File): Observable<Job> {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<Job>(`${this.baseUrl}/upload-image/`, form);
  }

  getJob(jobId: string): Observable<Job> {
    return this.http.get<Job>(`${this.baseUrl}/job-status/${jobId}`);
  }
  
  //poll /job-status every intervalMs milliseconds
  pollJob(jobId: string, intervalMs = 2000): Observable<Job> {
    return timer(0, intervalMs).pipe(
      switchMap(() => this.getJob(jobId)),
      takeWhile(job => job.status !== 'completed' && job.status !== 'failed', true)

    );
  }

  getHeatmapUrl(): string {
    return `${this.baseUrl}/heatmap`;
  }

  getOriginalImageUrl(): string {
    return `${this.baseUrl}/original-image`;
  }
}
