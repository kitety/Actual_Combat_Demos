const { mergeWith } = require('docz-utils')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'happy-ui',
    description: 'My awesome app using docz',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-typescript',
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        src: './',
        gatsbyRoot: null,
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: true,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: null,
        o: null,
        open: null,
        'open-browser': null,
        root:
          'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary\\.docz',
        base: '/',
        source: './',
        'gatsby-root': null,
        files: './components/**/*.{md,markdown,mdx}',
        public: '/public',
        dest: 'doc-site',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'happy-ui',
        description: 'My awesome app using docz',
        host: 'localhost',
        port: 3000,
        p: 3000,
        separator: '-',
        paths: {
          root:
            'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary',
          templates:
            'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary\\node_modules\\docz-core\\dist\\templates',
          docz:
            'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary\\.docz',
          cache:
            'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary\\.docz\\.cache',
          app:
            'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary\\.docz\\app',
          appPackageJson:
            'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary\\package.json',
          appTsConfig:
            'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary\\tsconfig.json',
          gatsbyConfig:
            'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary\\gatsby-config.js',
          gatsbyBrowser:
            'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary\\gatsby-browser.js',
          gatsbyNode:
            'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary\\gatsby-node.js',
          gatsbySSR:
            'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary\\gatsby-ssr.js',
          importsJs:
            'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary\\.docz\\app\\imports.js',
          rootJs:
            'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary\\.docz\\app\\root.jsx',
          indexJs:
            'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary\\.docz\\app\\index.jsx',
          indexHtml:
            'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary\\.docz\\app\\index.html',
          db:
            'C:\\Users\\kitety\\Desktop\\code\\github\\Actual_Combat_Demos\\03ui-labrary\\.docz\\app\\db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
