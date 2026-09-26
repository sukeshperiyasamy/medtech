// Motion's animation features, loaded asynchronously by <LazyMotion> after first render so
// the full animation engine is not part of every page's initial JavaScript.
// domMax (not domAnimation) because the funding table uses `layout` animations.
import { domMax } from "motion/react";

export default domMax;
