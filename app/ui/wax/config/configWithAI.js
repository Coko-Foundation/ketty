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
  BlockQuoteService,
  BlockDropDownToolGroupService,
  FindAndReplaceService,
  FullScreenService,
  disallowPasteImagesPlugin,
  AskAiContentService,
  CommentsService,
} from 'wax-prosemirror-services'

import { TablesService, tableEditing } from 'wax-table-service'

import charactersList from './charactersList'

import { onInfoModal } from '../../../helpers/commonModals'

const getComments = comments => {
  /* eslint-disable-next-line no-console */
  console.log(comments)
}

const setComments = (comments = []) => {
  return comments
}

export default {
  MenuService: [
    {
      templateArea: 'mainMenuToolBar',
      toolGroups: [
        { name: 'Base', exclude: ['Save'] },
        'BlockDropDown',
        { name: 'BlockQuoteTool', exclude: ['Lift'] },
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

  CommentsService: {
    showTitle: true,
    getComments,
    setComments,
  },

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
    new BlockQuoteService(),
    new BlockDropDownToolGroupService(),
    new FindAndReplaceService(),
    new FullScreenService(),
    new CommentsService(),
  ],
}
