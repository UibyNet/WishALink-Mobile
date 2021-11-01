import {Component, OnInit} from '@angular/core';
import { CategoryApiService, CategoryListModel } from "../../../services/api.service";
import { AppService } from "../../../services/app.service";
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-add-category',
    templateUrl: './add-category.page.html',
    styleUrls: ['./add-category.page.scss'],
})
export class AddCategoryPage implements OnInit {
    categoryName: string;
    isHidden: boolean = false;
    previousUrl: string
    imgData: ArrayBuffer;
    catImage: string;
    catImageBlob: Blob;

    constructor(
        private appService: AppService,
        private categoryApiService: CategoryApiService,
        private navController: NavController,
    ) {
    }

    private setFirstLetterToUppercase(val: string): string {
        return val.split(' ').map(x => x.substring(0, 1).toUpperCase() + x.substring(1).toLowerCase()).join(' ')
    }

    onAutoFormatChangedCategoryName() {
        this.categoryName = this.setFirstLetterToUppercase(this.categoryName);
    }

    ngOnInit() {
    }

    save() {
        this.appService.toggleLoader(true).then(()=>{
            this.categoryApiService.create(0, this.categoryName, 0, this.isHidden, {fileName: '', data:  this.catImageBlob})
            .subscribe(
                v => this.onSave(v),
                e => this.onError(e)
            )
        })
        
    }

    onSave(v: CategoryListModel): void {
        this.appService.toggleLoader(false);
        this.appService.showToast('Kategori kaydedildi');
        this.navController.back();
    }

    onError(e: any): void {
        this.appService.toggleLoader(false);
        this.appService.showErrorAlert(e);
    }

    selectImage() {
        this.appService.getImage()
            .then(
                (imgData) => {
                    this.catImageBlob = imgData.blob;
                    this.catImage = `data:image/jpeg;base64,${imgData.photo.base64String}`;
                }
            );
    }
}
