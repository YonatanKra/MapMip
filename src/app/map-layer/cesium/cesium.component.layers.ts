import {CesiumComponent} from "./cesium.component";
import {Params} from "@angular/router";
import * as _ from 'lodash';

export class Layers{
  constructor(private cesium:CesiumComponent) {}

  getLayerFromLayerObj(layer_obj:{source:string}) {
    switch (layer_obj.source) {
      case 'mapbox':
        return this.getMapboxLayer(layer_obj);
      case 'openstreetmap':
        return this.getOpenstreetmapLayer(layer_obj);
      case 'bing':
        return this.getBingLayer(layer_obj);
      case 'tms':
        return this.getTmsLayer(layer_obj);
      default:
        return this.getUrlTemplateLayer(layer_obj);
    }
  }

  getBingLayer(layer_obj){
    return new Cesium.BingMapsImageryProvider({
      url: layer_obj['url'],
      key: layer_obj['key'],
      mapStyle: layer_obj['style'],
    });
  }

  getMapboxLayer(layer_obj){
    return new Cesium.MapboxImageryProvider({
      url: layer_obj['url'],
      mapId: layer_obj['mapid'],
      accessToken: layer_obj['access_token'],
      format: layer_obj['format'] ? layer_obj['format'] : undefined,
      proxy: {
        getURL : (url:string) => this.parseMapBoxUrl(layer_obj, url)
      }
    });
  }

  getTmsLayer(layer_obj){
    return new Cesium.createTileMapServiceImageryProvider({
      url: layer_obj['url'],
      fileExtension: layer_obj['format']
    });
  }

  getOpenstreetmapLayer(layer_obj){
    return new Cesium.createOpenStreetMapImageryProvider({
      url:layer_obj['url'],
      format:layer_obj['format'],
      proxy: {
        getURL : (url:string) => this.parseMapBoxUrl(layer_obj, url)
      }
    })
  }

  getUrlTemplateLayer(default_obj){
    return new Cesium.UrlTemplateImageryProvider({
      url: this.cesium.queryParamsHelperService.layerObjecttToUrl(default_obj)
    });
  }

  setLayersChanges(params:Params) {
    let params_tms_array = this.cesium.queryParamsHelperService.queryLayers(params);
    let imageryLayers = this.cesium.viewer.imageryLayers._layers;

    this.addLayersViaUrl(params_tms_array);
    this.removeLayersViaUrl(imageryLayers);

    if(this.noTileLayer()) this.addBaseLayer();

  }

  addLayersViaUrl(params_layers_array:Array<Object>) {
    params_layers_array.forEach( (layer_obj:{source:string}) => {
      if(!this.layerExistOnMap(layer_obj)){
        let layer = this.getLayerFromLayerObj(layer_obj);
        this.cesium.viewer.imageryLayers.addImageryProvider(layer);
      }
    })
  }

  removeLayersViaUrl(map_imageryLayers) {
    map_imageryLayers.forEach( (imageryLayer) => {
      if(!this.layerExistOnParams(imageryLayer.imageryProvider)) {
        this.cesium.viewer.imageryLayers.remove(imageryLayer);
      }
    });
  }

  noTileLayer():boolean{
    return _.isEmpty(this.cesium.viewer.imageryLayers._layers)
  }

  layerExistOnMap(layer_obj):boolean {
    let map_imagery_providers = this.cesium.viewer.imageryLayers._layers.map(l => l._imageryProvider);
    let _imageryProvider = this.getLayerFromLayerObj(layer_obj);

    let exist_on_map = map_imagery_providers.find( imageryProvider => {
      return this.imageryProvidersEqual(imageryProvider, _imageryProvider)
    });

    return !_.isNil(exist_on_map);
  }

  layerExistOnParams(imageryProvider):boolean {

    let params_layers = this.cesium.queryParamsHelperService.queryLayers(this.cesium.currentParams);

    let exist_on_params = params_layers.find( (layer_obj:{source:string}) => {
      let _imageryProvider = this.getLayerFromLayerObj(layer_obj);
      return this.imageryProvidersEqual(imageryProvider, _imageryProvider)
    });

    return !_.isNil(exist_on_params);
  }


  imageryProvidersEqual(imageryProvider, _imageryProvider):boolean {
    return imageryProvider instanceof _imageryProvider.constructor
      && imageryProvider['_url'] == _imageryProvider['_url']
      && imageryProvider['_accessToken'] == _imageryProvider['_accessToken'] // MapboxImageryProvider
      && imageryProvider['_mapId'] == _imageryProvider['_mapId'] // MapboxImageryProvider
      && imageryProvider['_mapStyle'] == _imageryProvider['_mapStyle'] // BingImageryProvider
      && imageryProvider['_key'] == _imageryProvider['_key']; // BingImageryProvider
  }

  parseMapBoxUrl(layer_obj, url:string):string {
    if(_.isEmpty(layer_obj.format)) url = url.replace(".png", "");
    if(_.isEmpty(layer_obj.mapid)) url = url.replace("undefined/", "");
    return url;
  }

  addBaseLayer():void {
    let bing_layer = this.getBingLayer({url:'https://dev.virtualearth.net' ,key:'Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq', style:'Aerial'});
    this.cesium.viewer.imageryLayers.addImageryProvider(bing_layer);
  }

}
