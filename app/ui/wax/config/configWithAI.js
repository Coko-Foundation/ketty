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
} from 'wax-prosemirror-services'

import { TablesService, tableEditing } from 'wax-table-service'

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
        // { name: 'BlockQuoteTool', exclude: ['Lift'] },
        { name: 'Lists', exclude: ['JoinUp'] },
        'Images',
        {
          name: 'Annotations',
          exclude: [
            'Code',
            'SmallCaps',
            'StrikeThrough',
            'Subscript',
            'Superscript',
          ],
        },
        // 'Tables',
        'SpecialCharacters',
        'FindAndReplaceTool',
        'ToggleAi',
        'FullScreen',
      ],
    },
  ],
  SchemaService: DefaultSchema,
  SpecialCharactersService: charactersList,
  PmPlugins: [
    // columnResizing(),
    tableEditing(),
    disallowPasteImagesPlugin(() =>
      onInfoModal(
        `Pasting external images is not supported. Please use platform's Asset Manager infrastructure`,
      ),
    ),
  ],

  // CommentsService: {
  //   showTitle: true,
  //   // getComments,
  //   setComments: () => {
  //     return comments
  //   },
  // },

  services: [
    new InlineAnnotationsService(),
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
  ],
}

export default config
