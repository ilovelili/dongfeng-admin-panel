import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ClassClient } from 'app/clients/class.client';
import { Classes } from 'app/models';
import { ToasterService } from 'angular2-toaster';

const classes_template = [
  {
    id: 1,
    class: "小一班",
  },
  {
    id: 2,
    class: "中二班",    
  },
  {
    id: 3,
    class: "大一班",
  },
  {
    id: 4,
    class: "大二班",
  },
];

@Component({  
  templateUrl: 'class.component.html',
  styleUrls: [
    '../../../scss/vendors/file-uploader/file-uploader.scss', 
    '../../../scss/vendors/toastr/toastr.scss',
    'class.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ClassComponent extends ViewComponent implements OnInit {  
  classinfos: Classes;

  constructor(private classClient: ClassClient, protected router: Router, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, activatedRoute, toasterService);
  }  

  ngOnInit(): void {
    this.initfileuploader(this.fileUploader1, 'classes', '班级', this.getclasses);
    this.initfileuploader(this.fileUploader2, 'classes', '班级', this.getclasses);
    this.getclasses();
  }
  
  getclasses() {    
    this.classClient.getClasses().
    subscribe(
      d => {        
        this.classinfos = new Classes(d.classes);
        if (this.classinfos.empty()) {
          this.infoModal.show();
          this.items = classes_template;
        } else {
          this.items = this.classinfos.classes;
        }
      },
      e => this.LogError(e, '获取班级信息失败，请重试'),
      () => this.LogComplete('class component classes loading completed')
    );
  }
}
