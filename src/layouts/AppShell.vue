<template>
  <div
    class="min-h-dvh flex bg-white dark:bg-neutral-900 text-gray-900 dark:text-neutral-100"
  >
    <SideNav v-model:expanded="expanded" :items="items" />

    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-14 border-b-2 border-red-500 flex p-2 gap-2">
        <span>
          <button
            type="button"
            class="inline-flex rounded-md p-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="expanded = !expanded"
            aria-label="Toggle navigation menu"
          >
            <Bars3Icon class="h-6 w-6" />
          </button>
        </span>
        <button
          type="button"
          class="ml-2 inline-flex rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="expanded = !expanded"
          aria-label="Toggle navigation menu"
        >
          <img
            src="@/assets/images/fraxion_logo_dark.png"
            alt="Fraxion"
            class="h-10 w-auto"
          />
        </button>
        <h1 class="text-2xl font-semibold tracking-tight self-center">Fraxion</h1>
        <div class="ml-auto text-sm opacity-80">
          Signed in as {{ auth.user.name }}
        </div>
      </header>

      <main class="p-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterView } from "vue-router";
import SideNav from "@/components/SideNav.vue";
import { useAuthStore } from "@/stores/auth";
import { useUiStore } from "@/stores/ui";
import { Bars3Icon } from "@heroicons/vue/24/outline";
const auth = useAuthStore();
const ui = useUiStore();

const expanded = ref(!ui.navCollapsed);

const items = ref([
  { text: "Dashboard", to: "/", icon: "home", perm: "dashboard:view" },
  { text: "Requests", to: "/requests", icon: "inbox", perm: "orders:read" },
  { text: "Orders", to: "/orders", icon: "shopping-cart", perm: "orders:read" },
  {
    text: "Payments",
    to: "/payments",
    icon: "credit-card",
    perm: "reports:view",
  },
  {
    text: "Reports",
    to: "/reports",
    icon: "document-chart-bar",
    perm: "reports:view",
  },
  {
    text: "Settings",
    icon: "cog-6-tooth",
    id: "grp-settings",
    perm: "settings:view",
    children: [
      { text: "Profile", to: "/settings/profile", perm: "settings:view" },
      { text: "Billing", to: "/settings/billing", perm: "settings:view" },
    ],
  },
]);
</script>
