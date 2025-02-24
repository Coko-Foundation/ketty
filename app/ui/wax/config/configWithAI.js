import { DefaultSchema } from 'wax-prosemirror-core'

import {
  InlineAnnotationsService,
  ImageService,
  LinkService,
  ListsService,
  BaseService,
  DisplayBlockLevelService,
  TextBlockLevelService,
  SpecialCharactersService,
  BlockDropDownToolGroupService,
  FindAndReplaceService,
  FullScreenService,
  // disallowPasteImagesPlugin,
  AskAiContentService,
  CommentsService,
  HighlightService,
  TransformService,
  CodeBlockService,
  TrackChangeService,
  EditingSuggestingService,
  CustomTagService,
} from 'wax-prosemirror-services'

import { TablesService, tableEditing, columnResizing } from 'wax-table-service'

import disallowPasteImagesPlugin from '../disallowPasteImagesPlugin'

import charactersList from './charactersList'

import { onInfoModal } from '../../../helpers/commonModals'

const config = {
  MenuService: [
    {
      templateArea: 'mainMenuToolBar',
      toolGroups: [
        { name: 'Base', exclude: ['Save'] },
        'BlockDropDown',
        { name: 'Lists', exclude: ['JoinUp'] },
        'Images',
        {
          name: 'Annotations',
          exclude: ['SmallCaps', 'StrikeThrough', 'Subscript', 'Superscript'],
        },
        'SpecialCharacters',
        'ToggleAi',
        'FindAndReplaceTool',
        'FullScreen',
      ],
    },
    {
      templateArea: 'commentTrackToolBar',
      toolGroups: ['TrackCommentOptions'],
    },
  ],

  AskAiContentService: {
    AiOn: false,
  },

  SchemaService: DefaultSchema,
  SpecialCharactersService: charactersList,
  PmPlugins: [
    columnResizing(),
    tableEditing(),
    disallowPasteImagesPlugin(() => {
      if (!window.showInfo) {
        window.showInfo = true
        onInfoModal(
          `Pasting external images is not supported. Please upload an image file by selecting the image icon in the toolbar.`,
        )
        setTimeout(() => {
          window.showInfo = false
        }, 500)
      }
    }),
  ],

  ImageService: { showAlt: true },

  EnableTrackChangeService: { enabled: false, toggle: true },
  AcceptTrackChangeService: {
    own: {
      accept: true,
    },
    others: {
      accept: true,
    },
  },
  RejectTrackChangeService: {
    own: {
      reject: true,
    },
    others: {
      reject: true,
    },
  },

  services: [
    new InlineAnnotationsService(),
    new TrackChangeService(),
    new AskAiContentService(),
    new ImageService(),
    new LinkService(),
    new ListsService(),
    new TablesService(),
    new BaseService(),
    new DisplayBlockLevelService(),
    new TextBlockLevelService(),
    new SpecialCharactersService(),
    new BlockDropDownToolGroupService(),
    new FindAndReplaceService(),
    new FullScreenService(),
    new CommentsService(),
    new HighlightService(),
    new TransformService(),
    new CodeBlockService(),
    new EditingSuggestingService(),
    new CustomTagService(),
  ],
}

export default config
