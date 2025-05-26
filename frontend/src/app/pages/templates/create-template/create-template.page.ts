import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.page.html',
  styleUrls: ['./create-template.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CreateTemplatePage implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('CreateTemplatePage initialized');
  }

}
