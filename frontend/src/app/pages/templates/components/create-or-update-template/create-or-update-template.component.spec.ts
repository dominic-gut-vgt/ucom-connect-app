import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateOrUpdateTemplateComponent } from './create-or-update-template.component';

describe('CreateOrUpdateTemplateComponent', () => {
  let component: CreateOrUpdateTemplateComponent;
  let fixture: ComponentFixture<CreateOrUpdateTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrUpdateTemplateComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOrUpdateTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
