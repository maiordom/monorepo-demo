import { observable, action } from 'mobx';
import NanoEvents from 'nanoevents';

import request, { IEvent as IRequestEvent } from '../../utils/Request';

interface IEvent extends IRequestEvent {
  isLoading?: boolean;
  isResolved?: boolean;
  hasError?: boolean;
  params?: { [key: string]: string | number };
}

class Journal {
  @observable journal: { [key: string]: IEvent } = {};

  emitter = new NanoEvents();

  constructor() {
    request.emitter.on('start', this.handleStart);
    request.emitter.on('end', this.handleEnd);
    request.emitter.on('error', this.handleError);
  }

  @action.bound
  handleStart(event: IRequestEvent) {
    this.journal[event.name] = {
      ...event,
      isLoading: true,
      hasError: false,
    };
  }

  @action.bound
  handleError(event: IRequestEvent) {
    this.journal[event.name].isLoading = false;
    this.journal[event.name].isResolved = false;
    this.journal[event.name].hasError = true;
  }

  @action.bound
  handleEnd(event: IRequestEvent) {
    this.journal[event.name].isResolved = true;
    this.journal[event.name].isLoading = false;
  }
}

export default new Journal();
