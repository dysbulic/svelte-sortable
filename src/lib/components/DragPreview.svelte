<script lang="ts" generics="R extends Record<string | symbol, unknown>">
    import type { Snippet } from 'svelte';

  let {
    datum, preview,
  }: {
    datum: R
    preview: Snippet<[R]>
  } = $props()
</script>

{@render preview(datum)}