import {Params} from "@angular/router";

export interface MapLayerChild {
  initializeMap():void;
  anyParamChanges(Params):boolean
  setMapView(params:Params):void
  setMapBounds(params:Params):void
  getBounds(): [number,number,number,number]

  queryParams(Params):void;
  moveEnd(event):Promise<boolean>;

  currentParams:Params;
  prevParams:Params;

}

