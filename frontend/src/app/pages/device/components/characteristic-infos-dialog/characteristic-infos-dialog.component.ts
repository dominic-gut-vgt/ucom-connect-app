import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BluetoothCharacteristicInfo } from 'src/app/shared/interfaces/bluetooth-characteristic';


@Component({
  selector: 'app-characteristic-infos-dialog',
  templateUrl: './characteristic-infos-dialog.component.html',
  styleUrls: ['./characteristic-infos-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacteristicInfosDialogComponent implements OnInit {
 readonly dialogRef = inject(MatDialogRef<CharacteristicInfosDialogComponent>);
  readonly infos = inject<BluetoothCharacteristicInfo[]>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }

  constructor() { }

  ngOnInit() { }

}
