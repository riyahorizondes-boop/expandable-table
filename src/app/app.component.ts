import { Component } from '@angular/core';
import { ExpandableTableComponent } from './expandable-table/expandable-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExpandableTableComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
