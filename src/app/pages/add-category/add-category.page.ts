import { Component, NgZone, OnInit } from "@angular/core";
import {
  CategoryApiService,
  CategoryEditModel,
  CategoryListModel,
  CommonApiService,
} from "../../services/api-wishalink.service";
import { NavController } from "@ionic/angular";
import { AppService } from "src/app/services/app.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-add-category",
  templateUrl: "./add-category.page.html",
  styleUrls: ["./add-category.page.scss"],
})
export class AddCategoryPage implements OnInit {
  categoryName: string;
  isHidden: boolean = false;
  previousUrl: string;
  imgData: ArrayBuffer;
  catImage: string;
  catImageBlob: Blob = new Blob();
  categoryId: number = 0;
  isLoading: boolean = false;
  mediaId: number;

  constructor(
    private zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private categoryApiService: CategoryApiService,
    private commonApiService: CommonApiService,
    private navController: NavController
  ) {}

  private setFirstLetterToUppercase(val: string): string {
    return val
      .split(" ")
      .map(
        (x) => x.substring(0, 1).toUpperCase() + x.substring(1).toLowerCase()
      )
      .join(" ");
  }

  onAutoFormatChangedCategoryName() {
    this.categoryName = this.setFirstLetterToUppercase(this.categoryName);
  }
  ionViewWillEnter() {
    this.appService.toggleStatusBar("dark");
    this.appService.setStatusBarBackground("primary");
  }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    this.categoryId = parseInt(id);

    const category = this.router.getCurrentNavigation().extras
      .state as CategoryListModel;
    if (category != null) {
      this.categoryName = category.name;
      this.isHidden = category.isHidden;
      this.catImage = category.mediaUrl;
    }
  }

  saveCategory() {
    this.isLoading = true;
    if (this.categoryName == null || this.categoryName.length == 0) {
      this.appService.showToast("Lütfen geçerli bir ad yazın.");
      this.isLoading = false;
      return;
    }
    if (this.mediaId == null || this.mediaId == 0) {
      this.appService.showToast("Lütfen kategori görseli ekleyin.");
      this.isLoading = false;
      return;
    }

    const model = new CategoryEditModel();
    model.id = this.categoryId;
    model.name = this.categoryName;
    model.order = 0;
    model.mediaId = this.mediaId;
    model.isHidden = this.isHidden;

    this.appService.toggleLoader(true).then(() => {
      if (this.categoryId > 0) {
        this.categoryApiService.update(model).subscribe(
          (v) => this.onUpdate(v),
          (e) => this.onError(e)
        );
      } else {
        this.categoryApiService.create(model).subscribe(
          (v) => this.onSave(v),
          (e) => this.onError(e)
        );
      }
    });
  }

  deleteCategory() {
    this.categoryApiService.delete(this.categoryId).subscribe(
      (v) => this.onDelete(),
      (e) => this.onError(e)
    );
  }

  onSave(v: CategoryListModel): void {
    this.zone.run(() => {
      this.isLoading = false;
      this.appService.userCategories.push(v);
      this.appService.toggleLoader(false);
      this.appService.showToast("Kategori kaydedildi");
      this.navController.back();
    });
  }

  onUpdate(v: CategoryListModel): void {
    this.zone.run(() => {
      this.isLoading = false;
      const index = this.appService.userCategories.findIndex(
        (x) => x.id === this.categoryId
      );
      this.appService.userCategories[index] = v;
      this.appService.toggleLoader(false);
      this.appService.showToast("Kategori kaydedildi");
      this.navController.back();
    });
  }

  onDelete(): void {
    this.zone.run(() => {
      this.appService.userCategories = this.appService.userCategories.filter(
        (x) => x.id !== this.categoryId
      );
      this.appService.showToast("Kategori silindi.");
      this.navController.navigateRoot("/app/profile/me");
    });
  }

  onError(e: any): void {
    this.zone.run(() => {
      this.isLoading = false;
      this.appService.toggleLoader(false);
      this.appService.showErrorAlert(e);
    });
  }

  selectImage() {
    this.appService.getImage().then((imgData) => {
      this.zone.run(() => {
        this.catImageBlob = imgData.blob;
        this.catImage = `data:image/jpeg;base64,${imgData.photo.base64String}`;
        this.saveImage();
      });
    });
  }

  saveImage() {
    this.commonApiService
      .uploadmedia({ fileName: "", data: this.catImageBlob })
      .subscribe(
        (v) => {
          this.mediaId = v.id;
        },
        (e) => this.appService.showErrorAlert(e)
      );
  }

  goBack() {
    this.navController.back();
  }
}
