import events from './events'

/**
 * {{ name }} actions
 */
export default {
{{#each events}}
  [events.{{value}}]: ({ commit }, payload) => {
    commit(events.{{value}}, payload)
  }{{#if isNotLastItem}},{{/if}}
{{/each}}
{{#if noEvents}}
  // [events.FOO]: ({ commit }, payload) => {
  //   commit(events.FOO, payload)
  // }
{{/if}}
}
