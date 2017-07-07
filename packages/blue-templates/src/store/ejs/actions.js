import events from './events'

/**
 * <%= name %> actions
 */
export default {
<%_ if (events.length > 0) { _%>
  <%_ for (var i = 0, l = events.length; i < l; i++) { _%>
  [events.<%= events[i].value %>] ({ commit }, payload) {
    commit(events.<%= events[i].value %>, payload)
  }<%= (i === (events.length - 1)) ? '' : ',' %>
  <%_ } _%>
<%_ } else { _%>
  // [events.FOO]: ({ commit }, payload) => {
  //   commit(events.FOO, payload)
  // }
<%_ } _%>
}
