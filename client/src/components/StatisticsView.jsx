import React from 'react';
import { 
  BarChart2, 
  Layers, 
  Play, 
  Folder, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Activity, 
  Monitor, 
  Cpu, 
  GitMerge 
} from 'lucide-react';

export const StatisticsView = ({ projects = [], cases = [], runs = [], selectedProjectId }) => {
  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  
  // 1. Global Metrics
  const totalProjectsCount = projects.length;
  const totalCasesCount = cases.length;
  const totalRunsCount = runs.length;

  // 2. Selected Project Metrics
  const projectCases = currentProject ? cases.filter(c => c.projectId === currentProject.id) : [];
  const projectRuns = currentProject ? runs.filter(r => r.projectId === currentProject.id) : [];

  const totalProjCases = projectCases.length;
  const automatedCases = projectCases.filter(c => c.isAutomated).length;
  const manualCases = totalProjCases - automatedCases;
  const automationRate = totalProjCases > 0 ? Math.round((automatedCases / totalProjCases) * 100) : 0;

  // Layer breakdown
  const uiCases = projectCases.filter(c => c.layer === 'UI').length;
  const apiCases = projectCases.filter(c => c.layer === 'API').length;
  const e2eCases = projectCases.filter(c => c.layer === 'E2E').length;

  const uiPercent = totalProjCases > 0 ? Math.round((uiCases / totalProjCases) * 100) : 0;
  const apiPercent = totalProjCases > 0 ? Math.round((apiCases / totalProjCases) * 100) : 0;
  const e2ePercent = totalProjCases > 0 ? Math.round((e2eCases / totalProjCases) * 100) : 0;

  // Run statistics
  const totalProjRuns = projectRuns.length;
  const passedRuns = projectRuns.filter(r => r.status === 'COMPLETED' || r.status === 'PASSED').length; 
  const failedRuns = projectRuns.filter(r => r.status === 'FAILED').length;
  const runningRuns = projectRuns.filter(r => r.status === 'RUNNING' || r.status === 'PENDING').length;
  const successRate = totalProjRuns > 0 ? Math.round((passedRuns / totalProjRuns) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 w-full text-[#c9d1d9]">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[#30363d]">
        <div>
          <h2 className="text-[20px] font-semibold text-[#f0f6fc] m-0 flex items-center gap-2">
            <BarChart2 className="text-[#58a6ff]" size={20} /> 
            Аналитика и Статистика
          </h2>
          <p className="text-xs text-[#8b949e] m-0 mt-1">
            {currentProject ? `Проект: ${currentProject.name}` : 'Выберите проект для просмотра аналитики'}
          </p>
        </div>
        
        {/* Global info badges */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-[#161b22] px-3.5 py-1.5 rounded-lg border border-[#30363d]">
            <Folder size={14} className="text-[#8b949e]" />
            <span className="text-xs font-semibold">Проектов: {totalProjectsCount}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#161b22] px-3.5 py-1.5 rounded-lg border border-[#30363d]">
            <Layers size={14} className="text-[#8b949e]" />
            <span className="text-xs font-semibold">Всего кейсов: {totalCasesCount}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#161b22] px-3.5 py-1.5 rounded-lg border border-[#30363d]">
            <Play size={14} className="text-[#8b949e]" />
            <span className="text-xs font-semibold">Всего ранов: {totalRunsCount}</span>
          </div>
        </div>
      </div>

      {!currentProject ? (
        <div className="flex-grow flex flex-col justify-center items-center gap-2 text-[#8b949e]">
          <Activity size={48} className="stroke-[1.5]" />
          <span>Нет активных проектов для сбора статистики</span>
        </div>
      ) : (
        <>
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Automation Level Card */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-[10px] pt-[14px] px-4 pb-4 flex flex-col justify-between hover:border-[#58a6ff]/45 transition-colors duration-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Уровень автоматизации</span>
                <span className="text-xs font-semibold text-[#58a6ff] bg-[#58a6ff]/10 px-2 py-0.5 rounded-full">
                  {automationRate}%
                </span>
              </div>
              <div className="my-4 flex items-baseline gap-2">
                <span className="text-[32px] font-bold text-[#f0f6fc]">{automatedCases}</span>
                <span className="text-xs text-[#8b949e]">из {totalProjCases} кейсов</span>
              </div>
              <div className="w-full bg-[#30363d] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${automationRate}%` }}
                />
              </div>
            </div>

            {/* Run Success Rate Card */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-[10px] pt-[14px] px-4 pb-4 flex flex-col justify-between hover:border-[#3fb950]/45 transition-colors duration-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Успешность тестов</span>
                <span className="text-xs font-semibold text-[#3fb950] bg-[#3fb950]/10 px-2 py-0.5 rounded-full">
                  {successRate}%
                </span>
              </div>
              <div className="my-4 flex items-baseline gap-2">
                <span className="text-[32px] font-bold text-[#f0f6fc]">{passedRuns}</span>
                <span className="text-xs text-[#8b949e]">из {totalProjRuns} ранов успешно</span>
              </div>
              <div className="w-full bg-[#30363d] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#2ea44f] to-[#3fb950] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${successRate}%` }}
                />
              </div>
            </div>

            {/* Types Distribution Card */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-[10px] pt-[14px] px-4 pb-4 flex flex-col justify-between hover:border-[#ab7df6]/45 transition-colors duration-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Типы тестирования</span>
                <span className="text-xs font-semibold text-[#ab7df6] bg-[#ab7df6]/10 px-2 py-0.5 rounded-full">
                  {totalProjCases} всего
                </span>
              </div>
              <div className="my-4 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs text-[#8b949e]">Автоматические</span>
                  <span className="text-[20px] font-bold text-[#f0f6fc]">{automatedCases}</span>
                </div>
                <div className="w-[1px] bg-[#30363d] h-8" />
                <div className="flex flex-col">
                  <span className="text-xs text-[#8b949e]">Ручные</span>
                  <span className="text-[20px] font-bold text-[#f0f6fc]">{manualCases}</span>
                </div>
              </div>
              <div className="w-full flex h-2 rounded-full overflow-hidden bg-[#30363d]">
                {totalProjCases > 0 && (
                  <>
                    <div 
                      className="bg-gradient-to-r from-[#238636] to-[#2ea44f] h-full" 
                      style={{ width: `${automationRate}%` }} 
                      title={`Автоматические: ${automationRate}%`}
                    />
                    <div 
                      className="bg-gradient-to-r from-[#db6d28] to-[#f0883e] h-full" 
                      style={{ width: `${100 - automationRate}%` }} 
                      title={`Ручные: ${100 - automationRate}%`}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Lower Columns Dashboard */}
          <div className="flex flex-col lg:flex-row gap-5 min-h-0 flex-grow">
            {/* Left Column: Layers Distribution */}
            <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-[10px] pt-[14px] px-4 pb-4 flex flex-col gap-4">
              <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider m-0 mb-2 border-b border-[#30363d] pb-2 flex items-center gap-2">
                <Layers size={14} className="text-[#8b949e]" />
                Распределение по слоям (Layers)
              </h3>
              
              <div className="flex flex-col gap-4">
                {/* UI Layer */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-2 font-medium text-[#c9d1d9]">
                      <Monitor size={14} className="text-[#58a6ff]" />
                      UI (Интерфейс)
                    </span>
                    <span className="font-semibold text-[#8b949e]">{uiCases} кейсов ({uiPercent}%)</span>
                  </div>
                  <div className="w-full bg-[#30363d] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] h-full rounded-full" 
                      style={{ width: `${uiPercent}%` }}
                    />
                  </div>
                </div>

                {/* API Layer */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-2 font-medium text-[#c9d1d9]">
                      <Cpu size={14} className="text-[#ff7b72]" />
                      API (Интеграции)
                    </span>
                    <span className="font-semibold text-[#8b949e]">{apiCases} кейсов ({apiPercent}%)</span>
                  </div>
                  <div className="w-full bg-[#30363d] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#da3633] to-[#ff7b72] h-full rounded-full" 
                      style={{ width: `${apiPercent}%` }}
                    />
                  </div>
                </div>

                {/* E2E Layer */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-2 font-medium text-[#c9d1d9]">
                      <GitMerge size={14} className="text-[#ab7df6]" />
                      E2E (Сквозные тесты)
                    </span>
                    <span className="font-semibold text-[#8b949e]">{e2eCases} кейсов ({e2ePercent}%)</span>
                  </div>
                  <div className="w-full bg-[#30363d] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#8957e5] to-[#ab7df6] h-full rounded-full" 
                      style={{ width: `${e2ePercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Recent Runs summary */}
            <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-[10px] pt-[14px] px-4 pb-4 flex flex-col gap-4">
              <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider m-0 mb-2 border-b border-[#30363d] pb-2 flex items-center gap-2">
                <Play size={14} className="text-[#8b949e]" />
                Последние тест-раны проекта
              </h3>
              
              <div className="flex flex-col gap-2.5 overflow-y-auto flex-grow min-h-0 pr-1">
                {projectRuns.length === 0 ? (
                  <div className="text-xs text-[#8b949e] py-6 text-center">Нет ранов в этом проекте</div>
                ) : (
                  projectRuns.slice(0, 15).map((run) => {
                    const runPassed = run.status === 'COMPLETED' || run.status === 'PASSED';
                    const runFailed = run.status === 'FAILED';
                    const runRunning = run.status === 'RUNNING' || run.status === 'PENDING';
                    
                    return (
                      <div 
                        key={run.id} 
                        className="flex items-center justify-between p-2.5 bg-[#0d1117]/40 rounded-lg border border-[#30363d]/50 hover:border-[#30363d] transition-colors"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold text-[#c9d1d9] truncate max-w-[180px]">{run.name}</span>
                          <span className="text-[10px] text-[#8b949e]">
                            {run.createdAt ? new Date(run.createdAt).toLocaleString('ru-RU') : 'Дата неизвестна'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          {runPassed && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#3fb950] bg-[#3fb950]/10 px-2 py-0.5 rounded-full">
                              <CheckCircle2 size={12} /> Успешно
                            </span>
                          )}
                          {runFailed && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#f85149] bg-[#f85149]/10 px-2 py-0.5 rounded-full">
                              <XCircle size={12} /> Ошибка
                            </span>
                          )}
                          {runRunning && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#db6d28] bg-[#db6d28]/10 px-2 py-0.5 rounded-full">
                              <Loader2 size={12} className="animate-spin" /> Запуск
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
