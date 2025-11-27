import { useEffect, useState } from 'react';
import { getApiUrl } from '../../../services/api';
import '../Evento.css';
import EventoOrdinarioBaseForm from './EventoOrdinarioBaseForm';

const DIA_LABEL = { SEG: 'Segunda', TER: 'Terça', QUA: 'Quarta', QUI: 'Quinta', SEX: 'Sexta', SAB: 'Sábado', DOM: 'Domingo' };

export default function EditarEventoOrdinario({ isOpen, onClose, evento, turmas, disciplinas, onSuccess }) {
    const [applyScope, setApplyScope] = useState('single');
    const isOrdinario = Boolean(evento?.dia_semana);

    useEffect(() => {
        if (!isOpen || !evento) return;
        setApplyScope('single');
    }, [isOpen, evento]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) onClose?.();
    };

    const submitOverride = async (values) => {
        let url = '';
        const method = 'PATCH';
        const body = {
            hora_evento_inicio: values.hora_evento_inicio,
            hora_evento_fim: values.hora_evento_fim,
            turma: Number(values.turma),
            disciplina: Number(values.disciplina),
            limite: values.limite,
            sala: values.sala || null,
            status_atendimento: values.status_atendimento,
        };

        if (isOrdinario) {
            if (applyScope === 'series') {
                const countRes = await fetch(getApiUrl(`/services/evento-ordinario/${evento.id}/series-count/`));
                const countJson = await countRes.json().catch(() => ({ count: 0 }));
                const n = countJson?.count ?? 0;

                const parts = [];
                const oldStart = (evento?.hora_evento_inicio || '').slice(0, 5);
                const oldEnd = (evento?.hora_evento_fim || '').slice(0, 5);
                const newStart = values.hora_evento_inicio;
                const newEnd = values.hora_evento_fim;
                if (oldStart !== newStart || oldEnd !== newEnd) {
                    parts.push(`Horário: ${oldStart}–${oldEnd} → ${newStart}–${newEnd}`);
                }
                const oldDia = evento?.dia_semana;
                const newDia = values.dia_semana;
                if (newDia && newDia !== oldDia) {
                    parts.push(`Dia: ${DIA_LABEL[oldDia] || oldDia} → ${DIA_LABEL[newDia] || newDia}`);
                }
                const findTurma = (id) => turmas?.find?.(t => String(t.id) === String(id));
                const findDisc = (id) => disciplinas?.find?.(d => String(d.id) === String(id));
                if (String(evento?.turma) !== String(values.turma)) {
                    const o = findTurma(evento?.turma);
                    const nTurma = findTurma(values.turma);
                    parts.push(`Turma: ${o?.nome || evento?.turma} → ${nTurma?.nome || values.turma}`);
                }
                if (String(evento?.disciplina) !== String(values.disciplina)) {
                    const o = findDisc(evento?.disciplina);
                    const nDisc = findDisc(values.disciplina);
                    parts.push(`Disciplina: ${o?.nome || evento?.disciplina} → ${nDisc?.nome || values.disciplina}`);
                }
                if ((evento?.limite ?? null) !== (values.limite ?? null)) {
                    parts.push(`Limite: ${evento?.limite ?? ''} → ${values.limite ?? ''}`);
                }
                if ((evento?.sala ?? '') !== (values.sala ?? '')) {
                    parts.push(`Sala: ${evento?.sala ?? ''} → ${values.sala ?? ''}`);
                }
                if ((evento?.status_atendimento ?? '') !== (values.status_atendimento ?? '')) {
                    parts.push(`Status: ${evento?.status_atendimento ?? ''} → ${values.status_atendimento ?? ''}`);
                }

                const summary = parts.length ? `\n\nAlterações:\n - ${parts.join('\n - ')}` : '';
                const proceed = window.confirm(`Isso atualizará ${n} ocorrência(s) desta recorrência.${summary}\n\nDeseja continuar?`);
                if (!proceed) return false;

                url = getApiUrl(`/services/evento-ordinario/${evento.id}/editar/`);
                body.apply_scope = 'series';
                if (values.dia_semana) body.dia_semana = values.dia_semana;
            } else {
                url = getApiUrl(`/services/eventos/${evento.id}/`);
            }
        } else {
            url = getApiUrl(`/services/eventos/${evento.id}/`);
        }

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Falha ao salvar');
        }
        return true;
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h4>Editar Atendimento</h4>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>

                {isOrdinario && (
                    <div className="apply-scope-box">
                        <div className="apply-scope-title">Aplicar</div>
                        <div className="apply-scope-group">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" id="scope-single" name="scope" value="single" checked={applyScope === 'single'} onChange={() => setApplyScope('single')} />
                                <label className="form-check-label" htmlFor="scope-single">Apenas este evento</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" id="scope-series" name="scope" value="series" checked={applyScope === 'series'} onChange={() => setApplyScope('series')} />
                                <label className="form-check-label" htmlFor="scope-series">Toda a recorrência (a partir desta data)</label>
                            </div>
                        </div>
                    </div>
                )}

                <EventoOrdinarioBaseForm
                    mode="edit"
                    initialValues={{
                        dia_semana: evento?.dia_semana,
                        hora_evento_inicio: evento?.hora_evento_inicio,
                        hora_evento_fim: evento?.hora_evento_fim,
                        data_fim: evento?.data_fim,
                        turma: evento?.turma,
                        disciplina: evento?.disciplina,
                        limite: evento?.limite,
                        sala: evento?.sala,
                        status_atendimento: evento?.status_atendimento,
                    }}
                    hideFields={{ diaSemana: false, dataFim: true }}
                    onCancel={onClose}
                    onSuccess={onSuccess}
                    onSubmitOverride={submitOverride}
                />
            </div>
        </div>
    );
}
