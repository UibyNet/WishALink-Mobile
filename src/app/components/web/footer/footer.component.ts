import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  currentYear: number = new Date().getFullYear();

  constructor(
    private appService: AppService
  ) {
  }

  ngOnInit() { 
  }

}
