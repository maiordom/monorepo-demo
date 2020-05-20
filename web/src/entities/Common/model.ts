import { observable, action } from 'mobx';

class Common {
  @observable isMenuOpened = false;
  @observable isOverlayVisible = false;

  @action.bound
  toggleMenu() {
    this.isMenuOpened = !this.isMenuOpened;
  }

  @action.bound
  toggleOverlay() {
    this.isOverlayVisible = !this.isOverlayVisible;
  }
}

export default new Common();
