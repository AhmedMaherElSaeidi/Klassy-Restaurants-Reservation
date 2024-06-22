import { Component, OnInit, Input } from '@angular/core';
import { faChair } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() numberOfSeats?:number;
  faChair = faChair;
  constructor() {}
  
  range(len:number) : any[] {
    let array:any[] = [];
    for (let index = 0; index < len; index++)
    array.push(1);
    
    return array
  }

  ngOnInit(): void {}
}
