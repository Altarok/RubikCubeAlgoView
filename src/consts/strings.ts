/**
 * Markdown code blocks this plugin is working with
 */
export const CodeBlocks = {
  cubes: {
    oll: 'rubikCubeOLL',
    pll: 'rubikCubePLL'
  },
  speedubing: {
    timer: 'speedcubingTimer',
    results: 'speedcubingResults'
  }
} as const

/**
 * Event names
 */
export const Events = {
  /** Triggers re-rendering of markdown code blocks. Used when settings change. */
  rerenderCodeBlocks: 'rca-event:rerender-markdown-code-blocks'
}

/**
 * Added list of css classes used in project to search for references.
 */
export const CssClasses = {
  /** Top-level layout grids, columns, and responsive pane structures */
  layout: {
    /** The main outer flex wrapper containing the column blocks */
    mainContainer: 'rubik-cube-algs-main-container',
    /** Left column container (typically used for actions or status metrics) */
    leftColumn: 'rubik-cube-algs-left-column',
    /** Right column container (typically handles data, lists, or settings panels) */
    rightColumn: 'rubik-cube-algs-right-column',
    /** Part of left column: container for SVG self-made graphics */
    content: 'rubik-cube-algs-cube-container',
    /** Part of right column: Compact monospace notation token wrapper (inline-block container style) */
    setupBox: 'rubik-cube-algs-monotone-box',
    /** Part of right column: Container wrapper managing listed configuration views */
    algorithmsList: 'rubik-cube-algs-algorithms-list'
  },

  /** Vector rendering layouts (SVGs) mapping PLL cases and layer transformations */
  vectorGraphics: {
    /** Top-level frame rendering the complete 2D flat layer layout view */
    border: 'rubik-cube-algs-cube-border',
    /** Color element background tiles filling block structures */
    background: 'rubik-cube-algs-cube-background',
    /** Outlined separator lines tracing element rows and columns */
    grid: 'rubik-cube-algs-cube-line-grid',
    /** Vector arrow configurations tracking algorithm step movements */
    arrow: 'rubik-cube-algs-arrow'
  },

  /** Core StackMat timing interfaces, display readouts, and state tracking */
  timer: {
    /** Main interactive wrapper block that captures focus and spacebar events */
    container: 'rubik-cube-algs-timer-container',
    /** Massive monospace clock face showing live tracking down to milliseconds */
    clock: 'rubik-cube-algs-timer-display',
    /** Instructional small hint text sitting directly below the numeric clock face */
    hint: 'rubik-cube-algs-timer-hint',
    /** Absolute-positioned focus badge tracking active workspace keyboard bounds */
    focusHint: 'rubik-cube-algs-timer-focus-hint',
    /** Top panel tracking and displaying generated scramble notations */
    scrambleDisplay: 'rubik-cube-algs-timer-scrambled-alg',
    /** Desktop only! Central modal overlay wrapping the configuration profile settings */
    modal: 'rubik-cube-algs-timer-modal',

    /** State Modifiers (Appended dynamically via controller execution) */
    states: {
      /** Spacebar is depressed; user must hold to prime engine (Turns Red) */
      readying: 'rubik-cube-algs-timer-readying',
      /** Solves are active; counting engine execution loops are busy (Turns Accent Color) */
      running: 'rubik-cube-algs-timer-running',
      /** Inspection threshold clearing; stackmat release state fully primed (Turns Green) */
      primed: 'rubik-cube-algs-timer-primed',
    }
  },

  speedcubingResults: {
    /** Main table class */
    table: 'rubik-cube-algs-speedcube-results-table',
    header: 'rubik-cube-algs-speedcube-results-table-group-header',
    highlight: 'rubik-cube-algs-speedcube-results-table-highlight'
  },

  /** Interactive control triggers, command actions, and icon frameworks */
  buttons: {
    /** Dedicated wrapper container controlling flex gap balancing for sets */
    container: 'rubik-cube-algs-button-container',
    /** Use on self-made SVG graphics on buttons */
    icon: 'rubik-cube-algs-button-svg'
  },


  /** System alert formatting, validation indicators, and safety warning banners */
  warnings: {
    /** Critical notification indicator utilizing theme safe red error backgrounds */
    red: 'rubik-cube-algs-warning-text-red',
    /** Secondary guidance marker utilizing accent-subtle soft orange panels */
    orange: 'rubik-cube-algs-warning-text-orange',
  }
} as const

// Utility Type Extraction
export type CssClassType = typeof CssClasses

