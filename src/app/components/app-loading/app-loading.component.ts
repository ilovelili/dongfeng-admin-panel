import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './app-loading.component.html',
  styleUrls: ['../../../../node_modules/spinkit/css/spinkit.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppLoadingComponent {
  @Input("hidden")
  public hidden: boolean;
}
