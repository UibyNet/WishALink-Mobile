import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StrangerSuggestionProductPage } from './stranger-suggestion-product.page';

describe('StrangerSuggestionProductPage', () => {
  let component: StrangerSuggestionProductPage;
  let fixture: ComponentFixture<StrangerSuggestionProductPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StrangerSuggestionProductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StrangerSuggestionProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
