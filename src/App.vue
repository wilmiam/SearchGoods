<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import GoodsList from "./components/GoodsList";

    export default {
        name: 'App',
        components: {
            GoodsList
        }
    }
</script>

<style>
    #app {
        background: #F2F2F2;
    }
</style>
