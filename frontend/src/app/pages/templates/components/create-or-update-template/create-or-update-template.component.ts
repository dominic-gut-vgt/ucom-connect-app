import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatSelectTrigger } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { CharacteristicInfosDialogComponent } from 'src/app/pages/device/components/characteristic-infos-dialog/characteristic-infos-dialog.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UCOM_CONNECT_CHARACTERISTICS } from 'src/app/shared/consts/ucom-connect-characteristics';
import { LocalStorageKey } from 'src/app/shared/enums/local-storage-key.enum';
import { BluetoothCharacteristic } from 'src/app/shared/interfaces/bluetooth-characteristic';
import { Template, TemplateData } from 'src/app/shared/interfaces/templates/template.interface';
import { v4 as uuid } from 'uuid';
import { GetCharacteristicByIdPipe } from '../../pipes/get-characteristic-by-id.pipe';

enum FormGroupKeys {
  Id = 'id',
  Name = 'title',
  Description = 'description',
  Data = 'data',
  CharacteristicId = 'characteristicId',
  WriteValue = 'writeValue',
}


@Component({
  selector: 'app-create-or-update-template',
  templateUrl: './create-or-update-template.component.html',
  styleUrls: ['./create-or-update-template.component.scss'],
  imports: [CommonModule, FontAwesomeModule, GetCharacteristicByIdPipe, ReactiveFormsModule, MatSelectModule, MatInputModule, MatCheckboxModule, MatFormFieldModule, MatButtonModule, MatSelectTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrUpdateTemplateComponent implements OnInit {
  //injections
  private dialogRef = inject(MatDialogRef<CharacteristicInfosDialogComponent>);
  private template = inject<Template>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private localStorageService = inject(LocalStorageService);

  //consts
  protected readonly FGK = FormGroupKeys;
  protected readonly deleteIcon = faTrash;

  //data
  private templates: Template[] = [];
  private predefinedBluetoothCharacteristics = signal(UCOM_CONNECT_CHARACTERISTICS);
  private selfCreatedCharacteristics = signal<BluetoothCharacteristic[]>([]);
  private templateData = signal<TemplateData[]>([]);
  protected allCharacteristics = computed(() => {
    return this.predefinedBluetoothCharacteristics().concat(this.selfCreatedCharacteristics());
  });
  protected characteristicsPerDropdown = signal<BluetoothCharacteristic[][]>([]);

  //form
  protected templateForm!: FormGroup;

  //flags
  protected deletePossible = signal(false);

  ngOnInit() {
    this.createTemplateForm(this.template);
    this.localStorageService.getItem<Template[]>(LocalStorageKey.Templates).then((templates) => {
      if (templates) {
        this.templates = templates;
      }
    });

    this.localStorageService.getItem<BluetoothCharacteristic[]>(LocalStorageKey.Characteristics).then((characteristics) => {
      if (characteristics) {
        this.selfCreatedCharacteristics.set(characteristics);
      }
    });
  }

  protected saveTemplate() {
    if (this.templateForm.valid) {
      const template = this.getTemplateFromForm();
      this.deletePossible.set(false);

      if (!this.templates.find(t => t.id === template.id)) {
        this.templates.push(template);
      } else {
        this.templates = this.templates.map(c => c.id === template.id ? template : c);
      }

      this.localStorageService.setItem(LocalStorageKey.Characteristics, this.templates).then(() => {
        this.dialogRef.close(template);
      });
    }
  }

  protected deleteTemplate(): void {

    if (this.deletePossible()) {
      const characteristic = this.getTemplateFromForm();

      this.templates = this.templates.filter(c => c.id !== characteristic.id);

      this.localStorageService.setItem(LocalStorageKey.Characteristics, this.templates).then(() => {
        this.deletePossible.set(false);
        this.dialogRef.close(characteristic);
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

   // this.addTemplateData();

    this.subscribeToFormChanges();
  }

  private subscribeToFormChanges(): void {
    this.templateForm.valueChanges.subscribe(() => {
      this.templateData.set(this.templateDataFormArray.value as TemplateData[]);
      this.calcCharacteristicsPerDropdown();
    });
  }

  private calcCharacteristicsPerDropdown(): void {
    const filteredCharacteristics = this.allCharacteristics().filter(c => !this.templateData().map(t => t.characteristicId).includes(c.id))
    const updatedCharacteristicsPerDropdown: BluetoothCharacteristic[][] = [];

    this.templateData().forEach((templateData, i) => {
      const selectedCharacteristic = this.allCharacteristics().find(c => c.id === templateData.characteristicId);
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
