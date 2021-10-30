import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';
import { ActivityApiService, ActivityEditModel, ActivityListModel } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {

  name: string;
  categoryId: number;
  isHidden: boolean;
  startDate: Date;
  endDate: Date;
  description: string;

  constructor(
    private appService: AppService,
    private activityApiService: ActivityApiService,
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  saveActivity() {
    const model = new ActivityEditModel();
    model.name = this.name;
    model.startDate = moment(this.startDate).format('DD.MM.YYYY HH:mm');
    model.endDate = moment(this.endDate).format('DD.MM.YYYY HH:mm');
    model.isHidden = this.isHidden;
    model.description = this.description;

    this.activityApiService.create(model)
      .subscribe(
        v => this.onSave(v),
        e => this.onError(e)
      )
  }

  onSave(v: ActivityListModel): void {
    this.appService.showToast('Etkinlik kaydedildi.');
    this.navController.back();
  }

  onError(e: any): void {
    this.appService.showErrorAlert(e);
  }

}
