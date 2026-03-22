import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Node {
  id: string;
  zone: string;
  value: string;
  status: string;
  activity: string;
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

  toggleExpand(id: string, event: Event): void {
    event.stopPropagation();
    this.expandedRows.has(id) ? this.expandedRows.delete(id) : this.expandedRows.add(id);
  }

  toggleSelect(id: string, event: Event): void {
    event.stopPropagation();
    this.selectedRows.has(id) ? this.selectedRows.delete(id) : this.selectedRows.add(id);
  }

  toggleParentSelect(row: Node, event: Event): void {
    event.stopPropagation();
    const isCurrentlySelected = this.selectedRows.has(row.id);

    if (isCurrentlySelected) {
      // Deselect parent and all children
      this.selectedRows.delete(row.id);
      if (row.children) {
        row.children.forEach(child => this.selectedRows.delete(child.id));
      }
    } else {
      // Select parent and all children
      this.selectedRows.add(row.id);
      if (row.children) {
        row.children.forEach(child => this.selectedRows.add(child.id));
      }
    }
  }

  isExpanded(id: string): boolean { return this.expandedRows.has(id); }
  isSelected(id: string): boolean { return this.selectedRows.has(id); }

  isParentChecked(row: Node): boolean {
    if (!row.children || row.children.length === 0) {
      return this.selectedRows.has(row.id);
    }
    return this.selectedRows.has(row.id) &&
      row.children.every(child => this.selectedRows.has(child.id));
  }

  isParentIndeterminate(row: Node): boolean {
    if (!row.children || row.children.length === 0) return false;
    const someSelected = row.children.some(child => this.selectedRows.has(child.id));
    const allSelected = row.children.every(child => this.selectedRows.has(child.id));
    return someSelected && !allSelected;
  }

  get selectedCount(): number { return this.selectedRows.size; }
  clearSelection(): void { this.selectedRows.clear(); }

  getStatusClass(status: string): string {
    const map: any = {
      'Optimal': 'badge-optimal',
      'Alert': 'badge-alert',
      'Reconciled': 'badge-reconciled',
      'Pending': 'badge-pending'
    };
    return map[status] || '';
  }
}