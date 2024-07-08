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
  disallowPasteImagesPlugin,
} from 'wax-prosemirror-services'

import { TablesService, tableEditing } from 'wax-table-service'

import charactersList from './charactersList'

import { onInfoModal } from '../../../helpers/commonModals'

export default {
  MenuService: [
    {
      templateArea: 'mainMenuToolBar',
      toolGroups: [
        { name: 'Base', exclude: ['Save'] },
        'BlockDropDown',
        // { name: 'BlockQuoteTool', exclude: ['Lift'] },l
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
        'FullScreen',
      ],
    },
  ],
  SchemaService: DefaultSchema,
  SpecialCharactersService: charactersList,
  PmPlugins: [
    tableEditing(),
    disallowPasteImagesPlugin(() =>
      onInfoModal(
        `Pasting external images is not supported. Please use platform's Asset Manager infrastructure`,
      ),
    ),
  ],

  services: [
    new InlineAnnotationsService(),
    new ImageService(),
    new LinkService(),
    new ListsService(),
    new BaseService(),
    new TablesService(),
    new DisplayBlockLevelService(),
    new TextBlockLevelService(),
    new SpecialCharactersService(),
    new BlockDropDownToolGroupService(),
    new FindAndReplaceService(),
    new FullScreenService(),
  ],
}
