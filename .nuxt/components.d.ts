import type { DefineComponent, SlotsType } from 'vue';
type IslandComponent<T> = DefineComponent<
  {},
  { refresh: () => Promise<void> },
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  SlotsType<{ fallback: { error: unknown } }>
> &
  T;

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true;
  hydrateOnIdle?: number | true;
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true;
  hydrateOnMediaQuery?: string;
  hydrateAfter?: number;
  hydrateWhen?: boolean;
  hydrateNever?: true;
};
type LazyComponent<T> = DefineComponent<
  HydrationStrategies,
  {},
  {},
  {},
  {},
  {},
  {},
  { hydrated: () => void }
> &
  T;

export const CommonUserProfile: (typeof import('../src/components/common/UserProfile.vue'))['default'];
export const LayoutSidebar: (typeof import('../src/components/layout/Sidebar.vue'))['default'];
export const UiDashboardListItem: (typeof import('../src/components/ui/DashboardListItem.vue'))['default'];
export const UiDateBox: (typeof import('../src/components/ui/DateBox.vue'))['default'];
export const UiButtonsUiButton: (typeof import('../src/components/ui/buttons/UiButton.vue'))['default'];
export const UiDataDisplayUiBadge: (typeof import('../src/components/ui/data-display/UiBadge.vue'))['default'];
export const UiDataDisplayUiChartLegend: (typeof import('../src/components/ui/data-display/UiChartLegend.vue'))['default'];
export const UiDataDisplayUiList: (typeof import('../src/components/ui/data-display/UiList.vue'))['default'];
export const UiDataDisplayUiMetricGrid: (typeof import('../src/components/ui/data-display/UiMetricGrid.vue'))['default'];
export const UiDataDisplayUiMetricHero: (typeof import('../src/components/ui/data-display/UiMetricHero.vue'))['default'];
export const UiDataDisplayUiStatusBadgeGroup: (typeof import('../src/components/ui/data-display/UiStatusBadgeGroup.vue'))['default'];
export const UiFeedbackUiEmptyState: (typeof import('../src/components/ui/feedback/UiEmptyState.vue'))['default'];
export const UiFeedbackUiSpinner: (typeof import('../src/components/ui/feedback/UiSpinner.vue'))['default'];
export const UiFormsUiCheckbox: (typeof import('../src/components/ui/forms/UiCheckbox.vue'))['default'];
export const UiFormsUiInput: (typeof import('../src/components/ui/forms/UiInput.vue'))['default'];
export const UiLayoutUiCard: (typeof import('../src/components/ui/layout/UiCard.vue'))['default'];
export const UiOverlaysUiModal: (typeof import('../src/components/ui/overlays/UiModal.vue'))['default'];
export const AttendantStatusCard: (typeof import('../src/layers/dashboard/components/AttendantStatusCard.vue'))['default'];
export const DashboardWidget: (typeof import('../src/layers/dashboard/components/DashboardWidget.vue'))['default'];
export const MobileStatsWidget: (typeof import('../src/layers/dashboard/components/MobileStatsWidget.vue'))['default'];
export const StatCard: (typeof import('../src/layers/dashboard/components/StatCard.vue'))['default'];
export const NuxtWelcome: (typeof import('../node_modules/nuxt/dist/app/components/welcome.vue'))['default'];
export const NuxtLayout: (typeof import('../node_modules/nuxt/dist/app/components/nuxt-layout'))['default'];
export const NuxtErrorBoundary: (typeof import('../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue'))['default'];
export const ClientOnly: (typeof import('../node_modules/nuxt/dist/app/components/client-only'))['default'];
export const DevOnly: (typeof import('../node_modules/nuxt/dist/app/components/dev-only'))['default'];
export const ServerPlaceholder: (typeof import('../node_modules/nuxt/dist/app/components/server-placeholder'))['default'];
export const NuxtLink: (typeof import('../node_modules/nuxt/dist/app/components/nuxt-link'))['default'];
export const NuxtLoadingIndicator: (typeof import('../node_modules/nuxt/dist/app/components/nuxt-loading-indicator'))['default'];
export const NuxtTime: (typeof import('../node_modules/nuxt/dist/app/components/nuxt-time.vue'))['default'];
export const NuxtRouteAnnouncer: (typeof import('../node_modules/nuxt/dist/app/components/nuxt-route-announcer'))['default'];
export const NuxtImg: (typeof import('../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue'))['default'];
export const NuxtPicture: (typeof import('../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue'))['default'];
export const NuxtPage: (typeof import('../node_modules/nuxt/dist/pages/runtime/page'))['default'];
export const NoScript: (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['NoScript'];
export const Link: (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['Link'];
export const Base: (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['Base'];
export const Title: (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['Title'];
export const Meta: (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['Meta'];
export const Style: (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['Style'];
export const Head: (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['Head'];
export const Html: (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['Html'];
export const Body: (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['Body'];
export const NuxtIsland: (typeof import('../node_modules/nuxt/dist/app/components/nuxt-island'))['default'];
export const LazyCommonUserProfile: LazyComponent<
  (typeof import('../src/components/common/UserProfile.vue'))['default']
>;
export const LazyLayoutSidebar: LazyComponent<
  (typeof import('../src/components/layout/Sidebar.vue'))['default']
>;
export const LazyUiDashboardListItem: LazyComponent<
  (typeof import('../src/components/ui/DashboardListItem.vue'))['default']
>;
export const LazyUiDateBox: LazyComponent<
  (typeof import('../src/components/ui/DateBox.vue'))['default']
>;
export const LazyUiButtonsUiButton: LazyComponent<
  (typeof import('../src/components/ui/buttons/UiButton.vue'))['default']
>;
export const LazyUiDataDisplayUiBadge: LazyComponent<
  (typeof import('../src/components/ui/data-display/UiBadge.vue'))['default']
>;
export const LazyUiDataDisplayUiChartLegend: LazyComponent<
  (typeof import('../src/components/ui/data-display/UiChartLegend.vue'))['default']
>;
export const LazyUiDataDisplayUiList: LazyComponent<
  (typeof import('../src/components/ui/data-display/UiList.vue'))['default']
>;
export const LazyUiDataDisplayUiMetricGrid: LazyComponent<
  (typeof import('../src/components/ui/data-display/UiMetricGrid.vue'))['default']
>;
export const LazyUiDataDisplayUiMetricHero: LazyComponent<
  (typeof import('../src/components/ui/data-display/UiMetricHero.vue'))['default']
>;
export const LazyUiDataDisplayUiStatusBadgeGroup: LazyComponent<
  (typeof import('../src/components/ui/data-display/UiStatusBadgeGroup.vue'))['default']
>;
export const LazyUiFeedbackUiEmptyState: LazyComponent<
  (typeof import('../src/components/ui/feedback/UiEmptyState.vue'))['default']
>;
export const LazyUiFeedbackUiSpinner: LazyComponent<
  (typeof import('../src/components/ui/feedback/UiSpinner.vue'))['default']
>;
export const LazyUiFormsUiCheckbox: LazyComponent<
  (typeof import('../src/components/ui/forms/UiCheckbox.vue'))['default']
>;
export const LazyUiFormsUiInput: LazyComponent<
  (typeof import('../src/components/ui/forms/UiInput.vue'))['default']
>;
export const LazyUiLayoutUiCard: LazyComponent<
  (typeof import('../src/components/ui/layout/UiCard.vue'))['default']
>;
export const LazyUiOverlaysUiModal: LazyComponent<
  (typeof import('../src/components/ui/overlays/UiModal.vue'))['default']
>;
export const LazyAttendantStatusCard: LazyComponent<
  (typeof import('../src/layers/dashboard/components/AttendantStatusCard.vue'))['default']
>;
export const LazyDashboardWidget: LazyComponent<
  (typeof import('../src/layers/dashboard/components/DashboardWidget.vue'))['default']
>;
export const LazyMobileStatsWidget: LazyComponent<
  (typeof import('../src/layers/dashboard/components/MobileStatsWidget.vue'))['default']
>;
export const LazyStatCard: LazyComponent<
  (typeof import('../src/layers/dashboard/components/StatCard.vue'))['default']
>;
export const LazyNuxtWelcome: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/app/components/welcome.vue'))['default']
>;
export const LazyNuxtLayout: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/app/components/nuxt-layout'))['default']
>;
export const LazyNuxtErrorBoundary: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue'))['default']
>;
export const LazyClientOnly: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/app/components/client-only'))['default']
>;
export const LazyDevOnly: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/app/components/dev-only'))['default']
>;
export const LazyServerPlaceholder: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/app/components/server-placeholder'))['default']
>;
export const LazyNuxtLink: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/app/components/nuxt-link'))['default']
>;
export const LazyNuxtLoadingIndicator: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/app/components/nuxt-loading-indicator'))['default']
>;
export const LazyNuxtTime: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/app/components/nuxt-time.vue'))['default']
>;
export const LazyNuxtRouteAnnouncer: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/app/components/nuxt-route-announcer'))['default']
>;
export const LazyNuxtImg: LazyComponent<
  (typeof import('../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue'))['default']
>;
export const LazyNuxtPicture: LazyComponent<
  (typeof import('../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue'))['default']
>;
export const LazyNuxtPage: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/pages/runtime/page'))['default']
>;
export const LazyNoScript: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['NoScript']
>;
export const LazyLink: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['Link']
>;
export const LazyBase: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['Base']
>;
export const LazyTitle: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['Title']
>;
export const LazyMeta: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['Meta']
>;
export const LazyStyle: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['Style']
>;
export const LazyHead: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['Head']
>;
export const LazyHtml: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['Html']
>;
export const LazyBody: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/head/runtime/components'))['Body']
>;
export const LazyNuxtIsland: LazyComponent<
  (typeof import('../node_modules/nuxt/dist/app/components/nuxt-island'))['default']
>;

export const componentNames: string[];
