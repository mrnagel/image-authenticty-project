import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-upload',
  imports: [FileUpload],
  templateUrl: './upload.html',
  styleUrl: './upload.scss',
})
export class Upload {

}
