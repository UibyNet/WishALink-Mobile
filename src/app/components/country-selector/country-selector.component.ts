import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { countries, CountryI, phoneMasks } from './countries';

@Component({
  selector: 'app-country-selector',
  templateUrl: './country-selector.component.html',
  styleUrls: ['./country-selector.component.scss'],
})
export class CountrySelectorComponent implements OnInit {
  @Input() selectedCountry: string;
  countries: CountryI[];
  page: number = 0;

  constructor(
    private appService: AppService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.countries = countries;
  }

  ionViewWillEnter() {
    this.appService.toggleStatusBar('light');

  }

  filterCountries(e: any) {
    let value = e.target.value;
    value = value.trim();
    if (value == '') {
      this.countries = countries;
      return;
    }
    value = value.toLowerCase();
    this.countries = countries.filter(x => x.name.toLowerCase().indexOf(value) > -1);
    this.page = 0;
  }

  selectCountry(value: CountryI) {
    this.selectedCountry = value.dialCode;

    const phoneMask = phoneMasks[value.isoCode.toUpperCase()];
    if (phoneMask != undefined && phoneMask.length > 0) {
      value.phoneMask = phoneMask.replace(/#/g, '0');
    }

    this.closeModal(value);
    console.log(value);
  }

  closeModal(data: CountryI = null) {
    this.modalController.dismiss(data);
  }

}
