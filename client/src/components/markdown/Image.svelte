<script>
    export let href = ''
    export let title = undefined
    export let text = ''
  </script>
  
  <img src={"http://localhost:1337" + href} {title} alt={text}/>