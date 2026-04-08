import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookies',
  standalone: false,
  templateUrl: './cookies.html',
  styleUrl: './cookies.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CookiesComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }
}