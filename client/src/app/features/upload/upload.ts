import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-upload',
  imports: [FileUpload, ButtonModule, FileUploadModule, ProgressBarModule],
  templateUrl: './upload.html',
  styleUrl: './upload.scss',
})
export class Upload {

}
