import { Component, Input, ViewEncapsulation, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-edit-btn-input',
  templateUrl: './app-edit-btn-input.component.html',
  styleUrls: ['./app-edit-btn-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppEditButtonInputComponent {
  @ViewChild('editModal') editModal

  @Input("title")
  public title: string;

  @Input("item")
  public item: any;
  
  @Input("fields")
  public fields: string[];

  editcriteria = {
    name: "姓名",
    class: "班级",
    email: "邮件",
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
