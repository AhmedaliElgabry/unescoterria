import i18next from "i18next";
import { runInAction } from "mobx";
import defined from "terriajs-cesium/Source/Core/defined";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import Resource from "terriajs-cesium/Source/Core/Resource";
import loadJsonp from "../../Core/loadJsonp";
import SearchProviderMixin, {
  getMapCenter
} from "../../ModelMixins/SerchProvider/SearchProviderMixin";
import BingMapsSearchProviderTraits from "../../Traits/SearchProvider/BingMapsSearchProviderTraits";
import CreateModel from "../CreateModel";
import SearchProviderResults from "./SearchProviderResults";
import SearchResult from "./SearchResult";
import CommonStrata from "./../CommonStrata";
import Terria from "../Terria";

export default class BingMapsSearchProvider extends SearchProviderMixin(
  CreateModel(BingMapsSearchProviderTraits)
) {
  static readonly type = "bing-maps-search-provider";

  get type() {
    return BingMapsSearchProvider.type;
  }

  constructor(uniqueId: string | undefined, terria: Terria) {
    super(uniqueId, terria);
    if (!this.key && this.terria.configParameters.bingMapsKey) {
      this.setTrait(
        CommonStrata.defaults,
        "key",
        this.terria.configParameters.bingMapsKey
      );
    }
    this.showWarning();
  }

  showWarning() {
    if (!this.key || this.key === "") {
      console.warn(
        "The " +
          this.name +
          " geocoder will always return no results because a Bing Maps key has not been provided. Please get a Bing Maps key from bingmapsportal.com and add it to parameters.bingMapsKey in config.json."
      );
    }
  }

  protected doSearch(
    searchText: string,
    searchResults: SearchProviderResults
  ): Promise<void> {
    searchResults.results.length = 0;
    searchResults.message = undefined;

    if (this.shouldRunSearch(searchText)) {
      return Promise.resolve();
    }

    this.terria.analytics.logEvent("search", "bing", searchText);

    const searchQuery = new Resource({
      url: this.url + "REST/v1/Locations",
      queryParameters: {
        culture: this.culture,
        query: searchText,
        key: this.key
      }
    });

    if (this.mapCenter) {
      const mapCenter = getMapCenter(this.terria);

      searchQuery.appendQueryParameters({
        userLocation: `${mapCenter.latitude}, ${mapCenter.longitude}`
      });
    }

    const promise: Promise<any> = loadJsonp(searchQuery, "jsonp");

    return promise
      .then(result => {
        if (searchResults.isCanceled) {
          // A new search has superseded this one, so ignore the result.
          return;
        }

        if (result.resourceSets.length === 0) {
          searchResults.message = i18next.t("viewModels.searchNoLocations");
          return;
        }

        var resourceSet = result.resourceSets[0];
        if (resourceSet.resources.length === 0) {
          searchResults.message = i18next.t("viewModels.searchNoLocations");
          return;
        }

        const locations = this.sortByPriority(resourceSet.resources);

        runInAction(() => {
          searchResults.results.push(...locations.primaryCountry);
          searchResults.results.push(...locations.other);
        });

        if (searchResults.results.length === 0) {
          searchResults.message = i18next.t("viewModels.searchNoLocations");
        }
      })
      .catch(() => {
        if (searchResults.isCanceled) {
          // A new search has superseded this one, so ignore the result.
          return;
        }

        searchResults.message = i18next.t("viewModels.searchErrorOccurred");
      });
  }

  protected sortByPriority(resources: any[]) {
    const primaryCountryLocations: any[] = [];
    const otherLocations: any[] = [];

    // Locations in the primary country go on top, locations elsewhere go undernearth and we add
    // the country name to them.
    for (let i = 0; i < resources.length; ++i) {
      const resource = resources[i];

      let name = resource.name;
      if (!defined(name)) {
        continue;
      }

      let list = primaryCountryLocations;
      let isImportant = true;

      const country = resource.address
        ? resource.address.countryRegion
        : undefined;
      if (defined(this.primaryCountry) && country !== this.primaryCountry) {
        // Add this location to the list of other locations.
        list = otherLocations;
        isImportant = false;

        // Add the country to the name, if it's not already there.
        if (
          defined(country) &&
          name.lastIndexOf(country) !== name.length - country.length
        ) {
          name += ", " + country;
        }
      }

      list.push(
        new SearchResult({
          name: name,
          isImportant: isImportant,
          clickAction: createZoomToFunction(this, resource),
          location: {
            latitude: resource.point.coordinates[0],
            longitude: resource.point.coordinates[1]
          }
        })
      );
    }

    return {
      primaryCountry: primaryCountryLocations,
      other: otherLocations
    };
  }
}

function createZoomToFunction(model: BingMapsSearchProvider, resource: any) {
  const [south, west, north, east] = resource.bbox;
  const rectangle = Rectangle.fromDegrees(west, south, east, north);

  return function() {
    const terria = model.terria;
    terria.currentViewer.zoomTo(rectangle, model.flightDurationSeconds!);
  };
}
