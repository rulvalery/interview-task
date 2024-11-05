import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}
