<script>
  let _class = '';
  export { _class as class };
</script>

<button
  {...$$restProps}
  class="px-4 py-2 mx-auto bg-primary-400 rounded-md transition-shadow shadow-sm hover:shadow-md　{_class}"
>
  <slot />
</button>
