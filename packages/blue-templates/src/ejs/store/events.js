/**
 * <%= name %> events
 */
export default {
<%_ if (events.length > 0) { _%>
  <%_ for (var i = 0, l = events.length; i < l; i++) { _%>
  <%= events[i].value %>: '<%= name %>/<%= events[i].value %>'<%= (i === (events.length - 1)) ? '' : ',' %>
  <%_ } _%>
<%_ } else { _%>
  // FOO: '<%= name %>/FOO'
<%_ } _%>
}
