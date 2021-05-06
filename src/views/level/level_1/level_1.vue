<template>
    <div>
        <h2>Level_1</h2>
        <input type="text" />
        <router-view />
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
    name: 'Level_1'
})
export default class Level_1 extends Vue {

}
</script>
