'use client';

import { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

const METHOD_STYLES: Record<string, { bg: string; text: string }> = {
  GET: { bg: 'bg-green-500/10', text: 'text-green-700' },
  POST: { bg: 'bg-[#3D5A80]/10', text: 'text-[#3D5A80]' },
  PUT: { bg: 'bg-amber-500/10', text: 'text-amber-700' },
  DELETE: { bg: 'bg-[#D63230]/10', text: 'text-[#D63230]' },
};

const METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;

export function ApiDocBlock({ node, updateAttributes }: any) {
  const { method, path, description, params, responseExample } = node.attrs as {
    method: string;
    path: string;
    description: string;
    params: Param[];
    responseExample: string;
  };
  const [showResponse, setShowResponse] = useState(true);
  const methodStyle = METHOD_STYLES[method] || METHOD_STYLES.GET;

  const updateParam = (index: number, field: keyof Param, value: any) => {
    const next = params.map((p: Param, i: number) => (i === index ? { ...p, [field]: value } : p));
    updateAttributes({ params: next });
  };

  const addParam = () => {
    updateAttributes({
      params: [...params, { name: '', type: 'string', required: false, description: '' }],
    });
  };

  const removeParam = (index: number) => {
    updateAttributes({ params: params.filter((_: Param, i: number) => i !== index) });
  };

  return (
    <NodeViewWrapper className="my-6">
      <div className="border border-[#1a1a2e]/10 rounded-lg bg-[#FAF6F1] overflow-hidden" contentEditable={false}>
        {/* Endpoint header */}
        <div className="px-4 py-3 bg-[#1a1a2e]/[0.02] border-b border-[#1a1a2e]/10 flex items-center gap-3">
          <select
            value={method}
            onChange={(e) => updateAttributes({ method: e.target.value })}
            className={`${methodStyle.bg} ${methodStyle.text} font-[family-name:var(--font-jetbrains)] text-xs font-bold px-2.5 py-1 rounded border-none focus:outline-none cursor-pointer`}
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={path}
            onChange={(e) => updateAttributes({ path: e.target.value })}
            placeholder="/api/endpoint"
            className="flex-1 bg-transparent font-[family-name:var(--font-jetbrains)] text-sm text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 focus:outline-none border-none"
          />
        </div>

        <div className="p-4 space-y-4">
          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => updateAttributes({ description: e.target.value })}
            placeholder="Describe what this endpoint does..."
            rows={2}
            className="w-full bg-transparent font-[family-name:var(--font-newsreader)] text-sm text-[#1a1a2e]/70 placeholder:text-[#1a1a2e]/25 focus:outline-none border-none resize-y leading-relaxed"
          />

          {/* Parameters */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40">
                Parameters
              </span>
              <button
                onClick={addParam}
                className="px-2 py-0.5 text-[10px] font-[family-name:var(--font-jetbrains)] text-[#3D5A80]/60 hover:text-[#3D5A80] bg-[#3D5A80]/[0.05] hover:bg-[#3D5A80]/10 rounded transition-colors"
              >
                + Param
              </button>
            </div>

            {params.length > 0 && (
              <div className="border border-[#1a1a2e]/8 rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#1a1a2e]/[0.03] border-b border-[#1a1a2e]/8">
                      <th className="px-2 py-1.5 text-left font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 font-semibold">
                        Name
                      </th>
                      <th className="px-2 py-1.5 text-left font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 font-semibold">
                        Type
                      </th>
                      <th className="px-2 py-1.5 text-center font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 font-semibold">
                        Req
                      </th>
                      <th className="px-2 py-1.5 text-left font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 font-semibold">
                        Description
                      </th>
                      <th className="w-6" />
                    </tr>
                  </thead>
                  <tbody>
                    {params.map((param: Param, i: number) => (
                      <tr key={i} className="border-b border-[#1a1a2e]/5 group hover:bg-[#3D5A80]/[0.02]">
                        <td className="px-1">
                          <input
                            type="text"
                            value={param.name}
                            onChange={(e) => updateParam(i, 'name', e.target.value)}
                            placeholder="name"
                            className="w-full px-1 py-1.5 bg-transparent font-[family-name:var(--font-jetbrains)] text-xs text-[#D63230] placeholder:text-[#1a1a2e]/20 focus:outline-none border-none"
                          />
                        </td>
                        <td className="px-1">
                          <input
                            type="text"
                            value={param.type}
                            onChange={(e) => updateParam(i, 'type', e.target.value)}
                            placeholder="string"
                            className="w-full px-1 py-1.5 bg-transparent font-[family-name:var(--font-jetbrains)] text-xs text-[#3D5A80] placeholder:text-[#1a1a2e]/20 focus:outline-none border-none"
                          />
                        </td>
                        <td className="px-1 text-center">
                          <input
                            type="checkbox"
                            checked={param.required}
                            onChange={(e) => updateParam(i, 'required', e.target.checked)}
                            className="accent-[#D63230]"
                          />
                        </td>
                        <td className="px-1">
                          <input
                            type="text"
                            value={param.description}
                            onChange={(e) => updateParam(i, 'description', e.target.value)}
                            placeholder="Description"
                            className="w-full px-1 py-1.5 bg-transparent font-[family-name:var(--font-newsreader)] text-xs text-[#1a1a2e]/60 placeholder:text-[#1a1a2e]/20 focus:outline-none border-none"
                          />
                        </td>
                        <td className="w-6 text-center">
                          <button
                            onClick={() => removeParam(i)}
                            className="text-[10px] text-[#D63230]/0 group-hover:text-[#D63230]/60 hover:!text-[#D63230] transition-colors"
                          >
                            x
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Response Example */}
          <div>
            <button
              onClick={() => setShowResponse(!showResponse)}
              className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-[#1a1a2e]/40 hover:text-[#1a1a2e]/60 transition-colors flex items-center gap-1 mb-2"
            >
              <svg
                className={`w-3 h-3 transition-transform ${showResponse ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              Response Example
            </button>
            {showResponse && (
              <div className="rounded bg-[#1a1a2e] p-3 overflow-x-auto">
                <textarea
                  value={responseExample}
                  onChange={(e) => updateAttributes({ responseExample: e.target.value })}
                  placeholder='{ "key": "value" }'
                  rows={6}
                  className="w-full bg-transparent font-[family-name:var(--font-jetbrains)] text-xs text-green-400/80 placeholder:text-white/20 focus:outline-none border-none resize-y leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
