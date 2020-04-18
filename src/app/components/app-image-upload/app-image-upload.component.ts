import { Component, ViewEncapsulation, Output, EventEmitter } from "@angular/core";
import { UserClient } from "app/clients";
import { ToasterConfig, ToasterService } from "angular2-toaster";

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-image-upload',
  templateUrl: 'app-image-upload.component.html',
  styleUrls: ['app-image-upload.component.scss', '../../../scss/vendors/toastr/toastr.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppImageUploadComponent {
  @Output()
  onImageUploaded: EventEmitter<string[]> = new EventEmitter<string[]>();

  selectedfile: ImageSnippet;
  title = "请选择图像";

  toasterconfig: ToasterConfig =
    new ToasterConfig({
      tapToDismiss: true,
      timeout: 5000,
    });

  constructor(private userClient: UserClient, private toasterService: ToasterService) {
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.title = "图像上传中 ... ";
      this.selectedfile = new ImageSnippet(event.target.result, file);
      this.userClient.uploadAvatar(this.selectedfile.file).subscribe(
        d => {          
          this.selectedfile.pending = false;
          this.selectedfile.status = 'ok';
          this.onImageUploaded.emit(d);
        },
        e => {
          console.error(e);
          this.toasterService.pop('error', '', "仅支持png或者jpeg格式");
          this.selectedfile.pending = false;
          this.selectedfile.status = 'fail';
          this.selectedfile.src = '';
        },
        () => {
          this.title = "请选择图像";
          console.log("image upload component uplaod completed");
        }
      )
    });

    try {
      reader.readAsDataURL(file);
    } catch { }
  }
}