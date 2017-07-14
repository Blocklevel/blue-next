/**
 * <%= name %> module export
 * @author <%= author.name %> <<%= author.email %>>
 * @type {Object}
 */
export default {
  state: {},

  getters: {},

  actions: {
  <%_ if (events.length > 0) { _%>
    <%_ for (var i = 0, l = events.length; i < l; i++) { _%>
    <%= events[i] %> ({ commit }, payload) {
      commit('<%= events[i] %>', payload)
    }<%= (i === (events.length - 1)) ? '' : ',' %>
    <%_ } _%>
  <%_ } else { _%>
    // foo: ({ commit }, action) => {
    //   commit(action.type, action.payload)
    // }
  <%_ } _%>
  },

  mutations: {
  <%_ if (events.length > 0) { _%>
    <%_ for (var i = 0, l = events.length; i < l; i++) { _%>
    <%= events[i] %> (state, payload) {

    }<%= (i === (events.length - 1)) ? '' : ',' %>
  <%_ } _%>
  <%_ } else { _%>
  // foo (state, payload) {
  //
  // }
  <%_ } _%>
  }
}
