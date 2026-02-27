import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, takeWhile, timer } from 'rxjs';

//add HttpEvent and HttpRequest later for progress bars (no need for current MVP)

export type JobStatus = "queued" | "running" | "completed" | "failed";

export interface Job {
  jobId: string;
  status: JobStatus;
  filename: string;
  startedAt: number;
  error?: string | null;
}

@Injectable({
  providedIn: 'root',
})

export class AnalysisService {
  private readonly baseUrl = 'http://localhost:8000';
  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<Job> {
    const form = new FormData();
    form.append('image', file);
    return this.http.post<Job>(`${this.baseUrl}/upload-image/`, form);
  }

  getJob(jobId: string): Observable<Job> {
    return this.http.get<Job>(`${this.baseUrl}/job-status/${jobId}`);
  }

  pollJob(jobId: string, intervalMs = 2000): Observable<Job> {
    return timer(0, intervalMs).pipe(
      switchMap(() => this.getJob(jobId)),
      takeWhile(job => job.status !== 'completed' && job.status !== 'failed', true)
      
    );
  }
}
