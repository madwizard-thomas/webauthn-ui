import { WebAuthnUI } from '../src';

export class ReadyStateMocker {
    state = 'loading';

    constructor() {
      // Setup fake DOM readyState
      Object.defineProperty(document, 'readyState', { get: () => this.state });
    }

    resetLoading() {
      this.state = 'loading';
    }

    async enterInteractive() {
      // Document loaded
      this.state = 'interactive';
      await document.dispatchEvent(new Event('DOMContentLoaded'));
    }

    async enterComplete() {
      if (this.state === 'loading') {
        await this.enterInteractive();
      }
      // Document loaded
      this.state = 'complete';
      await window.dispatchEvent(new Event('load'));
    }
}

interface LoadedModule {
    WebAuthnUI : WebAuthnUI;
    autoSucceeded: boolean|null;
    autoPromise: Promise<void>;
}

export async function importModule() : Promise<LoadedModule> {
  const module = await import('../src/index');

  const obj : LoadedModule = {
    WebAuthnUI: module.WebAuthnUI,
    autoSucceeded: null,
    autoPromise: module.autoPromise,
  };
  module.autoPromise
    .then(() => { obj.autoSucceeded = true; })
    .catch(() => { obj.autoSucceeded = false; });
  return obj;
}
