/**
 * Added list of css classes used in project to search for references.
 */
export const CssClasses = {
  /** Top-level layout grids, columns, and responsive pane structures */
  layout: {
    /** The main outer flex wrapper containing the column blocks */
    mainContainer: 'rubik-cube-div-main-container',
    /** Left column container (typically used for actions or status metrics) */
    leftColumn: 'rubik-cube-div-left-column',
    /** Right column container (typically handles data, lists, or settings panels) */
    rightColumn: 'rubik-cube-div-right-column',
    /** Part of left column: Holds rendered visual cube items or canvas graphic frames */
    content: 'rubik-cube-div-content',
    /** Part of right column: Compact monospace notation token wrapper (inline-block container style) */
    setupBox: 'rubik-cube-algorithms-monotone-box',
    /** Part of right column: Container wrapper managing listed configuration views */
    algorithmsList: 'rubik-cube-div-algorithms-list'
  },

  /** Core StackMat timing interfaces, display readouts, and state tracking */
  timer: {
    /** Main interactive wrapper block that captures focus and spacebar events */
    container: 'rubik-cube-algorithms-timer-container',
    /** Massive monospace clock face showing live tracking down to milliseconds */
    display: 'rubik-cube-algorithms-timer-display',
    /** Instructional small hint text sitting directly below the numeric clock face */
    hint: 'rubik-cube-algorithms-timer-hint',
    /** Absolute-positioned focus badge tracking active workspace keyboard bounds */
    focusHint: 'rubik-cube-algorithms-timer-focus-hint',
    /** Top panel tracking and displaying generated scramble notations */
    scrambleDisplay: 'rubik-cube-algorithms-scramble-display',
    /** Central modal overlay wrapping the configuration profile settings */
    modal: 'rubik-cube-algorithms-timer-modal',


    /** State Modifiers (Appended dynamically via controller execution) */
    states: {
      /** Spacebar is depressed; user must hold to prime engine (Turns Red) */
      readying: 'rubik-cube-algorithms-timer-readying',
      /** Solves are active; counting engine execution loops are busy (Turns Accent Color) */
      running: 'rubik-cube-algorithms-timer-running',
      /** Inspection threshold clearing; stackmat release state fully primed (Turns Green) */
      primed: 'rubik-cube-algorithms-timer-primed',
    }
  },



  /** Interactive control triggers, command actions, and icon frameworks */
  buttons: {
    /** Dedicated wrapper container controlling flex gap balancing for sets */
    container: 'rubik-cube-algorithms-button-container',
    /** Standard action trigger style built with theme-aware borders */
    standard: 'rubik-cube-algorithms-button',
  },

  /** Vector rendering layouts (SVGs) mapping PLL cases and layer transformations */
  vectorGraphics: {
    /** Top-level frame rendering the complete 2D flat layer layout view */
    pllFrame: 'rubik-cube-pll',
    /** Color element background tiles filling block structures */
    rect: 'rubik-cube-pll-rect',
    /** Outlined separator lines tracing element rows and columns */
    lineGrid: 'rubik-cube-pll-line-grid',
    /** Vector arrow configurations tracking algorithm step movements */
    arrow: 'rubik-cube-arrow',
    /** Vector layout icon layout controller handling line properties */
    icon: 'rubik-cube-button',
  },

  /** System alert formatting, validation indicators, and safety warning banners */
  warnings: {
    /** Critical notification indicator utilizing theme safe red error backgrounds */
    red: 'rubik-cube-warning-text-red',
    /** Secondary guidance marker utilizing accent-subtle soft orange panels */
    orange: 'rubik-cube-warning-text-orange',
  }
} as const

// Utility Type Extraction
export type CssClassType = typeof CssClasses

