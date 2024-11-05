import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { interval, map, Observable, startWith, Subject, switchMap, takeUntil } from 'rxjs';


@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, MatInputModule, AsyncPipe],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent implements OnInit {

  favoriteNumberList = Array.from({ length: 10 }, (_, index) => index);

  form = new FormGroup({
    favoriteNumber: new FormControl<number>(0),
    numberLength: new FormControl<number>(0, [Validators.min(1), Validators.required])
  });

  generatedNumber$!: Observable<string>;

  #submit$ = new Subject<void>;  

  ngOnInit(): void {
    this.initGeneratedNumber();
  }

  onSubmit(): void {
    this.#submit$.next();
  }

  private initGeneratedNumber(): void {
    this.generatedNumber$ = this.#submit$.pipe(
      switchMap(() =>
        interval(5000).pipe(
          takeUntil(this.form.valueChanges),
          startWith(0),
          map(() => this.generateNumber())
        )
    ));
  }

  private generateNumber(): string {
    const { favoriteNumber, numberLength } = this.form.value;
    const favoriteNumberString = String(favoriteNumber);
    const randomPartLength = numberLength! - favoriteNumberString.length;
    const max = Math.pow(10, randomPartLength);
    const min = max / 10;
    const randomPart = Math.floor(Math.random() * (max - min) + min);
    return randomPart + favoriteNumberString;
  }
}
