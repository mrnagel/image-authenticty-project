import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//add HttpEvent and HttpRequest later for progress bars (no need for current MVP)

export interface UploadResponse {
  jobId: string;
}

@Injectable({
  providedIn: 'root',
})

export class AnalysisService {
  constructor(private http: HttpClient) {}

  submitImage(file: File): Observable<UploadResponse> {
    const form = new FormData();
    form.append('image', file);

    return this.http.post<UploadResponse>(
      '/api/upload-image/', form
    );
  }
}
