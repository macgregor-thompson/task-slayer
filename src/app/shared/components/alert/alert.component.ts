import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ts-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() alertClass?: 'alert-danger' | 'alert-warning' | 'alert-success' | 'alert-primary' = 'alert-warning';

  constructor() { }

  ngOnInit() {
  }

}
