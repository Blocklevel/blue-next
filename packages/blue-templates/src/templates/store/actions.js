import events from './events'

/**
 * {{ name }} actions
 */
export default {
{{#each events}}
  [events.{{value}}]: ({ commit }, payload) => {
    commit(events.{{value}}, payload)
  }{{#if isNotLastItem}},{{/if}}
  {{else}}
  // [events.FOO]: ({ commit }, payload) => {
  //   commit(events.FOO, payload)
  // }
{{/each}}
}
