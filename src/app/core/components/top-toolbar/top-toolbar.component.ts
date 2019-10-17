import { Component, OnInit } from '@angular/core';

import { SessionService } from '../../services/session.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'ts-top-toolbar',
  templateUrl: './top-toolbar.component.html',
  styleUrls: ['./top-toolbar.component.scss']
})
export class TopToolbarComponent implements OnInit {

  constructor(public sessionService: SessionService,
              public spinnerService: SpinnerService) { }

  ngOnInit() {
  }

}
