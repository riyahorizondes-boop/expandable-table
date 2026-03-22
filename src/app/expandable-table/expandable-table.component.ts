import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Node {
  id: string;
  path: string;
  status: string;
  load: number;
  children?: Node[];
}

@Component({
  selector: 'app-expandable-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expandable-table.component.html',
  styleUrls: ['./expandable-table.component.scss']
})
export class ExpandableTableComponent implements OnInit {
  data: Node[] = [];
  expandedRows = new Set<string>();
  selectedRows = new Set<string>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Node[]>('assets/data.json').subscribe(d => this.data = d);
  }

  toggleExpand(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.expandedRows.has(id) ? this.expandedRows.delete(id) : this.expandedRows.add(id);
  }

  toggleSelect(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedRows.has(id) ? this.selectedRows.delete(id) : this.selectedRows.add(id);
  }

  isExpanded(id: string): boolean { return this.expandedRows.has(id); }
  isSelected(id: string): boolean { return this.selectedRows.has(id); }

  get selectedCount(): number { return this.selectedRows.size; }

  clearSelection(): void { this.selectedRows.clear(); }

  getStatusClass(status: string): string {
    const map: any = {
      'Active': 'badge-active',
      'Inactive': 'badge-inactive',
      'On Leave': 'badge-leave'
    };
    return map[status] || '';
  }

  getLoadClass(load: number): string {
    if (load >= 80) return 'load-high';
    if (load >= 40) return 'load-mid';
    return 'load-low';
  }
}
