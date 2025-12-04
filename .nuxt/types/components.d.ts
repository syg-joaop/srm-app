
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  'CommonUserProfile': typeof import("../../src/components/common/UserProfile.vue")['default']
  'LayoutSidebar': typeof import("../../src/components/layout/Sidebar.vue")['default']
  'UiDashboardListItem': typeof import("../../src/components/ui/DashboardListItem.vue")['default']
  'UiDateBox': typeof import("../../src/components/ui/DateBox.vue")['default']
  'UiButtonsUiButton': typeof import("../../src/components/ui/buttons/UiButton.vue")['default']
  'UiDataDisplayUiBadge': typeof import("../../src/components/ui/data-display/UiBadge.vue")['default']
  'UiDataDisplayUiChartLegend': typeof import("../../src/components/ui/data-display/UiChartLegend.vue")['default']
  'UiDataDisplayUiList': typeof import("../../src/components/ui/data-display/UiList.vue")['default']
  'UiDataDisplayUiMetricGrid': typeof import("../../src/components/ui/data-display/UiMetricGrid.vue")['default']
  'UiDataDisplayUiMetricHero': typeof import("../../src/components/ui/data-display/UiMetricHero.vue")['default']
  'UiDataDisplayUiStatusBadgeGroup': typeof import("../../src/components/ui/data-display/UiStatusBadgeGroup.vue")['default']
  'UiFeedbackUiEmptyState': typeof import("../../src/components/ui/feedback/UiEmptyState.vue")['default']
  'UiFeedbackUiSpinner': typeof import("../../src/components/ui/feedback/UiSpinner.vue")['default']
  'UiFormsUiCheckbox': typeof import("../../src/components/ui/forms/UiCheckbox.vue")['default']
  'UiFormsUiInput': typeof import("../../src/components/ui/forms/UiInput.vue")['default']
  'UiLayoutUiCard': typeof import("../../src/components/ui/layout/UiCard.vue")['default']
  'UiOverlaysUiModal': typeof import("../../src/components/ui/overlays/UiModal.vue")['default']
  'AttendantStatusCard': typeof import("../../src/layers/dashboard/components/AttendantStatusCard.vue")['default']
  'DashboardWidget': typeof import("../../src/layers/dashboard/components/DashboardWidget.vue")['default']
  'MobileStatsWidget': typeof import("../../src/layers/dashboard/components/MobileStatsWidget.vue")['default']
  'StatCard': typeof import("../../src/layers/dashboard/components/StatCard.vue")['default']
  'NuxtWelcome': typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  'NuxtLayout': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  'NuxtErrorBoundary': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  'ClientOnly': typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  'DevOnly': typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  'ServerPlaceholder': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  'NuxtLink': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  'NuxtLoadingIndicator': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  'NuxtTime': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  'NuxtImg': typeof import("../../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']
  'NuxtPicture': typeof import("../../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']
  'NuxtPage': typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  'NoScript': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  'Link': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  'Base': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  'Title': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  'Meta': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  'Style': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  'Head': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  'Html': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  'Body': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  'NuxtIsland': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  'LazyCommonUserProfile': LazyComponent<typeof import("../../src/components/common/UserProfile.vue")['default']>
  'LazyLayoutSidebar': LazyComponent<typeof import("../../src/components/layout/Sidebar.vue")['default']>
  'LazyUiDashboardListItem': LazyComponent<typeof import("../../src/components/ui/DashboardListItem.vue")['default']>
  'LazyUiDateBox': LazyComponent<typeof import("../../src/components/ui/DateBox.vue")['default']>
  'LazyUiButtonsUiButton': LazyComponent<typeof import("../../src/components/ui/buttons/UiButton.vue")['default']>
  'LazyUiDataDisplayUiBadge': LazyComponent<typeof import("../../src/components/ui/data-display/UiBadge.vue")['default']>
  'LazyUiDataDisplayUiChartLegend': LazyComponent<typeof import("../../src/components/ui/data-display/UiChartLegend.vue")['default']>
  'LazyUiDataDisplayUiList': LazyComponent<typeof import("../../src/components/ui/data-display/UiList.vue")['default']>
  'LazyUiDataDisplayUiMetricGrid': LazyComponent<typeof import("../../src/components/ui/data-display/UiMetricGrid.vue")['default']>
  'LazyUiDataDisplayUiMetricHero': LazyComponent<typeof import("../../src/components/ui/data-display/UiMetricHero.vue")['default']>
  'LazyUiDataDisplayUiStatusBadgeGroup': LazyComponent<typeof import("../../src/components/ui/data-display/UiStatusBadgeGroup.vue")['default']>
  'LazyUiFeedbackUiEmptyState': LazyComponent<typeof import("../../src/components/ui/feedback/UiEmptyState.vue")['default']>
  'LazyUiFeedbackUiSpinner': LazyComponent<typeof import("../../src/components/ui/feedback/UiSpinner.vue")['default']>
  'LazyUiFormsUiCheckbox': LazyComponent<typeof import("../../src/components/ui/forms/UiCheckbox.vue")['default']>
  'LazyUiFormsUiInput': LazyComponent<typeof import("../../src/components/ui/forms/UiInput.vue")['default']>
  'LazyUiLayoutUiCard': LazyComponent<typeof import("../../src/components/ui/layout/UiCard.vue")['default']>
  'LazyUiOverlaysUiModal': LazyComponent<typeof import("../../src/components/ui/overlays/UiModal.vue")['default']>
  'LazyAttendantStatusCard': LazyComponent<typeof import("../../src/layers/dashboard/components/AttendantStatusCard.vue")['default']>
  'LazyDashboardWidget': LazyComponent<typeof import("../../src/layers/dashboard/components/DashboardWidget.vue")['default']>
  'LazyMobileStatsWidget': LazyComponent<typeof import("../../src/layers/dashboard/components/MobileStatsWidget.vue")['default']>
  'LazyStatCard': LazyComponent<typeof import("../../src/layers/dashboard/components/StatCard.vue")['default']>
  'LazyNuxtWelcome': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  'LazyNuxtLayout': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  'LazyNuxtErrorBoundary': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  'LazyClientOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  'LazyDevOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  'LazyServerPlaceholder': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  'LazyNuxtLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  'LazyNuxtTime': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  'LazyNuxtImg': LazyComponent<typeof import("../../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']>
  'LazyNuxtPicture': LazyComponent<typeof import("../../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']>
  'LazyNuxtPage': LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  'LazyNoScript': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  'LazyLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  'LazyBase': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  'LazyTitle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  'LazyMeta': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  'LazyStyle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  'LazyHead': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  'LazyHtml': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  'LazyBody': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  'LazyNuxtIsland': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
