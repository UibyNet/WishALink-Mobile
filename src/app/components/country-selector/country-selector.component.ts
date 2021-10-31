import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { countries, CountryI, phoneMasks } from './countries';

@Component({
  selector: 'app-country-selector',
  templateUrl: './country-selector.component.html',
  styleUrls: ['./country-selector.component.scss'],
})
export class CountrySelectorComponent implements OnInit {

  @Input() selectedCountry: string;
  countries: CountryI[];

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.countries = countries;
  }

  filterCountries(value: string) {
    value = value.trim();
    if(value == '') {
      this.countries = countries;
      return;
    }
    value = value.toLowerCase();
    this.countries = countries.filter(x => x.name.toLowerCase().indexOf(value) > -1);
  }

  selectCountry(value: CountryI) {
    this.selectedCountry = value.dialCode;

    const phoneMask = phoneMasks[value.isoCode.toUpperCase()];
    if(phoneMask != undefined && phoneMask.length > 0){
      value.phoneMask = phoneMask.replace(/#/g, '9');
    }

    this.closeModal(value);
    console.log(value);   
  }

  closeModal(data: CountryI = null) {
    this.modalController.dismiss(data);
  }

}
