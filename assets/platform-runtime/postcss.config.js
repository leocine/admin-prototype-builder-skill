import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

const scopeToReactRoot = {
  postcssPlugin: 'scope-to-react-root',
  Rule(rule) {
    let parent = rule.parent
    while (parent) {
      if (parent.type === 'atrule' && /keyframes$/i.test(parent.name)) return
      parent = parent.parent
    }
    rule.selectors = rule.selectors.map((selector) => selector.includes('#root') ? selector : `#root ${selector}`)
  },
}

export default { plugins: [tailwindcss(), autoprefixer(), scopeToReactRoot] }
