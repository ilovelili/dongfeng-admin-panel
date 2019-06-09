import { Component, Input, ViewEncapsulation, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-edit-btn',
  templateUrl: './app-edit-btn.component.html',
  styleUrls: ['./app-edit-btn.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppEditButtonComponent {
  @ViewChild('editModal') editModal

  @Input("title")
  public title: string;

  @Input("item")
  public item: any;
  
  @Input("fields")
  public fields: string[];

  editcriteria = {    
    year: "学年",
    name: "姓名",
    class: "班级",
    email: "邮件",
    gender: '性别',
    birth_date: '出生日期',
    exam_date: '体检日期',
    height: '身高',
    weight: '体重',
    alias: '匹配名',
  }

  @Output()
  onSubmit: EventEmitter<any> = new EventEmitter<any>();

  private original: Object = {};  

  edit(e: Event) {
    e.preventDefault();

    // copy by value so that original will save the item before edited
    for (let k in this.item) {
      this.original[k] = this.item[k];
    }
    
    this.editModal.show();    
  }

  close(e: Event) {
    // revert on close modal.
    for (let k in this.original) {
      this.item[k] = this.original[k];
    }
    
    this.editModal.hide();
  }

  submit(form: any) {
    // append id if exists
    if (this.item.id) {
      form.id = this.item.id;
    }

    // add original for easy rollback when error happens
    form.original = this.original;

    this.onSubmit.emit(form);
    this.editModal.hide();
  }
}
