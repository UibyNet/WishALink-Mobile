import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.page.html',
    styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

    constructor() {
    }

    eventText: string = ''
    value: Date
    isOpenCalendar: boolean = false

    ngOnInit() {
    }

    calendarOpen() {
        this.isOpenCalendar = true

    }

    calendarClose() {
        this.isOpenCalendar = false
    }
}
