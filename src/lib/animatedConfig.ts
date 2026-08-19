import type { WithSpringConfig } from "react-native-reanimated";

export const SWIPE_SPRING_CONFIG: WithSpringConfig = {
  damping: 20,
  stiffness: 200,
};

// Critically damped (damping ~= 2 * sqrt(stiffness)) plus overshootClamping so the card
// settles back at center without ever swinging past it to the opposite side.
export const SNAP_BACK_SPRING_CONFIG: WithSpringConfig = {
  damping: 32,
  stiffness: 220,
  overshootClamping: true,
};
