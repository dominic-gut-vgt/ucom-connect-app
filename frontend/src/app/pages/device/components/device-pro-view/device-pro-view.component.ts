import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, signal, viewChildren } from '@angular/core';
import { DeviceCharacteristicComponent } from '../common/device-characteristic/device-characteristic.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatSelect, MatSelectTrigger, MatOption } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GetCharacteristicByIdPipe } from 'src/app/shared/pipes/get-characteristic-by-id.pipe';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ScanResult } from '@capacitor-community/bluetooth-le';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CharacteristicsService } from 'src/app/services/characteristics.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { EMPTY_OBJECTS } from 'src/app/shared/consts/empty-objects';
import { ROUTE_PARAM_IDS } from 'src/app/shared/consts/routes';
import { UCOM_CONNECT_CHARACTERISTICS } from 'src/app/shared/consts/ucom-connect-characteristics';
import { BluetoothAction } from 'src/app/shared/enums/bluetooth-action.enum';
import { BluetoothCharacteristic } from 'src/app/shared/interfaces/bluetooth-characteristic';
import { Template } from 'src/app/shared/interfaces/templates/template.interface';
import { CreateOrUpdateCharacteristicDialogComponent } from './components/create-or-update-characteristic-dialog/create-or-update-characteristic-dialog.component';

enum FormGroupKeys {
  Template = 'template',
}

@Component({
  selector: 'app-device-pro-view',
  templateUrl: './device-pro-view.component.html',
  styleUrls: ['./device-pro-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DeviceCharacteristicComponent,
    ReactiveFormsModule,
    FontAwesomeModule,
    //material
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatSelectTrigger,
    MatOption,
    MatChipsModule,
    //pipes
    GetCharacteristicByIdPipe,
  ],
})

export class DeviceProViewComponent implements OnInit {

  //injections
  private dialog = inject(MatDialog);
  private characteristicsService = inject(CharacteristicsService);
  private templatesService = inject(TemplatesService);
  private fb = inject(FormBuilder);

  //inputs
  scanResult = input.required<ScanResult | undefined>();


  //consts
  protected readonly ucomConnectCharacteristics: BluetoothCharacteristic[] = JSON.parse(JSON.stringify(UCOM_CONNECT_CHARACTERISTICS));
  protected readonly bluetoothAction = BluetoothAction;
  protected readonly addIcon = faPlus;
  protected readonly FGK = FormGroupKeys;

  //viewchildren
  private readonly characteristicItems = viewChildren(DeviceCharacteristicComponent);

  //data
  protected allCharacteristics = this.characteristicsService.allCharacteristics;
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
