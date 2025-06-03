import { Component, computed, effect, inject, OnInit, signal, viewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROUTE_PARAM_IDS } from 'src/app/shared/consts/routes';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { UCOM_CONNECT_CHARACTERISTICS } from 'src/app/shared/consts/ucom-connect-characteristics';
import { BluetoothCharacteristic } from 'src/app/shared/interfaces/bluetooth-characteristic';
import { BluetoothAction } from 'src/app/shared/enums/bluetooth-action.enum';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight, faPaperPlane, faPlus } from '@fortawesome/free-solid-svg-icons';
import { DeviceCharacteristicComponent } from './components/device-characteristic/device-characteristic.component';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY_OBJECTS } from 'src/app/shared/consts/empty-objects';
import { MatButtonModule } from '@angular/material/button';
import { CreateOrUpdateCharacteristicDialogComponent } from './components/create-or-update-characteristic-dialog/create-or-update-characteristic-dialog.component';
import { CharacteristicsService } from 'src/app/services/characteristics.service';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { TemplatesService } from 'src/app/services/templates.service';
import { v4 as uuid } from 'uuid';
import { FindTemplateByIdPipe } from './pipes/find-template-by-id.pipe';
import { Template } from 'src/app/shared/interfaces/templates/template.interface';
import { GetCharacteristicByIdPipe } from 'src/app/shared/pipes/get-characteristic-by-id.pipe';
import { MatChipsModule } from '@angular/material/chips';

enum FormGroupKeys {
  Template = 'template',
}
@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DeviceCharacteristicComponent,
    //material
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatSelectTrigger,
    MatOption,
    MatChipsModule,
    //pipes
    FindTemplateByIdPipe,
    GetCharacteristicByIdPipe,
  ]
})
export class DevicePage implements OnInit {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private characteristicsService = inject(CharacteristicsService);
  private templatesService = inject(TemplatesService);
  private fb = inject(FormBuilder);

  //consts
  protected readonly ucomConnectCharacteristics: BluetoothCharacteristic[] = JSON.parse(JSON.stringify(UCOM_CONNECT_CHARACTERISTICS));
  protected readonly bluetoothAction = BluetoothAction;
  protected readonly addIcon = faPlus;
  protected readonly writeAllIcon = faPaperPlane;
  protected readonly FGK = FormGroupKeys;

  //viewchildren
  private readonly characteristicItems = viewChildren(DeviceCharacteristicComponent);

  //data
  protected allCharacteristics = this.characteristicsService.allCharacteristics;
  protected scanResult = signal<ScanResult | undefined>(undefined);
  protected selfCreatedCharacteristics = this.characteristicsService.selfCreatedCharacteristicsReadonly;
  protected templates = this.templatesService.templates;

  //form
  protected templatesForm!: FormGroup;
  protected selectedTemplate = signal<Template | undefined>(undefined);

  //flags
  private formInited = false;

  constructor() {
    effect(() => {
      if (this.templates().length > 0 && !this.formInited) {
        this.templatesForm = this.fb.group({
          [this.FGK.Template]: [undefined, Validators.required],
        });

        this.subscribeToFormChanges();

        this.formInited = false;
      }
    });
  }

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.scanResult.set(nav?.extras?.state?.[ROUTE_PARAM_IDS.scanResult]);
  }

  private subscribeToFormChanges(): void {
    this.templatesForm.valueChanges.subscribe((value) => {
      this.selectedTemplate.set(this.templates().find(t => t.id === value[this.FGK.Template]));

      if (this.selectedTemplate()) {
        this.fillInStdValues()
      }
    });
  }

  private fillInStdValues(): void {
    this.characteristicItems().forEach(characteristicItem => {
      const currentCharacteristic = characteristicItem.characteristic();
      const templateData = this.selectedTemplate()?.data.find(d => d.characteristicId === currentCharacteristic.id);

      if (templateData) {
        const writeValue = templateData.writeValue
        characteristicItem.setWriteValue(writeValue, currentCharacteristic.dataType);
      }
    });
  }


  protected writeAll(): void {
    this.characteristicItems().forEach(item => {
      item.writeCharacteristic();
    })
  }

  protected onCharacteristicWritten(): void {
    this.characteristicItems().forEach(item => {
      if (item.characteristic().readAfterEveryWrite) {
        item.readCharacteristic();
      }
    });
  }

  //dialog -------------------------------------------------------------------
  protected openCreateOrUpdateCharacteristicDialog(characteristic: BluetoothCharacteristic | undefined = undefined): void {
    if (!characteristic) {
      characteristic = EMPTY_OBJECTS.getEmptyBluetoothCharacteristic();
      characteristic.deviceId = this.scanResult()?.device.deviceId;
    }
    const dialogRef = this.dialog.open(CreateOrUpdateCharacteristicDialogComponent, {
      data: characteristic,
    });
  }

  protected openEditCharacteristicDialog(characteristic: BluetoothCharacteristic): void {
    this.openCreateOrUpdateCharacteristicDialog(characteristic);
  }

}
