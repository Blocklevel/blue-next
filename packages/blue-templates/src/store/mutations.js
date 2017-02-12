import events from './events'

/**
 * {{ name }} mutations
 */
export default {
{{#each events}}
  [events.{{value}}] (state, payload) {

  }{{#if isNotLastItem}},{{/if}}
  {{else}}
  // [events.FOO] (state, payload) {
  //
  // }
{{/each}}
}
