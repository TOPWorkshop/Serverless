<template>
  <div>
    <ConfigButtons/>
    <UsersList/>
  </div>
</template>

<script>
  import ConfigButtons from './components/ConfigButtons';
  import UsersList from './components/UsersList';

  export default {
    name: 'app',
    components: { ConfigButtons, UsersList },
  }
</script>
