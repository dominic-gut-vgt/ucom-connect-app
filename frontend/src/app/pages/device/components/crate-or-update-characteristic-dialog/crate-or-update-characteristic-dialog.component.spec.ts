import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CrateOrUpdateCharacteristicDialogComponent } from './crate-or-update-characteristic-dialog.component';

describe('CrateOrUpdateCharacteristicDialogComponent', () => {
  let component: CrateOrUpdateCharacteristicDialogComponent;
  let fixture: ComponentFixture<CrateOrUpdateCharacteristicDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CrateOrUpdateCharacteristicDialogComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CrateOrUpdateCharacteristicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
