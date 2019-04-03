import { Router, ActivatedRoute } from '@angular/router';
import { AppCsvDownloadService } from 'app/components';
import { CsvFormat } from 'app/components/app-csv/app-csv-model';
import { SessionFactory, SessionConfig } from 'app/sessionstorage/sessionfactory.service';
import { ToasterConfig, ToasterService } from 'angular2-toaster';

export abstract class ViewComponent {
  protected items: any[] = [];

  protected key_token: string = 'token';
  protected namespace: string = 'dongfeng';
  protected sessionFactory: SessionFactory = new SessionFactory(new SessionConfig(this.namespace, SessionFactory.DRIVERS.LOCAL));
  protected params: Object

  protected toasterconfig: ToasterConfig =
    new ToasterConfig({
      tapToDismiss: true,
      timeout: 5000,
    });

  constructor(protected router: Router, protected activatedRoute: ActivatedRoute, protected csvDownloader: AppCsvDownloadService, protected toasterService: ToasterService) {
    this.activatedRoute.params.subscribe((params) => {
      this.params = params;
    });
  }

  protected DownloadCsv = (filename?: string, format?: CsvFormat) => {
    filename = filename || (window.location.hash.replace('#/', '') || (this.activatedRoute.component as any).name) + '.csv';
    this.csvDownloader.WriteFormattedCSV(this.items, format, filename);
  };

  protected LogComplete = (msg: string) => {
    console.log(msg);
  };

  protected LogError = (err: string, msg: string) => {
    console.error(err);
    this.toasterService.pop('error', '', msg);
  };
}