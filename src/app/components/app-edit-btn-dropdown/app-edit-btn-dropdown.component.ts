import { Component, Input, ViewEncapsulation, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-edit-btn-dropdown',
  templateUrl: './app-edit-btn-dropdown.component.html',
  styleUrls: ['./app-edit-btn-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppEditButtonDropDownComponent {
  @ViewChild('editModal') editModal

  @Input("items")
  public items: any[];
  
  @Input("fields")
  public fields: string[];

  editcriteria = {
    name: "姓名",
    class: "班级",
    attendance: "出勤",
  }

  item: any;

  setitem(key: string, value: any, item: any) {
    this.item = item;
    this.item[key] = value;
    this.editcriteria[key] = value;
  }

  @Output()
  onItemSelected: EventEmitter<any> = new EventEmitter<any>();

  edit(e: Event) {
    e.preventDefault()
    this.editModal.show();    
  }

  submit() {
    this.onItemSelected.emit(this.item);
    this.editModal.hide();
  }
}
