import { action } from "mobx";
import { LineSymbolizer, PolygonSymbolizer } from "protomaps";
import ProtomapsImageryProvider from "../../../../lib/Map/ImageryProvider/ProtomapsImageryProvider";
import { ImageryParts } from "../../../../lib/ModelMixins/MappableMixin";
import MapboxVectorTileCatalogItem from "../../../../lib/Models/Catalog/CatalogItems/MapboxVectorTileCatalogItem";
import CommonStrata from "../../../../lib/Models/Definition/CommonStrata";
import Terria from "../../../../lib/Models/Terria";

describe("MapboxVectorTileCatalogItem", function () {
  let mvt: MapboxVectorTileCatalogItem;

  beforeEach(function () {
    mvt = new MapboxVectorTileCatalogItem("test", new Terria());
  });

  it("has a type", function () {
    expect(MapboxVectorTileCatalogItem.type).toBe("mvt");
    expect(mvt.type).toBe("mvt");
  });

  describe("imageryProvider", function () {
    let imageryProvider: ProtomapsImageryProvider;

    beforeEach(async function () {
      mvt.setTrait(CommonStrata.user, "url", "http://test");
      mvt.setTrait(CommonStrata.user, "layer", "test-layer");
    });

    it("is an instance of ProtomapsImageryProvider", async function () {
      await mvt.loadMapItems();
      if (!ImageryParts.is(mvt.mapItems[0]))
        throw new Error("Expected MapItem to be an ImageryParts");

      imageryProvider = mvt.mapItems[0]
        .imageryProvider as ProtomapsImageryProvider;

      expect(imageryProvider instanceof ProtomapsImageryProvider).toBeTruthy();
    });

    it("sets min/max/native zoom properties", async function () {
      mvt.setTrait(CommonStrata.user, "minimumLevel", 1);
      mvt.setTrait(CommonStrata.user, "maximumLevel", 20);
      mvt.setTrait(CommonStrata.user, "maximumNativeZoom", 10);

      await mvt.loadMapItems();
      if (!ImageryParts.is(mvt.mapItems[0]))
        throw new Error("Expected MapItem to be an ImageryParts");

      imageryProvider = mvt.mapItems[0]
        .imageryProvider as ProtomapsImageryProvider;

      expect(imageryProvider.minimumLevel).toBe(1);
      expect(imageryProvider.maximumLevel).toBe(20);
      expect(imageryProvider.maximumNativeZoom).toBe(10);
    });

    it("sets idProperty", async function () {
      mvt.setTrait(CommonStrata.user, "idProperty", "id");

      await mvt.loadMapItems();
      if (!ImageryParts.is(mvt.mapItems[0]))
        throw new Error("Expected MapItem to be an ImageryParts");

      imageryProvider = mvt.mapItems[0]
        .imageryProvider as ProtomapsImageryProvider;

      expect(imageryProvider.idProperty).toBe("id");
    });
  });

  describe("legends", function () {
    it(
      "constructs a default legend from the definition",
      action(async function () {
        mvt.setTrait(CommonStrata.user, "fillColor", "red");
        mvt.setTrait(CommonStrata.user, "lineColor", "yellow");
        mvt.setTrait(CommonStrata.user, "name", "Test");
        await mvt.loadMapItems();
        const legendItem = mvt.legends[0].items[0];
        expect(legendItem.color).toBe("red");
        expect(legendItem.outlineColor).toBe("yellow");
        expect(legendItem.title).toBe("Test");
      })
    );
  });

  describe("paint rules", function () {
    it(
      "creates paint rules from simple styles",
      action(async function () {
        mvt.setTrait(CommonStrata.user, "fillColor", "red");
        mvt.setTrait(CommonStrata.user, "lineColor", "yellow");
        mvt.setTrait(CommonStrata.user, "layer", "Test");
        expect(mvt.paintRules.length).toBe(2);
        expect(mvt.paintRules[0].dataLayer).toBe("Test");
        expect(mvt.paintRules[1].dataLayer).toBe("Test");
        expect(
          mvt.paintRules[0].symbolizer instanceof PolygonSymbolizer
        ).toBeTruthy();
        expect(
          mvt.paintRules[1].symbolizer instanceof LineSymbolizer
        ).toBeTruthy();
      })
    );
  });
});
