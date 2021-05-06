<template>
    <a v-if="isExternal(toPath)" :href="toPath" target="_blank">
        <slot></slot>
    </a>
    <router-link
        v-else
        :to="toPath"
    >
        <slot>
        </slot>
    </router-link>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { isExternal } from '@/utils/global'
@Component({
    name: 'SidebarItemLink'
})
export default class SidebarItemLink extends Vue {
    @Prop({ required: true }) private toPath!: string

    private isExternal = isExternal
}
</script>
