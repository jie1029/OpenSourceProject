<template>
    <div class="sidebar" >
        <div class="Guest-backdrop" v-if="isPanelOpen" @click="this.toggle"></div>
        <transition name="Guest">
            <div v-if="isPanelOpen" class="Guest-panel">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
import {mapGetters, mapMutations } from 'vuex'

export default {
    computed : {
        ...mapGetters({ 
            isPanelOpen: 'getGuestPanelIs'
        })
    },
	methods : { 
		...mapMutations({
			toggle : 'toggleGuestPanel'
		}),
	}
}
</script>

<style>
    .Guest-enter-active,
    .Guest-leave-active
    {
        transition: transform 0.4s ease;
    }

    .Guest-enter,
    .Guest-leave-to {
        transform: translateX(100%);
        transition: transform 0.4s ease;
    }

    .Guest-backdrop {
        /* background-color: rgba(0,0,0,.5); */
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
    }
    .Guest-panel {
        overflow-y: auto;
        background-color: rgba(255, 255, 255, 0.8);
        position: fixed;
        right: 0;
        top: 0;
        height: 100vh;
        z-index: 999;
        padding: 3rem 20px 2rem 20px;
        width: 30.5vw;
    }
    @media(max-width:500px){
        .Guest-panel {
            width: 50vw;
        }
    }
</style>