module.exports = {
  title: '前端小胖',
  description: '该网站用于记录前端知识总结',
  dest: 'public',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico'
      }
    ],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,user-scalable=no'
      }
    ],
    ['meta', { name: 'keywords', content: '前端,js,css' }],
    ['meta', { name: 'author', content: '零一' }]
  ],
  theme: 'reco',
  themeConfig: {
    nav: [
      {
        text: 'Home',
        link: '/',
        icon: 'reco-home'
      },
      {
        text: 'TimeLine',
        link: '/timeline/',
        icon: 'reco-date'
      },
      {
        text: 'Docs',
        icon: 'reco-message',
        items: [
          {
            text: 'vuepress-reco',
            link: '/docs/theme-reco/'
          }
        ]
      },
      {
        text: 'Contact',
        icon: 'reco-message',
        items: [
          {
            text: 'GitHub',
            link: 'https://github.com/recoluan',
            icon: 'reco-github'
          }
        ]
      }
    ],
    sidebar: {
      '/docs/theme-reco/': [
        {
          title: '主题配置', // 标题信息
          collapsable: true, // 是否可折叠
          children: [
            // 该块内容对应的所有链接
            ''
          ]
        }
      ]
    },
    valineConfig: {
      appId: 'gieEIAaT8jucv7iQaVPDVTzB-gzGzoHsz', // your appId
      appKey: 'N74hMRJN6JtAb2finGomBxGp', // your appKey
      placeholder: '尽情留下你想说的话吧~', // 评论框占位符
      avatar: 'wavatar', // 评论用户的头像类型
      highlight: true, // 代码高亮
      recordIP: true // 记录评论者的IP
    },
    type: 'blog',
    blogConfig: {
      category: {
        location: 2,
        text: 'Category'
      },
      tag: {
        location: 3,
        text: 'Tag'
      }
    },
    friendLink: [
      // 友情链接
    ],
    logo: '/logo.png',
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: 'Last Updated',
    author: 'webChubby',
    authorAvatar: '/avatar.png',
    startYear: '2021'
  },
  markdown: {
    lineNumbers: true
  }
}
