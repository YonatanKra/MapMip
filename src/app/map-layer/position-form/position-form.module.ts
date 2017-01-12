import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {Ng2BootstrapModule} from "ng2-bootstrap";
import {PositionFormComponent} from "./position-form.component";
import { MarkersComponent } from './markers/markers.component';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { TmsComponent } from './tms/tms.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2BootstrapModule,
    JWBootstrapSwitchModule
  ],
  declarations: [PositionFormComponent, MarkersComponent, TmsComponent],
  exports: [PositionFormComponent]
})
export class PositionFormModule { }
