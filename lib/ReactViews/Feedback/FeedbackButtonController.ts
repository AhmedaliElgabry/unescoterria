import MapNavigationItemController from "../../Models/MapNavigation/MapNavigationItemController";
import ViewState from "../../ReactViewModels/ViewState";
import { computed, action } from "mobx";
import isDefined from "../../Core/isDefined";
import { GLYPHS } from "../Icon";

export const FEEDBACK_TOOL_ID = "feedback-tool";

export class FeedbackButtonController extends MapNavigationItemController {
  constructor(private viewState: ViewState) {
    super();
  }
  get glyph(): any {
    return GLYPHS.feedback;
  }
  get viewerMode() {
    return undefined;
  }
  @action
  handleClick(): void {
    if (this.viewState.feedbackFormIsVisible) {
      this.viewState.feedbackFormIsVisible = false;
    } else {
      this.viewState.feedbackFormIsVisible = true;
    }
  }

  @computed
  get visible() {
    return (
      isDefined(this.viewState.terria.configParameters.feedbackUrl) &&
      !this.viewState.hideMapUi()!
    );
  }

  @computed
  get active() {
    return this.viewState.feedbackFormIsVisible;
  }
}
