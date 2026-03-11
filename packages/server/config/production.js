module.exports = {
  templates: [
    // {
    //   label: "atla",
    //   url: "https://gitlab.coko.foundation/ketty-templates/atla",
    //   assetsRoot: "dist",
    //   supportedNoteTypes: ["footnotes"],
    // },
    {
      label: 'slategrey',
      url: 'https://github.com/Coko-Foundation/ketty-template-slategrey.git',
      assetsRoot: 'dist',
      supportedNoteTypes: ['chapterEnd'],
    },
    {
      label: 'significa',
      url: 'https://github.com/Coko-Foundation/ketty-template-significa.git',
      assetsRoot: 'dist',
      supportedNoteTypes: ['chapterEnd'],
    },
    {
      label: 'bikini',
      url: 'https://github.com/Coko-Foundation/ketty-template-bikini.git',
      assetsRoot: 'dist',
      supportedNoteTypes: ['chapterEnd'],
    },
    {
      label: 'vanilla',
      url: 'https://github.com/Coko-Foundation/ketty-template-vanilla.git',
      assetsRoot: 'dist',
      default: true,
      supportedNoteTypes: ['chapterEnd'],
    },
    {
      label: 'atosh',
      url: 'https://github.com/Coko-Foundation/ketty-template-atosh.git',
      assetsRoot: 'dist',
      supportedNoteTypes: ['chapterEnd'],
    },
    {
      label: 'eclypse',
      url: 'https://github.com/Coko-Foundation/ketty-template-eclypse.git',
      assetsRoot: 'dist',
      supportedNoteTypes: ['chapterEnd'],
    },
    {
      label: 'logical',
      url: 'https://github.com/Coko-Foundation/ketty-template-logical.git',
      assetsRoot: 'dist',
      supportedNoteTypes: ['chapterEnd'],
    },
    {
      label: 'tenberg',
      url: 'https://github.com/Coko-Foundation/ketty-template-tenberg.git',
      assetsRoot: 'dist',
      supportedNoteTypes: ['chapterEnd'],
    },
  ],
  mailer: {
    transport: {
      secure: true,
    },
  },
}
