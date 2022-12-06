import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
  @Input('rating') private rating: number;
  stars = [
    {
      class: 'star--gray  star',
    },
    {
      class: 'star--gray  star',
    },
    {
      class: 'star--gray  star',
    },
    {
      class: 'star--gray  star',
    },
    {
      class: 'star--gray  star',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    for (let i = 0; i < Math.round(this.rating); i++) {
      this.stars[i].class = 'star--gold star';
    }
  }
}
