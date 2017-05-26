const isServer = process.env.VUE_ENV === 'server'

function getTitle (vm) {
  const { title } = vm.$options

  if (!title) {
    return
  }

  return typeof title === 'function' ? title.call(vm) : title
}

export default {
  mounted () {
    const title = getTitle(this)

    if (!title) {
      return
    }

    if (isServer) {
      this.$ssrContext.title = title
      return
    }

    document.title = title
  }
}
