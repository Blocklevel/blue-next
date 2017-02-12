/**
 * {{ name }} events
 */
export default {
{{#if hasNamespace}}
{{#each events}}
  {{value}}: '{{value}}'{{#if isNotLastItem}},{{/if}}
  {{else}}
  // FOO: 'FOO'
{{/each}}
{{else}}
{{#each events}}
  {{value}}: '{{../name}}/{{value}}'{{#if isNotLastItem}},{{/if}}
  {{else}}
  // FOO: '{{name}}/FOO'
{{/each}}
{{/if}}
}
