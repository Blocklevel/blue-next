module.exports = {
  title: '{{ name }}',
  settings: {
    {{#if customCssPreprocessor}}
    css: {
      // Please read the doc before any changes on this line
      // https://github.com/Blocklevel/blue-next#blue-next
      preProcessor: '{{ cssPreprocessor }}'
    }
    {{/if}}
  }
}
