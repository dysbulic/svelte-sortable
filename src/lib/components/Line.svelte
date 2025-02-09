<script lang="ts">
  import { GripVertical } from 'lucide-svelte'
  import Pill from './Status.svelte'
  import type { Task } from '../../routes/+page.svelte'

  let { datum }: { datum: Task } = $props()
</script>

<section
  role="button"
  tabindex={0}
  ondblclick={() => { console.debug('dbl') }}
  class="flex items-stretch justify-center"
>
  <div class="grow">
    <span class="inline-block px-3">
      <GripVertical size={10}/>
    </span>
    <span class="truncate flex-grow flex-shrink">{datum.content}</span>
  </div>
  <Pill status={datum.status}/>
</section>
