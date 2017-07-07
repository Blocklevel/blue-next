import events from './events'

/**
 * <%= name %> mutations
 */
export default {
<%_ if (events.length > 0) { _%>
  <%_ for (var i = 0, l = events.length; i < l; i++) { _%>
  [events.<%= events[i].value %>] (state, payload) {

  }<%= (i === (events.length - 1)) ? '' : ',' %>
  <%_ } _%>
<%_ } else { _%>
  // [events.FOO] (state, payload) {
  //
  // }
<%_ } _%>
}
