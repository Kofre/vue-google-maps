declare module 'vue2-google-maps' {
  module 'vue/types/vue' {
    interface Vue {
      $gmapDefaultResizeBus: Vue
    }
  }
  import Vue, { VueConstructor } from 'vue'

  export function load (apiKey: string | object, version: string, libraries?: string[], loadCn?: boolean): void

  export const loaded: Promise<any>

  export function install (Vue: VueConstructor<Vue>, options?: any): void
}

