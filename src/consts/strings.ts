import {quickStartGuide} from "./quick-start-guide";
import {knownOllIds, knownPllIds} from "./predefined-cases";

export interface InsertTextCommandData {
  id: string
  name: string
  content: string
}

const tripleBacktick = "```"

/**
 * Markdown code blocks this plugin is working with
 */
const MarkdownCodeBlockNames = {
  cubes: {
    oll: 'rubikCubeOLL',
    pll: 'rubikCubePLL'
  },
  speedubing: {
    timer: 'speedcubingTimer',
    results: 'speedcubingResults'
  }
} as const

const CodeBlocks = {
  templates: {
    /* OLL CodeBlock template for a normal Rubik's Cube. */
    oll: `
\`\`\`rubikCubeOLL
.000.
01101
10101
01101
.000.
\`\`\`
    
\`\`\`rubikCubeOLL
.rrg.
bwwrw
wgwbw
owwbw
.goo. 
\`\`\`
`,
    /* PLL CodeBlock template for a normal Rubik's Cube. */
    pll: `
\`\`\`rubikCubePLL
dimension:3,3 // width,height
cubeColor:ff0 // yellow cube, optional parameter
arrowColor:08f // sky blue arrows, optional parameter
arrows:1.1-1.3,7+9 // normal arrow in top row, double-sided arrow in lower row
\`\`\`
`,
  },
  readyToUse: {
    /* 4 PLL algorithms for a Domino Cube (3x3x2) (partial list) */
    dominoCube_4_PllAlgorithms: `
# Domino Cube (3x3x2): 4 PLL algorithms

${tripleBacktick}${MarkdownCodeBlockNames.cubes.pll}
arrows:6+8
alg:R2 U R2 U R2 U2 R2 U2 R2 U R2 U' R2
${tripleBacktick}

${tripleBacktick}${MarkdownCodeBlockNames.cubes.pll}
arrows:3+9,4-6,6-8,8-4
alg:R2 U R2 U R2 U2 R2 U2 F2 U' F2 U F2 U'
${tripleBacktick}

${tripleBacktick}${MarkdownCodeBlockNames.cubes.pll}
arrows:9-1,1-7,7-9
alg:R2 U R2 U R2 U2 R2 F2 U2 F2 U F2 U F2 U2
${tripleBacktick}

${tripleBacktick}${MarkdownCodeBlockNames.cubes.pll}
arrows:9-7,7-3,3-9
alg:L2 U' L2 U' L2 U2 L2 F2 U2 F2 U' F2 U' F2 U2
${tripleBacktick}
`,
    /* 21 PLL algorithms for a Rubik's Cube (complete list) */
    rubikCube_21_PllAlgorithms: `
# PLL algorithms for Rubik's Cubes
This is complete list with 21 code blocks.

${Object.entries(knownPllIds).map(([key, val]) => `
## PLL-${val.desc}
${tripleBacktick}${MarkdownCodeBlockNames.cubes.pll}
id:${key}
${tripleBacktick}
`).join('')}
`,
    /* 57 OLL algorithms for a Rubik's Cube (complete list) */
    rubikCube_57_OllAlgorithms: `
# OLL algorithms for Rubik's Cubes
This is complete list with 57 code blocks.

${Object.entries(knownOllIds).map(([key, val]) => `
## ${key.toUpperCase()}-${val.desc}
${tripleBacktick}${MarkdownCodeBlockNames.cubes.oll}
id:${key}
${tripleBacktick}
`).join('')}
`
  }
}

const CubeNames = {
  Domino: 'Domino Cube (3x3x2)',
  Rubik: 'Rubik Cube'
} as const

const SettingsUI = {
  quickStartGuide: {
    name: 'Quick start guide',
    desc: 'Use command to add quick start guide to open note.'
  },
  examples: {
    name: 'Code block examples',
    desc: "Use command to add complete Rubik's Cube algorithm lists to open note."
  },
  templates: {
    name: 'Code block templates',
    desc: 'Use command to add code block templates for manual.',
  },
  hint: {
    name: 'Hint',
    desc: 'Reload app or plugin after changing one of those settings!'
  },
}

/**
 * Strings (partially) visible to user
 */
const Commands = {
  insertText: {
    ollCodeBlockTemplate: {
      id: 'RubikCubeAlgo-add-code-block-template-3x3-OLL',
      name: 'Add OLL code block template for 3x3 cube',
      content: CodeBlocks.templates.oll,
    },
    pllCodeBlockTemplate: {
      id: 'RubikCubeAlgo-add-code-block-template-3x3-PLL',
      name: 'Add PLL code block template for 3x3 cube',
      content: CodeBlocks.templates.pll,
    },
    ollCompleteLibrary: {
      id: 'RubikCubeAlgo-add-oll-codeblocks-for-rubik-cube',
      name: `Add *complete* OLL algorithm list for a ${CubeNames.Rubik}. (57 code blocks)`,
      content: CodeBlocks.readyToUse.rubikCube_57_OllAlgorithms,
    },
    pllCompleteLibrary: {
      id: 'RubikCubeAlgo-add-pll-codeblocks-for-rubik-cube',
      name: `Add *complete* PLL algorithm list for a ${CubeNames.Rubik}. (21 code blocks)`,
      content: CodeBlocks.readyToUse.rubikCube_21_PllAlgorithms,
    },
    dominoPllPartialLibrary: {
      id: 'RubikCubeAlgo-add-pll-codeblocks-for-domino-cube',
      name: `Add partial PLL algorithm list for a ${CubeNames.Domino}.`,
      content: CodeBlocks.readyToUse.dominoCube_4_PllAlgorithms
    },
    quickStartGuide: {
      id: 'RubikCubeAlgo-add-quick-start-guide',
      name: 'Insert quick start guide. (~10k characters)',
      content: quickStartGuide
    },
  } satisfies Record<string, InsertTextCommandData>,
  openSpeedCubingTimerAsModal: {
    id: 'RubikCubeAlgo-open-cube-timer',
    name: 'Open speed cubing timer',

  }

} as const


/*
 * FIXME add regexes, GUI strings and hints, and others to this class
 *
 * to later be localized?? just do it
 *
 * TODO remove console logs!
 */

/**
 * Event names
 */
const Events = {
  /** Triggers re-rendering of markdown code blocks. Used when settings change. */
  rerenderCodeBlocks: 'rca-event:rerender-markdown-code-blocks'
}

/**
 * Added list of css classes used in project to search for references.
 */
const CssClasses = {
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

export const Strings = {
  MarkdownCodeBlockNames,
  Commands,
  Events,
  CssClasses,
  SettingsUI
} as const
