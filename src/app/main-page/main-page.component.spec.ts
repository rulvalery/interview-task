import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { MainPageComponent } from './main-page.component';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { first, skip, Subject, Subscription, take } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPageComponent, ReactiveFormsModule, NoopAnimationsModule],
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
      });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values and validators', () => {
    expect(component.form.value.favoriteNumber).toBe(0);
    expect(component.form.value.numberLength).toBe(0);
    expect(component.form.controls.numberLength.hasValidator(Validators.required)).toBeTrue();
  });

  it('should generate a number with specified length and ending after submit', fakeAsync(() => {
    component.ngOnInit();
    component.generatedNumber$.pipe(first()).subscribe(generatedNumber => {
      expect(generatedNumber.endsWith('7')).toBeTrue();
      expect(generatedNumber.length).toBe(5);
    });
    component.form.setValue({ favoriteNumber: 7, numberLength: 5 });
    component.onSubmit();
    flush();
  }));

  it('should generate a number with specified length and ending every 5 seconds', fakeAsync(() => {
    let emittedValue: string; 
    component.ngOnInit();
    component.generatedNumber$.pipe(
      skip(1),
      take(1)
    ).subscribe(value => {
      emittedValue = value;
    });
    component.form.setValue({ favoriteNumber: 7, numberLength: 5 });
    component.onSubmit();

    tick(4999);

    expect(emittedValue!).toBeUndefined();

    tick(1);

    expect(emittedValue!).toBeDefined();
    expect(emittedValue!.endsWith('7')).toBeTrue();
    expect(emittedValue!.length).toBe(5);
  }));

  it('should stop generation on form change', fakeAsync(() => {
    let nextValue: string;

    component.ngOnInit();

    component.form.setValue({ favoriteNumber: 5, numberLength: 5 });
    
    component.generatedNumber$.pipe(skip(1)).subscribe(value => {
      nextValue = value;
    });
    
    component.onSubmit();

    component.form.setValue({ favoriteNumber: 2, numberLength: 5 });

    tick(5000);

    expect(nextValue!).toBeUndefined();
  }));

});


