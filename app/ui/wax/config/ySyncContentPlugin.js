import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { DOMParser } from 'prosemirror-model';

const getSyncContentPlugin = new PluginKey('getSyncContentPlugin');

const parser = schema => {
  const WaxParser = DOMParser.fromSchema(schema);

  return content => {
    const container = document.createElement('article');

    container.innerHTML = content;
    return WaxParser.parse(container);
  };
};

export default (content = '<p>hello</p>') => {
  return new Plugin({
    key: getSyncContentPlugin,
    // state: {
    //   init: () => {
    //     return {
    //       content
    //     }
    //   },
    //   apply: (tr, pluginState) => {
    //     return pluginState;
    //   }
    // },
    state: {
      init() {
        return { inserted: false };
      },
      apply(tr, pluginState, oldState, newState) {
        const meta = tr.getMeta(getSyncContentPlugin);
        if (meta && typeof meta.inserted !== 'undefined') {
          return { ...pluginState, inserted: meta.inserted };
        }
        return pluginState;
      }
      // apply(tr, value) {
      //   // Keep the flag unchanged unless we explicitly set it
      //   const meta = tr.getMeta(getSyncContentPlugin);
      //   if (meta && meta.inserted) {
      //     return { inserted: true };
      //   }
      //   return value;
      // }
      // init() {
      //   return { inserted: false };
      // },
      // apply(tr, value) {
      //   return value; // keep the same state
      // },
    },
    view: (view) => {

      const pluginState = getSyncContentPlugin.getState(view.state);
      console.log(pluginState, "pluginState")
      // const pluginState = getSyncContentPlugin.getState(view.state);
      if (!pluginState.inserted) {
        debugger;
        console.log(getSyncContentPlugin.getState(view.state), "run")
        console.log(view.state.tr.getMeta('inserted'), "inserted")
        debugger;
          console.log('running')
          const { config: { schema, plugins } } = view.state;
      
          const parse = parser(schema);
          const WaxOptions = {
            doc: parse(content),
            schema,
            plugins,
          };
  

          view.updateState(EditorState.create(WaxOptions));
          if (view.dispatch) {
            view.dispatch(view.state.tr.setMeta('inserted', true));
          }
        }

      return {
        update: (view) => {
          // const pluginState = getSyncContentPlugin.getState(view.state);

          // console.log(prevContent, content, "state");
          // console.log(runOnce && prevContent === content, "runOnce");
          
          
 
        }
      }      
    },
    props: {
      // handleKeyDown(view, event) {
      //   console.log(view, event, 'handleKeyDown')
      // }
      //   let isList = false;
      //   if (event.key === 'Enter' && !event.shiftKey) {
      //     if (view.state.doc.content.size <= 2) {
      //       return true;
      //     }
      //     const {
      //       selection: { from, to },
      //       config: { schema, plugins },
      //       doc: { content },
      //     } = view.state;

      //     view.state.doc.nodesBetween(from, to, node => {
      //       if (node.type.name === 'list_item') isList = true;
      //     });

      //     if (!isList) {
      //       const serialize = serializer(schema);
      //       props.getContentOnEnter(serialize(content));
      //       const parse = parser(schema);
      //       const WaxOptions = {
      //         doc: parse(''),
      //         schema,
      //         plugins,
      //       };

      //       view.updateState(EditorState.create(WaxOptions));
      //       if (view.dispatch) {
      //         view.dispatch(view.state.tr.setMeta('addToHistory', false));
      //       }
      //       return true;
      //     }
      //   }
      //   return false;
      // },
    },
  });
};
