/**
 * @name <%= name %> <%= type %>
 * @author <%= author.name %> <<%= author.email %>>
 */
<% if (!hooks) { %>
export default {
  nane: '<%= name %>'
}
<% } else { %>
export default {
  name: '<%= name %>',

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
}
<% } %>
