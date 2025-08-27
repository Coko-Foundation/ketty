/* eslint-disable class-methods-use-this */
const Y = require('yjs')
const sanitizeHtml = require('sanitize-html')

class YjsHTMLConverter {
  constructor(customMappings = {}) {
    this.defaultMappings = {
      paragraph: 'p',
      title: 'h1',
      heading2: 'h2', // node => `h${node.getAttribute('level') || 1}`,
      heading3: 'h3',
      bulletlist: 'ul',
      orderedlist: 'ol',
      list_item: 'li',
      hard_break: () => '<br>',
      horizontal_rule: () => '<hr>',
      image: 'img',
    }

    this.mappings = { ...this.defaultMappings, ...customMappings }
  }

  convert(state) {
    const ydoc = new Y.Doc()
    Y.applyUpdate(ydoc, state)
    const rawHtml = this.convertFragment(ydoc.getXmlFragment('prosemirror'))

    const sanitized = sanitizeHtml(rawHtml, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      textFilter: text => text,
    })

    return sanitized
  }

  convertFragment(fragment) {
    let html = ''

    for (let i = 0; i < fragment.length; i += 1) {
      const child = fragment.get(i)
      html += this.convertNode(child)
    }

    return html
  }

  convertNode(node) {
    if (node instanceof Y.XmlText) {
      return this.formatText(node)
    }

    if (node instanceof Y.XmlElement) {
      return this.convertElement(node)
    }

    return ''
  }

  convertElement(element) {
    const { nodeName } = element
    const mapping = this.mappings[nodeName]

    if (typeof mapping === 'function') {
      return mapping(element)
    }

    if (typeof mapping === 'string') {
      const tagName = mapping
      const children = this.convertFragment(element)
      const attrs = this.getAttributes(element)
      return `<${tagName}${attrs}>${children}</${tagName}>`
    }

    // Fallback: use original node name
    const children = this.convertFragment(element)
    const attrs = this.getAttributes(element)
    return `<${nodeName}${attrs}>${children}</${nodeName}>`
  }

  formatText(textNode) {
    let text = textNode.toString()
    const attrs = textNode.getAttributes()

    if (!attrs) return text

    Object.keys(attrs).forEach(attr => {
      const value = attrs[attr]

      if (value) {
        switch (attr) {
          case 'bold':
            text = `<strong>${text}</strong>`
            break
          case 'italic':
            text = `<em>${text}</em>`
            break
          case 'underline':
            text = `<u>${text}</u>`
            break
          case 'strike':
            text = `<s>${text}</s>`
            break
          case 'code':
            text = `<code>${text}</code>`
            break
          case 'link':
            text = `<a href="${value}">${text}</a>`
            break
          default:
            break
        }
      }
    })

    return text
  }

  getAttributes(element) {
    const attrs = element.getAttributes()
    if (!attrs) return ''

    const attributeEntries = Object.entries(attrs)
    if (attributeEntries.length === 0) return ''

    const validAttributes = attributeEntries
      .filter(
        ([key, value]) =>
          value !== null && value !== undefined && key !== 'level',
      )
      .map(([key, value]) => ` ${key}="${value}"`)

    return validAttributes.join('')
  }
}

module.exports = YjsHTMLConverter
