import { Grid } from 'antd';

// breakpointMap:
/*
pass in value(s) to be returned depending on the breakpoint
e.g. {
  xs: { width: "10px"},
  lg: { width: "100px"}
}
*/

const useBreakpoints = (breakpointMap: any = {}) => {
  const breakpoints = Grid.useBreakpoint();
  const mappedValue =
    (breakpoints.xs && breakpointMap.xs) ||
    (breakpoints.xxl && breakpointMap.xxl) ||
    (breakpoints.xl && breakpointMap.xl) ||
    (breakpoints.lg && breakpointMap.lg) ||
    (breakpoints.md && breakpointMap.md) ||
    (breakpoints.sm && breakpointMap.sm) ||
    null;

  return { mappedValue, breakpoints };
};

export default useBreakpoints;
