import {Component, OnInit} from '@angular/core';
import {IonIntlTelInputModel} from 'ion-intl-tel-input';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  stepper = 1;
  categories = [
    {
      id: 1,
      text: 'Çiçek'
    },
    {
      id: 2,
      text: 'Teknoloji'
    },
    {
      id: 3,
      text: 'Ev Eşyası'
    },
    {
      id: 4,
      text: 'Saç Bakım'
    },
    {
      id: 5,
      text: 'Araba Aksesuarı'
    }, {
      id: 6,
      text: 'Bahçe Ürünleri'
    },
    {
      id: 7,
      text: 'Kozmetik'
    },
    {
      id: 8,
      text: 'Tekstil'
    },
    {
      id: 9,
      text: 'Spor Ürünleri'
    },
    {
      id: 10,
      text: 'Mutfak Ürünleri'
    },
    {
      id: 11,
      text: 'Mobilya'
    },
    {
      id: 12,
      text: 'Çiçek'
    }
  ];
  selectedProducts = [];
  name: string;
  surname: string;
  phone: IonIntlTelInputModel = {
    dialCode: '+90',
    internationalNumber: '+92 300 1234567',
    isoCode: 'tr',
    nationalNumber: '300 1234567'
  };
  formValue = {phoneNumber: this.phone};
  form: FormGroup;

  constructor() {
  }

  ngOnInit() {
    this.form = new FormGroup({
      phoneNumber: new FormControl({
        value: this.formValue.phoneNumber
      })
    });
  }

  private setFirstLetterToUppercase(val: string): string {
    return val.split(' ').map(x => x.substring(0, 1).toUpperCase() + x.substring(1).toLowerCase()).join(' ')
  }

  onAutoFormatChangedName() {
    this.name = this.setFirstLetterToUppercase(this.name);
  }

  onAutoFormatChangedSurname() {
    this.surname = this.setFirstLetterToUppercase(this.surname);
  }

  onCodeChanged(code: string) {
  }

  selectProduct(id) {
    const key = this.selectedProducts.indexOf(id);
    if (key > -1) {
      this.selectedProducts.splice(key, 1);
      return;
    }
    this.selectedProducts.push(id);
  }

  // this called only if user entered full code
  onCodeCompleted(code: string) {
  }
}
