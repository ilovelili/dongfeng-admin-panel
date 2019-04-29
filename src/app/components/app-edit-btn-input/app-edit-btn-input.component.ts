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
  }

  @Output()
  onSubmit: EventEmitter<any> = new EventEmitter<any>();

  edit(e: Event) {
    e.preventDefault()
    this.editModal.show();    
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
