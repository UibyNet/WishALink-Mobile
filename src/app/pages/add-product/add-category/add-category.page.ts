import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-add-category',
    templateUrl: './add-category.page.html',
    styleUrls: ['./add-category.page.scss'],
})
export class AddCategoryPage implements OnInit {
    categoryName: string;
    previousUrl: string

    constructor() {
    }

    private setFirstLetterToUppercase(val: string): string {
        return val.split(' ').map(x => x.substring(0, 1).toUpperCase() + x.substring(1).toLowerCase()).join(' ')
    }

    onAutoFormatChangedCategoryName() {
        this.categoryName = this.setFirstLetterToUppercase(this.categoryName);
    }

    ngOnInit() {
    }
}
