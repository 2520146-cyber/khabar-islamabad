'use client';

import { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface Block {
  id: string;
  type: string;
  content: string;
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[], html: string) => void;
}

const BLOCK_TYPES = [
  { type: 'paragraph', label: 'Paragraph', icon: '¶' },
  { type: 'heading2', label: 'Heading 2', icon: 'H2' },
  { type: 'heading3', label: 'Heading 3', icon: 'H3' },
  { type: 'quote', label: 'Quote', icon: '"' },
  { type: 'factbox', label: 'Fact Box', icon: '📊' },
  { type: 'bulletlist', label: 'Bullet List', icon: '•' },
  { type: 'separator', label: 'Separator', icon: '—' },
];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [showPalette, setShowPalette] = useState(false);
  const [paletteBlockId, setPaletteBlockId] = useState<string | null>(null);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);

  const updateBlocks = (newBlocks: Block[]) => {
    const html = newBlocks
      .map((block) => {
        switch (block.type) {
          case 'heading2':
            return `<h2>${block.content}</h2>`;
          case 'heading3':
            return `<h3>${block.content}</h3>`;
          case 'quote':
            return `<blockquote>${block.content}</blockquote>`;
          case 'factbox':
            return `<div class="factbox">${block.content}</div>`;
          case 'bulletlist':
            return `<ul>${block.content.split('\n').map((item) => `<li>${item}</li>`).join('')}</ul>`;
          case 'separator':
            return '<hr />';
          default:
            return `<p>${block.content}</p>`;
        }
      })
      .join('\n');

    onChange(newBlocks, html);
  };

  const addBlock = (afterId: string, type: string = 'paragraph') => {
    const newBlock: Block = { id: generateId(), type, content: '' };
    const index = blocks.findIndex((b) => b.id === afterId);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    updateBlocks(newBlocks);
    setActiveBlock(newBlock.id);
  };

  const removeBlock = (id: string) => {
    if (blocks.length === 1) return;
    updateBlocks(blocks.filter((b) => b.id !== id));
  };

  const updateBlockContent = (id: string, content: string) => {
    updateBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const updateBlockType = (id: string, type: string) => {
    updateBlocks(blocks.map((b) => (b.id === id ? { ...b, type } : b)));
    setShowPalette(false);
  };

  const handleKeyDown = (e: KeyboardEvent, block: Block) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock(block.id);
    }

    if (e.key === 'Backspace' && block.content === '' && blocks.length > 1) {
      e.preventDefault();
      removeBlock(block.id);
    }

    // Slash command
    if (e.key === '/' && block.content === '') {
      e.preventDefault();
      setShowPalette(true);
      setPaletteBlockId(block.id);
    }
  };

  const renderBlock = (block: Block) => {
    const baseClasses = 'w-full outline-none bg-transparent resize-none';
    const typeClasses: Record<string, string> = {
      paragraph: 'text-base leading-relaxed',
      heading2: 'text-xl font-serif font-semibold',
      heading3: 'text-lg font-serif font-medium',
      quote: 'text-base italic border-l-4 border-brand-red pl-4',
      factbox: 'text-base bg-red-50 border-l-4 border-brand-red p-4 rounded-r-lg',
      bulletlist: 'text-base',
      separator: '',
    };

    if (block.type === 'separator') {
      return (
        <div className="py-4">
          <hr className="border-gray-200" />
        </div>
      );
    }

    return (
      <textarea
        value={block.content}
        onChange={(e) => updateBlockContent(block.id, e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, block)}
        onFocus={() => setActiveBlock(block.id)}
        placeholder={
          block.type === 'paragraph' && blocks.indexOf(block) === 0
            ? 'Start writing your article...'
            : block.type === 'heading2'
            ? 'Heading...'
            : block.type === 'heading3'
            ? 'Subheading...'
            : block.type === 'quote'
            ? 'Quote...'
            : 'Type "/" for commands...'
        }
        className={`${baseClasses} ${typeClasses[block.type] || ''}`}
        rows={1}
        style={{ minHeight: '1.5em' }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = target.scrollHeight + 'px';
        }}
      />
    );
  };

  return (
    <div className="space-y-1">
      {blocks.map((block) => (
        <div
          key={block.id}
          className={`group flex items-start gap-2 px-2 py-1.5 rounded-lg transition-colors ${
            activeBlock === block.id ? 'bg-blue-50/50' : 'hover:bg-surface-1'
          }`}
        >
          {/* Drag handle */}
          <div className="flex-shrink-0 pt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
            <GripVertical size={14} className="text-gray-300" />
          </div>

          {/* Block type indicator */}
          <div className="flex-shrink-0 w-8 text-center pt-1">
            <span className="text-[10px] text-gray-400 font-mono">
              {BLOCK_TYPES.find((t) => t.type === block.type)?.icon || '¶'}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">{renderBlock(block)}</div>

          {/* Block controls */}
          <div className="flex-shrink-0 pt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <button
              onClick={() => addBlock(block.id)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Add block below"
            >
              <Plus size={14} className="text-gray-400" />
            </button>
            <button
              onClick={() => removeBlock(block.id)}
              className="p-1 hover:bg-red-100 rounded transition-colors"
              title="Delete block"
            >
              <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </div>
      ))}

      {/* Add block button */}
      <button
        onClick={() => addBlock(blocks[blocks.length - 1]?.id || '', 'paragraph')}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-gray-600 hover:bg-surface-1 rounded-lg transition-colors w-full"
      >
        <Plus size={14} /> Add block
      </button>

      {/* Slash command palette */}
      {showPalette && (
        <div className="fixed inset-0 z-50" onClick={() => setShowPalette(false)}>
          <div
            className="absolute bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-64"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="px-4 py-2 text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Insert Block
            </p>
            {BLOCK_TYPES.map((type) => (
              <button
                key={type.type}
                onClick={() => {
                  if (paletteBlockId) {
                    updateBlockType(paletteBlockId, type.type);
                  }
                  setShowPalette(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-surface-1 transition-colors"
              >
                <span className="w-8 text-center text-gray-400 font-mono">{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
