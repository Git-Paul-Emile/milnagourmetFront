/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/react" />

/*
 * `vite-plugin-pwa/client` déclare les modules virtuels
 * `virtual:pwa-register` et `virtual:pwa-info`.
 * `vite-plugin-pwa/react` ajoute `virtual:pwa-register/react`, qui
 * expose le hook `useRegisterSW`.
 *
 * Ces modules n'existent pas sur le disque : ils sont générés à la volée
 * par le plugin au moment du build. Sans ces références, TypeScript
 * signalerait « Cannot find module 'virtual:pwa-register/react' ».
 */
