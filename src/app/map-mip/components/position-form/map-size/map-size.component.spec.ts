/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSizeComponent } from './map-size.component';
import {QueryParamsHelperService} from "../../../services/query-params-helper.service";
import {RouterTestingModule} from "@angular/router/testing";
import {CalcService} from "../../../services/calc-service";
import {PositionFormModule} from "../position-form.module";
import {Ng2BootstrapModule} from "ng2-bootstrap";

describe('MapSizeComponent', () => {
  let component: MapSizeComponent;
  let fixture: ComponentFixture<MapSizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        PositionFormModule,
        RouterTestingModule,
        Ng2BootstrapModule.forRoot()
      ],
      providers:[QueryParamsHelperService, CalcService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('onSizeChange should call sizeChanges.emit and submitSizeEmitter.emit', () => {
    component.sizeArr = [20,30];
    spyOn(component.sizeChange, 'emit');
    spyOn(component.submitSizeEmitter, 'emit');
    component.onSizeChange();
    expect(component.sizeChange.emit).toHaveBeenCalledWith("20,30");
    expect(component.submitSizeEmitter.emit).toHaveBeenCalled();
  });

  it('ngOnChanges should call setSizeArr if change["size"]', () => {
      spyOn(component, "setSizeArr");
      let changes={size:true};
      component.ngOnChanges(<any>changes);
      expect(component.setSizeArr).toHaveBeenCalled();
  });


  it('setSizeArr should convert sizeArr from size(string)' , () => {
    component.size="40,20";
    component.setSizeArr();
    expect(component.sizeArr).toEqual([40,20]);
  });


});
