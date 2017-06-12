/**
 * @name <%= name %> <%= type %>
 * @author <%= author.name %> <<%= author.email %>>
 */

export default {
  name: '<%= name %>'<%= boilerplate ? ',' : '' %>
<% if (boilerplate) { %>
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
