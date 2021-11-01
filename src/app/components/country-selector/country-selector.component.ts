import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { countries, CountryI, phoneMasks } from './countries';

@Component({
  selector: 'app-country-selector',
  templateUrl: './country-selector.component.html',
  styleUrls: ['./country-selector.component.scss'],
})
export class CountrySelectorComponent implements OnInit, AfterViewInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  @Input() selectedCountry: string;
  countries: CountryI[];
  pagedCountries: CountryI[];
  page: number = 0;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.countries = countries;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadData(null);
    }, 200);
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
    this.loadData(null);
  }

  loadData(event) {
    this.infiniteScroll.complete();
    this.page++;

    this.pagedCountries = this.countries.slice(0, this.page*20);
    if (this.pagedCountries.length == this.countries.length) {
      this.infiniteScroll.disabled = true;
    }
  }

  selectCountry(value: CountryI) {
    this.selectedCountry = value.dialCode;

    const phoneMask = phoneMasks[value.isoCode.toUpperCase()];
    if (phoneMask != undefined && phoneMask.length > 0) {
      value.phoneMask = phoneMask.replace(/#/g, '9');
    }

    this.closeModal(value);
    console.log(value);
  }

  closeModal(data: CountryI = null) {
    this.modalController.dismiss(data);
  }

}
