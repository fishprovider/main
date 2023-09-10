/* eslint-disable max-len */
import type { MantineThemeOverride } from '@mantine/core';

const LightTheme: MantineThemeOverride = {
  // fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, sans-serif',
  fontSizes: {
    '2xs': '.625rem', // 10px
    xs: '.75rem', // 12px
    sm: '.875rem', // 14px
    md: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.375rem', // 22px | h6
    '2xl': '1.625rem', // 26px | h5
    '3xl': '2.125rem', // 34px | h4
    '4xl': '2.875rem', // 46px | h3
    '5xl': '3.625rem', // 58px | h2
    '6xl': '4.375rem', //  70px | h1
  },
  lineHeight: 1.2,
  breakpoints: {
    xs: '40rem', // 640px
    sm: '48rem', // 768px
    md: '64rem', // 1024px
    lg: '80rem', // 1280px
    xl: '96rem', // 1536px
  },
  radius: {
    xs: '0.125rem', // 2px
    sm: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '1rem', // 16px
    '2xl': '2rem', // 32px
  },
  spacing: {
    '2xs': '0.25rem', // 4px
    xs: '0.625rem', // 10px
    sm: '0.75rem', // 12px
    md: '1rem', // 16px
    lg: '1.25rem', // 20px
    xl: '1.5rem', // 24px
    '2xl': '2rem', // 32px
    '3xl': '3rem', // 48px
    '4xl': '4rem', // 64px
  },
  headings: {
    fontWeight: 400,
    sizes: {
      h6: { fontSize: '1.375rem', lineHeight: 1.2 }, // 22px | xl
      h5: { fontSize: '1.625rem', lineHeight: 1.2 }, // 26px | 2xl
      h4: { fontSize: '2.125rem', lineHeight: 1.2 }, // 34px | 3xl
      h3: { fontSize: '2.875rem', lineHeight: '3.5rem' }, // 46px | 4xl
      h2: { fontSize: '3.625rem', lineHeight: '4.375rem' }, // 58px | 5xl
      h1: { fontSize: '4.375rem', lineHeight: '6.125rem' }, // 70px | 6xl
    },
  },
  // primaryColor: 'navy',
  // primaryShade: 5,
  components: {
    // Button: {
    //   styles: (_theme, _params, { size }) => ({
    //     root: {
    //       fontWeight: 'bold',
    //       ...(isString(size)
    //         && BUTTON_SIZES.has(size) && {
    //         lineHeight: size === 'sm' ? '1.125rem' : size === 'lg' ? '1.375rem' : '1.25rem',
    //       }),
    //     },
    //   }),
    // },
    // Checkbox: {
    //   styles: {
    //     label: {
    //       marginBottom: '0',
    //       fontWeight: 'inherit',
    //     },
    //     input: {
    //       margin: '0 !important',
    //     },
    //   },
    // },
    // Radio: {
    //   styles: {
    //     label: {
    //       marginBottom: '0',
    //       fontWeight: 'inherit',
    //     },
    //     radio: {
    //       margin: '0 !important',
    //     },
    //   },
    // },
    // Text: {
    //   // These additional variants are distinct interface elements and subject to potential design changes
    //   variants: {
    //     // -------------------------------------------------------------------------------------------------------------
    //     // Body
    //     // -------------------------------------------------------------------------------------------------------------
    //     // Only supports sizes: sm, md, lg
    //     body: (theme, { weight }, { size }) => ({
    //       ...(isString(size)
    //         && BODY_SIZES.has(size) && {
    //         root: {
    //           ...(isEmpty(weight) && { fontWeight: 'normal' }),
    //           lineHeight: size === 'sm' ? '1.125rem' : size === 'lg' ? '1.5rem' : '1.25rem',
    //           color: theme.colors.gray[9],
    //         },
    //       }),
    //     }),
    //     // -------------------------------------------------------------------------------------------------------------
    //     // Button
    //     // -------------------------------------------------------------------------------------------------------------
    //     // Only supports sizes: sm, md, lg
    //     button: (_theme, { weight }, { size }) => ({
    //       ...(isString(size)
    //         && BUTTON_SIZES.has(size) && {
    //         root: {
    //           ...(isEmpty(weight) && { fontWeight: 'bold' }),
    //           lineHeight: size === 'sm' ? '1.125rem' : size === 'lg' ? '1.375rem' : '1.25rem',
    //         },
    //       }),
    //     }),
    //     // -------------------------------------------------------------------------------------------------------------
    //     // Caption
    //     // -------------------------------------------------------------------------------------------------------------
    //     // Only supports sizes: 2xs, xs, sm
    //     // Note: "Caption" is not to be confused with the html element figcaption semantic name that serves to provide
    //     // more detail or context about something. It's not quite a subHeadline as it can go anywhere
    //     caption: (_theme, { weight }, { size }) => ({
    //       ...(isString(size)
    //         && CAPTION_SIZES.has(size) && {
    //         root: {
    //           ...(isEmpty(weight) && { fontWeight: 'bold' }),
    //           lineHeight: size === 'sm' ? '1rem' : '0.875rem',
    //         },
    //       }),
    //     }),
    //     // -------------------------------------------------------------------------------------------------------------
    //     // Subheading
    //     // -------------------------------------------------------------------------------------------------------------
    //     // Only supports sizes: lg, xl, 2xl
    //     subheading: (_theme, { weight }, { size }) => ({
    //       ...(isString(size)
    //         && SUBHEADING_SIZES.has(size) && {
    //         root: {
    //           ...(isEmpty(weight) && { fontWeight: 'normal' }),
    //           lineHeight: 1.2,
    //         },
    //       }),
    //     }),
    //   },
    // },
    // Title: {
    //   variants: {
    //     // -------------------------------------------------------------------------------------------------------------
    //     // Responsive
    //     // -------------------------------------------------------------------------------------------------------------
    //     // Only supports sizes: h1, h2, h3
    //     responsive: (theme, { order, element }, { size }) => {
    //       let fontSize;

    //       // Size overrides order if it's defined
    //       // Looks like order isn't set, not sure if it's a bug. Use element as a fallback.
    //       if (size === 'h1' || (isEmpty(size) && (order === 1 || (isEmpty(order) && element === 'h1')))) {
    //         fontSize = `clamp(${theme.fontSizes['3xl']}, 1.375rem + 3.75vw, ${theme.fontSizes['6xl']})`;
    //       } else if (size === 'h2' || (isEmpty(size) && (order === 2 || (isEmpty(order) && element === 'h2')))) {
    //         fontSize = `clamp(${theme.fontSizes['2xl']}, 0.9583rem + 3.3333vw, ${theme.fontSizes['5xl']})`;
    //       } else if (size === 'h3' || (isEmpty(size) && (order === 3 || (isEmpty(order) && element === 'h3')))) {
    //         fontSize = `clamp(${theme.fontSizes.xl}, 0.875rem + 2.5vw, ${theme.fontSizes['4xl']})`;
    //       } else {
    //         return {};
    //       }

    //       return {
    //         root: {
    //           fontSize,
    //         },
    //       } as Record<string, CSSObject>;
    //     },
    //   },
    // },
    // TextInput: {
    //   styles: (theme) => ({
    //     description: {
    //       color: theme.colors.gray[7],
    //     },
    //   }),
    // },
    // PasswordInput: {
    //   styles: (theme) => ({
    //     description: {
    //       color: theme.colors.gray[7],
    //     },
    //   }),
    // },
    // Modal: {
    //   styles: {
    //     header: {
    //       alignItems: 'flex-start',
    //     },
    //   },
    // },
  },
};

export default LightTheme;
