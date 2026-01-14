import { Component } from '@angular/core';
import { SidebarComponent } from '../components/sidebar/sidebar';
import { RouterModule } from "@angular/router";
import { MainCompComponent } from '../components/main-comp/main-comp.component';
@Component({
  selector: 'app-fdfrontend',
  imports: [SidebarComponent, RouterModule,MainCompComponent],
  templateUrl: './fdfrontend.component.html',
  styleUrl: './fdfrontend.component.css'
})
export class FDfrontendComponent {

}
