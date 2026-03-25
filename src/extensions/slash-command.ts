import { Extension } from '@tiptap/core';
import { Suggestion, type SuggestionOptions } from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';
import { BLOCK_REGISTRY, type BlockDefinition } from '@/types/blocks';
import { ReactRenderer } from '@tiptap/react';
import { SlashCommandMenu } from '@/components/editor/SlashCommandMenu';

const slashCommandPluginKey = new PluginKey('slashCommand');

const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        pluginKey: slashCommandPluginKey,
        command: ({
          editor,
          range,
          props,
        }: {
          editor: any;
          range: any;
          props: BlockDefinition;
        }) => {
          // Delete the slash command text first
          editor.chain().focus().deleteRange(range).run();

          const blockName = props.name;

          // Insert the real block extension node.
          // All 40 block types are registered as TipTap extensions.
          // The node name matches the extension name from the registry.
          const nodeType = editor.schema.nodes[blockName];
          if (nodeType) {
            editor.chain().focus().insertContent({ type: blockName }).run();
          } else {
            // Fallback for blocks that use built-in StarterKit types
            switch (blockName) {
              case 'heading':
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                break;
              default:
                editor.chain().focus().insertContent({
                  type: 'paragraph',
                  content: [{ type: 'text', text: `[${props.label}]` }],
                }).run();
                break;
            }
          }
        },
        items: ({ query }: { query: string }) => {
          const q = query.toLowerCase();
          return BLOCK_REGISTRY.filter(
            (item) =>
              item.label.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q) ||
              item.category.toLowerCase().includes(q),
          ).slice(0, 15);
        },
        render: () => {
          let component: ReactRenderer | null = null;
          let popup: HTMLElement | null = null;

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(SlashCommandMenu as any, {
                props,
                editor: props.editor,
              });

              popup = document.createElement('div');
              popup.style.position = 'absolute';
              popup.style.zIndex = '50';
              document.body.appendChild(popup);
              popup.appendChild(component.element);

              // Position the popup below the cursor
              if (props.clientRect) {
                const rect = props.clientRect();
                if (rect) {
                  popup.style.left = `${rect.left}px`;
                  popup.style.top = `${rect.bottom + 8}px`;
                }
              }
            },
            onUpdate: (props: any) => {
              component?.updateProps(props);

              if (popup && props.clientRect) {
                const rect = props.clientRect();
                if (rect) {
                  popup.style.left = `${rect.left}px`;
                  popup.style.top = `${rect.bottom + 8}px`;
                }
              }
            },
            onKeyDown: (props: any) => {
              if (props.event.key === 'Escape') {
                popup?.remove();
                component?.destroy();
                return true;
              }
              return (
                (component?.ref as any)?.onKeyDown?.(props) ?? false
              );
            },
            onExit: () => {
              popup?.remove();
              component?.destroy();
              popup = null;
              component = null;
            },
          };
        },
      } as Partial<SuggestionOptions>,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export { SlashCommand };
