import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { AudioPlayerBlock } from '@/components/blocks/AudioPlayerBlock';

export const AudioPlayer = Node.create({
  name: 'audioPlayer',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: '' },
      title: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="audio-player"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'audio-player' }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AudioPlayerBlock);
  },
});
