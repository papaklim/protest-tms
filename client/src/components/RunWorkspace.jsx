import React from 'react';
import { Check, X, Ban, SkipForward } from 'lucide-react';

export const RunWorkspace = ({
  selectedRunId,
  filteredRuns,
  cases,
  activeRunCase,
  setActiveRunCase,
  handleUpdateStatusAndNext,
  handleUpdateRunResult,
  handleExecuteTest
}) => {
  const run = filteredRuns.find(r => r.id === selectedRunId);
  if (!run) {
    return (
      <div className="p-5 h-full w-full flex-grow overflow-y-auto">
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-8 text-center text-[#8b949e] italic">
          Тест-ран не найден.
        </div>
      </div>
    );
  }

  const total = run.results?.length || run.totalCount || 1;
  const passed = run.results?.filter(r => r.status === 'PASSED').length || run.passedCount || 0;
  const failed = run.results?.filter(r => r.status === 'FAILED').length || run.failedCount || 0;
  const blocked = run.results?.filter(r => r.status === 'BLOCKED').length || 0;
  const skipped = run.results?.filter(r => r.status === 'SKIPPED').length || 0;
  const executed = run.results?.filter(r => r.status !== 'UNTESTED').length || (passed + failed + blocked + skipped);
  
  const passedPercent = (passed / total) * 100;
  const failedPercent = (failed / total) * 100;
  const blockedPercent = (blocked / total) * 100;
  const skippedPercent = (skipped / total) * 100;

  const statusMap = {
    'NEW': 'Новый',
    'DRAFT': 'Черновик',
    'ACTIVE': 'Активный',
    'DEPRECATED': 'Устаревший',
    'CREATED': 'Создан',
    'IN_PROGRESS': 'В процессе',
    'COMPLETED': 'Завершен',
    'PASSED': 'Успешно',
    'FAILED': 'Упал',
    'BLOCKED': 'Блокирован',
    'SKIPPED': 'Пропущен',
    'UNTESTED': 'Не проверен'
  };

  return (
    <div className="flex flex-col gap-6 p-5 overflow-y-auto h-full flex-grow">
      {/* Информация о тест-ране */}
      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5 flex flex-col gap-4 shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#8b949e] font-semibold uppercase tracking-wider">Тест-ран</span>
            <h3 className="text-lg font-bold text-[#f0f6fc]">{run.name}</h3>
          </div>
          <div className="flex gap-4">
            <span className="text-xs text-[#8b949e]">Всего кейсов: <strong className="text-[#f0f6fc]">{total}</strong></span>
            <span className="text-xs text-[#8b949e]">Выполнено: <strong className="text-[#f0f6fc]">{executed}</strong></span>
          </div>
        </div>

        {/* Прогресс-бары с градиентом */}
        <div className="flex flex-col gap-2">
          <div className="w-full h-2.5 rounded-full bg-[#30363d] overflow-hidden flex shadow-inner">
            {total > 0 && (
              <>
                <div style={{ width: `${passedPercent}%`, background: 'linear-gradient(90deg, #2ea043, #56d364)' }} className="h-full" title={`Успешно: ${Math.round(passedPercent)}%`} />
                <div style={{ width: `${failedPercent}%`, background: 'linear-gradient(90deg, #f85149, #f97316)' }} className="h-full" title={`Упало: ${Math.round(failedPercent)}%`} />
                <div style={{ width: `${blockedPercent}%`, background: 'linear-gradient(90deg, #eab308, #f59e0b)' }} className="h-full" title={`Блокировано: ${Math.round(blockedPercent)}%`} />
                <div style={{ width: `${skippedPercent}%`, background: 'linear-gradient(90deg, #6b7280, #9ca3af)' }} className="h-full" title={`Пропущено: ${Math.round(skippedPercent)}%`} />
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-semibold">
            <span style={{ color: passedPercent >= 80 ? '#56d364' : passedPercent >= 50 ? '#d29922' : '#f87171' }}>Успешно: {Math.round(passedPercent)}%</span>
            {failed > 0 && <span style={{ color: '#f97316' }}>Упало: {Math.round(failedPercent)}%</span>}
            {blocked > 0 && <span className="text-[#eab308]">Блок: {Math.round(blockedPercent)}%</span>}
            {skipped > 0 && <span className="text-stone-400">Пропущено: {Math.round(skippedPercent)}%</span>}
          </div>
        </div>
      </div>

      {/* Список тест-кейсов / Focus Mode */}
      <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '20px' }}>
        {activeRunCase?.runId === run.id ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Кейсы в прогоне (Режим фокуса):</h4>
              <button
                type="button"
                onClick={() => setActiveRunCase(null)}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: '1px solid #30363d',
                  background: '#21262d',
                  color: '#c9d1d9',
                  cursor: 'pointer'
                }}
              >
                Свернуть детали
              </button>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              {/* Левый список в Focus Mode */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                {[...run.results].sort((a, b) => (a.testcaseTitle || '').localeCompare(b.testcaseTitle || '')).map(res => {
                  const isSelected = activeRunCase.testcaseId === res.testcaseId;
                  return (
                    <div
                      key={res.testcaseId}
                      onClick={() => setActiveRunCase({ runId: run.id, testcaseId: res.testcaseId })}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        borderRadius: '8px',
                        border: isSelected ? '1px solid #1f6feb' : '1px solid #30363d',
                        background: isSelected ? 'rgba(31, 111, 235, 0.05)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? '#58a6ff' : '#c9d1d9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                        {res.testcaseTitle || `Кейс #${res.testcaseId}`}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 'bold',
                        padding: '2px 6px',
                        borderRadius: '12px',
                        ...(res.status === 'PASSED' ? {
                          color: '#56d364',
                          background: 'rgba(46,164,79,0.12)',
                        } : res.status === 'FAILED' ? {
                          color: '#f97316',
                          background: 'rgba(249,115,22,0.12)',
                        } : res.status === 'BLOCKED' ? {
                          color: '#eab308',
                          background: 'rgba(234,179,8,0.1)',
                        } : res.status === 'SKIPPED' ? {
                          color: '#9ca3af',
                          background: 'rgba(156,163,175,0.08)',
                        } : {
                          color: '#8b949e'
                        })
                      }}>
                        {statusMap[res.status] || res.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Правая панель шагов в Focus Mode */}
              <div style={{ flex: 1.4, borderLeft: '1px solid #30363d', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(() => {
                  const fullCase = cases.find(c => c.id === activeRunCase.testcaseId);
                  const currentResult = run.results.find(r => r.testcaseId === activeRunCase.testcaseId);
                  
                  if (!fullCase) {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f0f6fc', margin: 0 }}>
                          {currentResult?.testcaseTitle || `Кейс #${activeRunCase.testcaseId}`}
                        </h3>
                        <div style={{ fontSize: '12px', color: '#8b949e', fontStyle: 'italic' }}>
                          Детальная информация о тест-кейсе не найдена в репозитории.
                        </div>
                        {run.status !== 'COMPLETED' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatusAndNext(run, activeRunCase.testcaseId, 'PASSED')}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyCenter: 'center',
                                gap: '6px',
                                borderRadius: '8px',
                                border: '1px solid rgba(46, 164, 79, 0.4)',
                                background: 'rgba(35, 134, 54, 0.1)',
                                padding: '10px',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#56d364',
                                cursor: 'pointer'
                              }}
                            >
                              <Check size={14} strokeWidth={3} /> Успешно
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatusAndNext(run, activeRunCase.testcaseId, 'FAILED')}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyCenter: 'center',
                                gap: '6px',
                                borderRadius: '8px',
                                border: '1px solid rgba(248, 81, 73, 0.4)',
                                background: 'rgba(248, 81, 73, 0.1)',
                                padding: '10px',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#ff7b72',
                                cursor: 'pointer'
                              }}
                            >
                              <X size={14} strokeWidth={3} /> Упал
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <>
                      <div>
                        <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8b949e', fontWeight: 'bold' }}>
                          {fullCase.section || 'Общее'} • {fullCase.layer || 'UI'}
                        </span>
                        <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f0f6fc', marginTop: '4px', marginBottom: 0 }}>{fullCase.title}</h3>
                        {fullCase.description && (
                          <p style={{ fontSize: '12px', color: '#8b949e', marginTop: '4px', marginBottom: 0 }}>{fullCase.description}</p>
                        )}
                      </div>

                      {/* Шаги воспроизведения */}
                      {Array.isArray(fullCase.steps) && fullCase.steps.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <h5 style={{ fontSize: '11px', fontWeight: 600, color: '#8b949e', margin: 0 }}>Шаги воспроизведения:</h5>
                          <div style={{ borderRadius: '8px', border: '1px solid #30363d', overflow: 'hidden', background: 'rgba(13, 17, 23, 0.5)' }}>
                            <table style={{ width: '100%', textAlign: 'left', fontSize: '12px', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid #30363d', background: '#161b22', color: '#8b949e' }}>
                                  <th style={{ padding: '8px', width: '40px', textAlign: 'center' }}>#</th>
                                  <th style={{ padding: '8px' }}>Действие</th>
                                  <th style={{ padding: '8px' }}>Ожидаемый результат</th>
                                </tr>
                              </thead>
                              <tbody>
                                {fullCase.steps.map((step, idx) => (
                                  <tr key={idx} style={{ borderBottom: '1px solid rgba(48, 54, 61, 0.3)' }}>
                                    <td style={{ padding: '8px', textAlign: 'center', color: '#8b949e', fontWeight: 600 }}>{idx + 1}</td>
                                    <td style={{ padding: '8px', fontFamily: 'monospace', color: '#c9d1d9' }}>{step.action}</td>
                                    <td style={{ padding: '8px', fontFamily: 'monospace', color: '#8b949e' }}>{step.expected || '—'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Ожидаемый результат чек-листа */}
                      {(!fullCase.steps || fullCase.steps.length === 0) && fullCase.expectedResult && (
                        <div style={{ borderRadius: '8px', border: '1px solid #30363d', background: 'rgba(13, 17, 23, 0.3)', padding: '12px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 600, color: '#8b949e' }}>Ожидаемый результат:</span>
                          <p style={{ fontSize: '12px', color: '#f0f6fc', marginTop: '4px', marginBottom: 0 }}>{fullCase.expectedResult}</p>
                        </div>
                      )}

                      {/* Кнопки статуса в фокус моде */}
                      {run.status !== 'COMPLETED' && (
                        <div className="border-t border-[#30363d] pt-3 flex flex-col gap-2">
                          <span className="text-[10px] font-semibold text-[#8b949e]">Установить статус и перейти к следующему:</span>
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => handleUpdateStatusAndNext(run, activeRunCase.testcaseId, 'PASSED')}
                              className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 border cursor-pointer ${currentResult?.status === 'PASSED' ? 'bg-[#238636] text-white border-[#238636]' : 'border-green-500/30 text-[#56d364] bg-green-500/10 hover:border-green-400 hover:bg-[#238636] hover:text-white hover:shadow-[0_0_8px_rgba(46,164,79,0.4)] hover:scale-[1.05]'}`}>
                              <Check size={13} strokeWidth={3} /> Успешно
                            </button>
                            <button type="button" onClick={() => handleUpdateStatusAndNext(run, activeRunCase.testcaseId, 'FAILED')}
                              className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 border cursor-pointer ${currentResult?.status === 'FAILED' ? 'bg-[#da3637] text-white border-[#da3637]' : 'border-red-500/30 text-[#ff7b72] bg-red-500/10 hover:border-red-400 hover:bg-[#da3637] hover:text-white hover:shadow-[0_0_8px_rgba(248,81,73,0.4)] hover:scale-[1.05]'}`}>
                              <X size={13} strokeWidth={3} /> Упал
                            </button>
                            <button type="button" onClick={() => handleUpdateStatusAndNext(run, activeRunCase.testcaseId, 'BLOCKED')}
                              className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 border cursor-pointer ${currentResult?.status === 'BLOCKED' ? 'bg-[#d29922] text-white border-[#d29922]' : 'border-yellow-500/30 text-[#eab308] bg-yellow-500/10 hover:border-yellow-400 hover:bg-[#d29922] hover:text-white hover:shadow-[0_0_8px_rgba(234,179,8,0.4)] hover:scale-[1.05]'}`}>
                              <Ban size={13} strokeWidth={2} /> Блок
                            </button>
                            <button type="button" onClick={() => handleUpdateStatusAndNext(run, activeRunCase.testcaseId, 'SKIPPED')}
                              className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 border cursor-pointer ${currentResult?.status === 'SKIPPED' ? 'bg-[#57606a] text-white border-[#57606a]' : 'border-gray-500/30 text-[#8b949e] bg-gray-500/10 hover:border-gray-400 hover:bg-[#57606a] hover:text-white hover:shadow-[0_0_8px_rgba(139,148,158,0.4)] hover:scale-[1.05]'}`}>
                              <SkipForward size={13} strokeWidth={2} /> Пропустить
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Тест-кейсы в прогоне (кликните для деталей):</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {run.results?.map(res => (
                <div
                  key={res.testcaseId}
                  onClick={() => setActiveRunCase({ runId: run.id, testcaseId: res.testcaseId })}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '12px',
                    minHeight: '110px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  className="hover:border-[#8b949e]/30 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-200"
                >
                  <span style={{ fontSize: '13px', color: '#f0f6fc', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '36px', marginBottom: '8px' }} title={res.testcaseTitle}>
                    {res.testcaseTitle || `Кейс #${res.testcaseId}`}
                  </span>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(48, 54, 61, 0.5)', paddingTop: '10px', marginTop: 'auto' }} onClick={e => e.stopPropagation()}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      ...(res.status === 'PASSED' ? {
                        color: '#56d364',
                        background: 'linear-gradient(135deg, rgba(46,164,79,0.15), rgba(86,211,100,0.08))',
                        border: '1px solid rgba(46,164,79,0.25)',
                      } : res.status === 'FAILED' ? {
                        color: '#f97316',
                        background: 'linear-gradient(135deg, rgba(248,81,73,0.15), rgba(249,115,22,0.1))',
                        border: '1px solid rgba(249,115,22,0.3)',
                      } : res.status === 'BLOCKED' ? {
                        color: '#eab308',
                        background: 'rgba(234,179,8,0.1)',
                        border: '1px solid rgba(234,179,8,0.25)',
                      } : res.status === 'SKIPPED' ? {
                        color: '#9ca3af',
                        background: 'rgba(156,163,175,0.08)',
                        border: '1px solid rgba(156,163,175,0.2)',
                      } : {
                        color: '#8b949e',
                        background: 'transparent',
                      })
                    }}>
                      {statusMap[res.status] || res.status}
                    </span>

                    {run.status !== 'COMPLETED' && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          title="Отметить как Успешно"
                          onClick={(e) => { e.stopPropagation(); handleUpdateRunResult(run.id, res.testcaseId, 'PASSED'); }}
                          className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 border ${res.status === 'PASSED' ? 'bg-[#238636] text-white border-[#238636]' : 'border-green-500/30 text-[#56d364] bg-green-500/10 hover:border-green-400 hover:bg-[#238636] hover:text-white hover:shadow-[0_0_8px_rgba(46,164,79,0.4)] hover:scale-[1.15]'}`}
                        >
                          <Check size={12} strokeWidth={3} />
                        </button>
                        <button
                          type="button"
                          title="Отметить как Упал"
                          onClick={(e) => { e.stopPropagation(); handleUpdateRunResult(run.id, res.testcaseId, 'FAILED'); }}
                          className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 border ${res.status === 'FAILED' ? 'bg-[#da3637] text-white border-[#da3637]' : 'border-red-500/30 text-[#ff7b72] bg-red-500/10 hover:border-red-400 hover:bg-[#da3637] hover:text-white hover:shadow-[0_0_8px_rgba(248,81,73,0.4)] hover:scale-[1.15]'}`}
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                        <button
                          type="button"
                          title="Отметить как Блокирован"
                          onClick={(e) => { e.stopPropagation(); handleUpdateRunResult(run.id, res.testcaseId, 'BLOCKED'); }}
                          className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 border ${res.status === 'BLOCKED' ? 'bg-[#d29922] text-white border-[#d29922]' : 'border-yellow-500/30 text-[#eab308] bg-yellow-500/10 hover:border-yellow-400 hover:bg-[#d29922] hover:text-white hover:shadow-[0_0_8px_rgba(234,179,8,0.4)] hover:scale-[1.15]'}`}
                        >
                          <Ban size={12} strokeWidth={2} />
                        </button>
                        <button
                          type="button"
                          title="Отметить как Пропущен"
                          onClick={(e) => { e.stopPropagation(); handleUpdateRunResult(run.id, res.testcaseId, 'SKIPPED'); }}
                          className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 border ${res.status === 'SKIPPED' ? 'bg-[#57606a] text-white border-[#57606a]' : 'border-gray-500/30 text-[#8b949e] bg-gray-500/10 hover:border-gray-400 hover:bg-[#57606a] hover:text-white hover:shadow-[0_0_8px_rgba(139,148,158,0.4)] hover:scale-[1.15]'}`}
                        >
                          <SkipForward size={12} strokeWidth={2} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
