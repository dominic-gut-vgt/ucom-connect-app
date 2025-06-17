import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatSelectTrigger } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { BluetoothCharacteristic } from 'src/app/shared/interfaces/bluetooth-characteristic';
import { Template, TemplateData } from 'src/app/shared/interfaces/templates/template.interface';
import { v4 as uuid } from 'uuid';
import { BluetoothAction } from 'src/app/shared/enums/bluetooth-action.enum';
import { CharacteristicsService } from 'src/app/services/characteristics.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { BluetoothDataType } from 'src/app/shared/enums/bluetooth-data-type.enum';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GetCharacteristicByIdPipe } from 'src/app/shared/pipes/get-characteristic-by-id.pipe';
import { CharacteristicInfosDialogComponent } from 'src/app/pages/device/components/device-pro-view/components/characteristic-infos-dialog/characteristic-infos-dialog.component';

enum FormGroupKeys {
  Id = 'id',
  Name = 'name',
  Description = 'description',
  Data = 'data',
  CharacteristicId = 'characteristicId',
  WriteValue = 'writeValue',
}

@Component({
  selector: 'app-create-or-update-template',
  templateUrl: './create-or-update-template.component.html',
  styleUrls: ['./create-or-update-template.component.scss'],
  imports: [CommonModule, FontAwesomeModule, GetCharacteristicByIdPipe, ReactiveFormsModule, MatSelectModule, MatInputModule, MatCheckboxModule, MatFormFieldModule, MatButtonModule, MatSelectTrigger, MatSlideToggleModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrUpdateTemplateComponent implements OnInit {
  //injections
  private dialogRef = inject(MatDialogRef<CharacteristicInfosDialogComponent>);
  private template = inject<Template>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private characteristicsService = inject(CharacteristicsService);
  private templatesService = inject(TemplatesService);

  //consts
  protected readonly FGK = FormGroupKeys;
  protected readonly deleteIcon = faTrash;
  protected readonly bluetoothDataType = BluetoothDataType;

  //data
  private templateData = signal<TemplateData[]>([]);
  private allCharacteristics = this.characteristicsService.allCharacteristics;
  protected characteristicsPerDropdown = signal<BluetoothCharacteristic[][]>([]);
  protected selectableCharacteristics = computed(() => {
    return this.allCharacteristics().filter(c => (c.bluetoothAction === BluetoothAction.ReadWrite || c.bluetoothAction === BluetoothAction.Write));
  });

  //form
  protected templateForm!: FormGroup;

  //flags
  protected deletePossible = signal(false);

  ngOnInit() {
    this.createTemplateForm(this.template);
  }

  protected saveTemplate() {
    if (this.templateForm.valid) {
      const template = this.getTemplateFromForm();
      this.deletePossible.set(false);


      this.templatesService.saveTemplate(template).then(() => {
        this.dialogRef.close(template);
      });
    }
  }

  protected deleteTemplate(): void {
    if (this.deletePossible()) {
      const template = this.getTemplateFromForm();
      this.templatesService.deleteTemplate(template).then(() => {
        this.deletePossible.set(false);
        this.dialogRef.close(template);
      });
    } else {
      this.deletePossible.set(true);
    }
  }

  protected clearReallyDelete(): void {
    this.deletePossible.set(false);
  }


  //formgroup---------------------------------------------------------------

  private createTemplateDataForm(data?: TemplateData): FormGroup {
    return this.fb.group({
      [this.FGK.CharacteristicId]: [data?.characteristicId || '', Validators.required],
      [this.FGK.WriteValue]: [data?.writeValue || '', Validators.required],
    });
  }

  private createTemplateForm(template: Template): void {
    this.templateForm = this.fb.group({
      [this.FGK.Id]: [template?.id || uuid(), Validators.required],
      [this.FGK.Name]: [template?.name || '', Validators.required],
      [this.FGK.Description]: [template?.description || '', Validators.required],
      [this.FGK.Data]: this.fb.array(
        (template?.data || []).map(data => this.createTemplateDataForm(data))
      ),
    });

    this.templateData.set(this.templateDataFormArray.value as TemplateData[]);
    this.calcCharacteristicsPerDropdown();
    this.subscribeToFormChanges();
  }

  private subscribeToFormChanges(): void {
    this.templateForm.valueChanges.subscribe(() => {
      this.templateData.set(this.templateDataFormArray.value as TemplateData[]);
      this.calcCharacteristicsPerDropdown();
    });
  }

  private calcCharacteristicsPerDropdown(): void {
    const filteredCharacteristics = this.selectableCharacteristics().filter(c => !this.templateData().map(t => t.characteristicId).includes(c.id))
    const updatedCharacteristicsPerDropdown: BluetoothCharacteristic[][] = [];

    this.templateData().forEach((templateData, i) => {
      const selectedCharacteristic = this.selectableCharacteristics().find(c => c.id === templateData.characteristicId);
      updatedCharacteristicsPerDropdown[i] = JSON.parse(JSON.stringify(filteredCharacteristics));
      if (selectedCharacteristic) {
        updatedCharacteristicsPerDropdown[i].push(selectedCharacteristic);
      }
    });
    this.characteristicsPerDropdown.set(updatedCharacteristicsPerDropdown);
  }

  private getTemplateFromForm(): Template {
    return {
      ...this.templateForm.value,
      [this.FGK.Data]: this.templateDataFormArray.value as TemplateData[],
    } as Template;
  }

  protected get templateDataFormArray(): FormArray {
    return this.templateForm.get(this.FGK.Data) as FormArray;
  }

  protected addTemplateData() {
    this.templateDataFormArray.push(this.createTemplateDataForm());
  }

  protected removeInfo(index: number) {
    this.templateDataFormArray.removeAt(index);
  }


}
