module.exports = {
  title: '{{ name }}',
  {{#if customCssPreprocessor}}
  options: {
    css: {
      // Please read the doc before any changes on this line
      // https://github.com/Blocklevel/blue-next#blue-next
      preProcessor: '{{ cssPreprocessor }}'
    }
  }
  {{/if}}
}
