/**
 * @name <%= name %> <%= type %>
 * @author <%= author.name %> <<%= author.email %>>
 */

export default {
  name: '<%= name %>'<%= hooks ? ',' : '' %>
<% if (hooks) { %>
  props: {

  },

  data () {
    return {

    }
  },

  computed: {

  },

  methods: {

  }
<%_ } _%>
}
