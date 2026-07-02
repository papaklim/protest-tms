import React, { useState } from 'react';
import { Terminal, BarChart2, Trash2, Monitor, Cpu, GitMerge } from 'lucide-react';

export const BottomConsole = ({ activityLogs = [], cases = [], onClearLogs }) => {
  const [activeTab, setActiveTab] = useState('console');

  const totalCases = cases.length;
  const automatedCases = cases.filter(c => c.isAutomated).length;
  const manualCases = totalCases - automatedCases;
  const autoPercent = totalCases > 0 ? Math.round((automatedCases / totalCases) * 100) : 0;

  const uiCount = cases.filter(c => c.layer === 'UI').length;
  const apiCount = cases.filter(c => c.layer === 'API').length;
  const e2eCount = cases.filter(c => c.layer === 'E2E').length;

  return (
    <div className="flex flex-col h-full overflow-hidden text-xs">
      {/* Навигация по табам */}
      <div className="flex justify-between items-center border-b border-[#30363d] pt-1 pb-2 mb-3">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1.5 pb-1 font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === 'console'
                ? 'border-[#58a6ff] text-[#f0f6fc]'
                : 'border-transparent text-[#8b949e] hover:text-[#f0f6fc]'
            }`}
          >
            <Terminal size={14} /> Консоль логов
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex items-center gap-1.5 pb-1 font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === 'metrics'
                ? 'border-[#58a6ff] text-[#f0f6fc]'
                : 'border-transparent text-[#8b949e] hover:text-[#f0f6fc]'
            }`}
          >
            <BarChart2 size={14} /> Покрытие и слои
          </button>
        </div>

        {activeTab === 'console' && (
          <button
            onClick={onClearLogs}
            className="flex items-center justify-center p-1.5 text-[#8b949e] hover:text-[#f85149] hover:bg-[#f85149]/10 rounded transition-colors cursor-pointer"
            title="Очистить логи"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Контент табов */}
      <div className="flex-grow overflow-y-auto">
        {activeTab === 'console' ? (
          <div className="font-mono space-y-1.5 leading-relaxed text-[#c9d1d9] select-text">
            {activityLogs.map((log, idx) => (
              <div key={idx} className="flex gap-2.5">
                <span className="text-[#8b949e] flex-shrink-0">
                  {log.timestamp ? new Date(log.timestamp).toLocaleTimeString('ru-RU') : ''}
                </span>
                <span className="text-[#58a6ff] font-bold">[SYSTEM]</span>
                <span className="break-all">{log.message}</span>
              </div>
            ))}
            {activityLogs.length === 0 && (
              <div className="text-[#8b949e] italic text-center py-4">
                Логи отсутствуют. Выполните действия (создайте тест-кейс или запустите прогон) для логирования.
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8 py-2">
            {/* Автоматизация */}
            <div className="rounded-lg border border-[#30363d] bg-[#0d1117]/30 p-4 flex flex-col gap-3">
              <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Степень автоматизации</span>
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full border-4 border-[#30363d]">
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-[#56d364] text-sm">
                    {autoPercent}%
                  </div>
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#238636"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - autoPercent / 100)}`}
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-[#8b949e]">Всего тестов: <strong className="text-[#f0f6fc]">{totalCases}</strong></span>
                  <span className="text-[#56d364]">Автоматизировано: <strong>{automatedCases}</strong></span>
                  <span className="text-[#8b949e]">Ручных: <strong>{manualCases}</strong></span>
                </div>
              </div>
            </div>

            {/* Распределение по слоям */}
            <div className="rounded-lg border border-[#30363d] bg-[#0d1117]/30 p-4 flex flex-col gap-3">
              <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Тестовые слои</span>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-[#c9d1d9]">
                    <Monitor size={13} className="text-[#58a6ff]" />
                    UI (Интерфейс)
                  </span>
                  <span className="font-semibold text-[#8b949e]">
                    {uiCount} кейсов ({totalCases > 0 ? Math.round((uiCount / totalCases) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#30363d] overflow-hidden">
                  <div style={{ width: `${totalCases > 0 ? (uiCount / totalCases) * 100 : 0}%` }} className="bg-[#58a6ff] h-full" />
                </div>

                <div className="flex justify-between items-center text-xs mt-1">
                  <span className="flex items-center gap-1.5 font-medium text-[#c9d1d9]">
                    <Cpu size={13} className="text-[#ff7b72]" />
                    API (Интеграции)
                  </span>
                  <span className="font-semibold text-[#8b949e]">
                    {apiCount} кейсов ({totalCases > 0 ? Math.round((apiCount / totalCases) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#30363d] overflow-hidden">
                  <div style={{ width: `${totalCases > 0 ? (apiCount / totalCases) * 100 : 0}%` }} className="bg-[#d29922] h-full" />
                </div>

                <div className="flex justify-between items-center text-xs mt-1">
                  <span className="flex items-center gap-1.5 font-medium text-[#c9d1d9]">
                    <GitMerge size={13} className="text-[#ab7df6]" />
                    E2E (Сквозные тесты)
                  </span>
                  <span className="font-semibold text-[#8b949e]">
                    {e2eCount} кейсов ({totalCases > 0 ? Math.round((e2eCount / totalCases) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#30363d] overflow-hidden">
                  <div style={{ width: `${totalCases > 0 ? (e2eCount / totalCases) * 100 : 0}%` }} className="bg-[#bc8cff] h-full" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
