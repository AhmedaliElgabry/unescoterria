import ModelTraits from "../ModelTraits";
import primitiveTrait from "../primitiveTrait";
import SearchProviderTraits from "./SearchProviderTraits";

export default class LocationSearchProviderTraits extends SearchProviderTraits {
  @primitiveTrait({
    type: "string",
    name: "URL",
    description: "The URL of search provider."
  })
  url: string = "";

  @primitiveTrait({
    type: "boolean",
    name: "Open by default",
    description:
      "True if the geocoder should query as the user types to autocomplete.",
    isNullable: true
  })
  autocomplete?: boolean = true;

  @primitiveTrait({
    type: "number",
    name: "recommendedListLength",
    description: "Maximum amount of entries in the suggestion list."
  })
  recommendedListLength: number = 5;

  @primitiveTrait({
    type: "number",
    name: "URL",
    description: "Time to move to the result location.",
    isNullable: true
  })
  flightDurationSeconds?: number = 1.5;

  @primitiveTrait({
    type: "boolean",
    name: "Is open",
    description:
      "True if the search results of this search provider are visible; otherwise, false.",
    isNullable: true
  })
  isOpen: boolean = true;
}

export class SearchProviderMapCenterTraits extends ModelTraits {
  @primitiveTrait({
    type: "boolean",
    name: "Map center",
    description:
      "Whether the current location of the map center is supplied with search request"
  })
  mapCenter: boolean = true;
}
