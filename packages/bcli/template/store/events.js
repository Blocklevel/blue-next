/**
 * {{ name }} events
 */
export default {
{{#each events}}
  {{value}}: '{{../name}}/{{value}}'{{#if isNotLastItem}},{{/if}}
{{/each}}
{{#if noEvents}}
  // FOO: 'namespace/FOO'
{{/if}}
}
