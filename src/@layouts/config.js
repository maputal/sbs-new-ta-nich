import { AppContentLayoutNav, ContentWidth, FooterType, NavbarType } from '@layouts/enums'
import { breakpointsVuetify } from '@vueuse/core'

export const config = {
  app: {
    title: 'Secure Bundling System',
    // logo: h('img', { src: '/src/assets/images/telakses/Teleakses_Solusindo_Logo.png' }),
    // logo: h('img', { src: '/src/assets/logo.svg' }),
    logo: h('img', { src: '/src/assets/telakses/Tel-Access_Logo_white.svg' }),

    // logo: () => h('img', { src: 'assets/colored-logo.png' }, null),
    contentWidth: ref(ContentWidth.Boxed),
    contentLayoutNav: ref(AppContentLayoutNav.Vertical),
    overlayNavFromBreakpoint: breakpointsVuetify.md,
    enableI18n: true,
    isRtl: ref(false),
  },
  navbar: {
    type: ref(NavbarType.Sticky),
    navbarBlur: ref(true),
  },
  footer: { type: ref(FooterType.Static) },
  verticalNav: {
    isVerticalNavCollapsed: ref(false),
    defaultNavItemIconProps: { icon: 'mdi-circle-outline' },
  },
  horizontalNav: {
    type: ref('sticky'),
  },
  icons: {
    chevronDown: { icon: 'mdi-chevron-down' },
    chevronRight: { icon: 'mdi-chevron-right' },
    close: { icon: 'mdi-close' },
    verticalNavPinned: { icon: 'mdi-record-circle-outline' },
    verticalNavUnPinned: { icon: 'mdi-radiobox-blank' },
    sectionTitlePlaceholder: { icon: 'mdi-minus' },
  },
}
