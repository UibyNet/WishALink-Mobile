import {Component, OnInit} from '@angular/core';
import {filter, pairwise} from 'rxjs/operators';
import {NavigationEnd, Router, RoutesRecognized} from "@angular/router";

@Component({
    selector: 'app-add-category',
    templateUrl: './add-category.page.html',
    styleUrls: ['./add-category.page.scss'],
})
export class AddCategoryPage implements OnInit {
    categoryName: string;
    previousUrl: string

    constructor(
        private router: Router
    ) {
        router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                console.log('prev:', event.url);
                this.previousUrl = event.url;
            });
    }

    private setFirstLetterToUppercase(val: string): string {
        return val.split(' ').map(x => x.substring(0, 1).toUpperCase() + x.substring(1).toLowerCase()).join(' ')
    }

    onAutoFormatChangedCategoryName() {
        this.categoryName = this.setFirstLetterToUppercase(this.categoryName);
    }

    ngOnInit() {
    }

    prevPage() {
        if (this.previousUrl === '/add-product/add-category') {
            console.log(this.previousUrl)
            this.router.navigateByUrl('/add-product/add-category')
        } else {

            this.router.navigateByUrl('/tabs')
        }
    }
}
