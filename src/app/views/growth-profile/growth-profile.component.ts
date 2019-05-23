import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { ProfileClient } from 'app/clients';
import { ToasterService } from 'angular2-toaster';

declare var grapesjs: any;

@Component({  
  templateUrl: './growth-profile.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',    
    './growth-profile.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class GrowthProfileComponent extends ViewComponent implements OnInit {  
  constructor(private profileClient: ProfileClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    const editor = grapesjs.init({
      container : '#profile',
      components: '<div class="txt-red">Hello world!</div>',
      style: '.txt-red{color: red}',
    });

    // const blockManager = editor.BlockManager;

    // return this.http.get('http://raeber.nie-ine.ch:3333/v1/vocabularies')
    //   .map(
    //     (lambda: Response) => {
    //       const data = lambda.json();
    //       for ( const vocabulary of data.vocabularies) {
    //         this.data += this.openDiv + vocabulary.shortname + this.closeDiv;
    //       }
    //       console.log(this.data);

    //       blockManager.add('konvolut-titel', {
    //         label: 'Vokabulare in Knora',
    //         attributes: { class:'fa fa-newspaper-o' },
    //         content:  this.data,
    //       });
    //       return null;
    //     }
    //   )
    //   .subscribe(response => response = response);
  }
}
