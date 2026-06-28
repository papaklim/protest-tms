import React from 'react';
import { Play, AlertTriangle } from 'lucide-react';

export const RunListSidebar = ({
  handleCreateRun,
  newRunName,
  setNewRunName,
  isCreatingRun,
  cases,
  selectedCaseIdsForRun,
  setSelectedCaseIdsForRun,
  filteredRuns,
  selectedRunId,
  setSelectedRunId,
  setActiveRunCase,
}) => {
  const [showValidationError, setShowValidationError] = React.useState(false);

  const handleToggleCase = (id) => {
    if (selectedCaseIdsForRun.includes(id)) {
      setSelectedCaseIdsForRun(selectedCaseIdsForRun.filter(cid => cid !== id));
    } else {
      setSelectedCaseIdsForRun([...selectedCaseIdsForRun, id]);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'CREATED': return 'Новый';
      case 'IN_PROGRESS': return 'В процессе';
      case 'COMPLETED': return 'Завершен';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'CREATED': return 'text-[#58a6ff] border border-[#58a6ff]/30 bg-[#58a6ff]/5';
      case 'IN_PROGRESS': return 'text-[#d29922] border border-[#d29922]/30 bg-[#d29922]/5';
      case 'COMPLETED': return 'text-[#3fb950] border border-[#3fb950]/30 bg-[#3fb950]/5';
      default: return 'text-[#8b949e] border border-[#30363d]';
    }
  };

  const getSuccessColor = (pct) => {
    if (pct >= 80) return '#3fb950';
    if (pct >= 50) return '#d29922';
    return '#f87171';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newRunName || !newRunName.trim()) {
      setShowValidationError(true);
      return;
    }
    setShowValidationError(false);
    handleCreateRun(e);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden gap-4">
      {/* Форма создания нового тест-рана */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 flex flex-col gap-3 shadow-md"
      >
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-[#8b949e]">Название тест-рана</label>
          <input
            type="text"
            className={`rounded border bg-[#0d1117] px-2.5 py-1.5 text-xs text-[#e6edf3] focus:outline-none transition-all duration-200 ${
              showValidationError 
                ? 'border-[#f85149] focus:border-[#f85149] focus:ring-1 focus:ring-[#f85149]/20' 
                : 'border-[#30363d] focus:border-[#58a6ff]'
            }`}
            placeholder="Например: Nightly Smoke 1.4"
            value={newRunName}
            onChange={e => {
              setNewRunName(e.target.value);
              if (e.target.value.trim() && showValidationError) {
                setShowValidationError(false);
              }
            }}
            required
          />
          {showValidationError && (
            <div className="text-[11px] text-[#f85149] bg-[#f85149]/8 border border-[#f85149]/25 rounded-md px-2.5 py-1.5 flex items-center gap-1.5 mt-1 transition-all duration-200">
              <AlertTriangle size={12} className="flex-shrink-0" />
              <span>Название тест-рана обязательно</span>
            </div>
          )}
        </div>

        {/* Выбор кейсов */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] text-[#8b949e] font-semibold uppercase">
            <span>Кейсы для запуска ({selectedCaseIdsForRun.length} / {cases.length})</span>
            <div className="flex gap-1.5">
              {(() => {
                const allSelected = selectedCaseIdsForRun.length === cases.length && cases.length > 0;
                const anySelected = selectedCaseIdsForRun.length > 0;
                return (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedCaseIdsForRun(cases.map(c => c.id))}
                      className="btn btn-sm"
                      style={{
                        color: allSelected ? '#58a6ff' : '#8b949e',
                        background: allSelected ? 'rgba(88,166,255,0.1)' : 'transparent',
                        borderColor: allSelected ? 'rgba(88,166,255,0.3)' : '#30363d',
                      }}
                    >Все</button>
                    <button
                      type="button"
                      onClick={() => setSelectedCaseIdsForRun([])}
                      className="btn btn-sm"
                      style={{
                        color: anySelected ? '#f87171' : '#8b949e',
                        background: anySelected ? 'rgba(248,113,113,0.08)' : 'transparent',
                        borderColor: anySelected ? 'rgba(248,113,113,0.25)' : '#30363d',
                      }}
                    >Очистить</button>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="max-h-[140px] overflow-y-auto border border-[#30363d] bg-[#0d1117] rounded-lg p-2 flex flex-col gap-1.5">
            {cases.map(tc => {
              const isChecked = selectedCaseIdsForRun.includes(tc.id);
              return (
                <label key={tc.id} className="flex items-center gap-2 text-xs text-[#c9d1d9] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleCase(tc.id)}
                    className="w-3.5 h-3.5 rounded border-[#30363d] bg-[#161b22] text-[#1f6feb] focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="truncate">{tc.title}</span>
                </label>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={isCreatingRun}
          className="btn btn-primary w-full"
        >
          {isCreatingRun ? (
            <><span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />Запуск...</>
          ) : (
            <><Play size={12} fill="currentColor" /> Запустить прогон</>
          )}
        </button>
      </form>

      {/* Список тест-ранов */}
      <div className="flex flex-col flex-grow overflow-hidden gap-2">
        <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">Список тест-ранов:</h4>
        <div className="flex-grow overflow-y-auto space-y-2 pr-1">
          {filteredRuns.map(run => {
            const isSelected = selectedRunId === run.id;
            const total = run.results?.length || run.totalCount || 1;
            const passed = run.results?.filter(r => r.status === 'PASSED').length || run.passedCount || 0;
            const failed = run.results?.filter(r => r.status === 'FAILED').length || run.failedCount || 0;
            const executed = run.results?.filter(r => r.status !== 'UNTESTED').length || (passed + failed);
            const passedPercent = Math.round((passed / total) * 100);

            return (
              <div
                key={run.id}
                onClick={() => {
                  setSelectedRunId(run.id);
                  setActiveRunCase(null);
                }}
                className={`rounded-xl border p-3 flex flex-col gap-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#1f6feb] bg-[#1f6feb]/5'
                    : 'border-[#30363d] bg-[#161b22] hover:border-[#8b949e]/30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-[#f0f6fc] truncate max-w-[200px]" title={run.name}>{run.name}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusClass(run.status)}`}>
                    {getStatusText(run.status)}
                  </span>
                </div>

                <div className="text-[10px] text-[#8b949e] flex justify-between">
                  <span>Выполнено: {executed} / {total}</span>
                  <span className="font-semibold" style={{ color: getSuccessColor(passedPercent) }}>Успешно: {passedPercent}%</span>
                </div>

                {/* Прогресс-бар с градиентом */}
                <div className="w-full h-1.5 rounded-full bg-[#30363d] overflow-hidden flex">
                  {total > 0 && (
                    <>
                      <div 
                        style={{ 
                          width: `${(passed / total) * 100}%`,
                          background: 'linear-gradient(90deg, #2ea043, #56d364)'
                        }} 
                        className="h-full" 
                      />
                      <div 
                        style={{ 
                          width: `${(failed / total) * 100}%`,
                          background: 'linear-gradient(90deg, #f85149, #f97316)'
                        }} 
                        className="h-full" 
                      />
                    </>
                  )}
                </div>

                <span className="text-[9px] text-[#8b949e] self-end">
                  {run.createdAt ? new Date(run.createdAt).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '—'}
                </span>
              </div>
            );
          })}
          {filteredRuns.length === 0 && (
            <div className="text-xs italic text-[#8b949e] text-center py-4">
              Тест-раны не найдены
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
