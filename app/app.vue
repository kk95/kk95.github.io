<template>
  <!-- Roughens the edges of the ink stains on cards (.ink-react in main.css). -->
  <svg class="svg-defs" aria-hidden="true" width="0" height="0">
    <filter id="ink-edge" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="7" />
      <feDisplacementMap in="SourceGraphic" scale="34" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
  <NuxtPage />
</template>

<style>
.svg-defs { position: absolute; width: 0; height: 0; }
</style>
