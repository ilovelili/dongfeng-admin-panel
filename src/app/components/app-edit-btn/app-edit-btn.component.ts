import { Component, Input, ViewEncapsulation, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-edit-btn',
  templateUrl: './app-edit-btn.component.html',
  styleUrls: ['./app-edit-btn.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppEditButtonComponent {
  @ViewChild('editModal', { static: false }) editModal: ModalDirective

  @Input("title")
  public title: string;

  @Input("item")
  public item: any;

  @Input("fields")
  public fields: string[];

  @Input("hiddenFields")
  public hiddenFields: string[] = [];

  isHiddenField(field: string): boolean {
    return this.hiddenFields.includes(field);
  }

  editcriteria = {
    year: "学年",
    name: "姓名",
    class: "班级",
    email: "邮箱",
    gender: '性别',
    birth_date: '出生日期',
    exam_date: '体检日期',
    height: '身高',
    weight: '体重',
    alias: '匹配名',
  }

  @Output()
  onSubmit: EventEmitter<any> = new EventEmitter<any>();

  edit(e: Event) {
    e.preventDefault();
    this.editModal.show();
  }

  close() {
    this.editModal.hide();
  }

  submit(form: any) {
    // append id if exists
    if (this.item.id) {
      form.id = this.item.id;
    }

    this.onSubmit.emit(form);
    this.editModal.hide();
  }
}
